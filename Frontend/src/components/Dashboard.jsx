import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket, { joinNotifications, leaveNotifications } from "../socket";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null); // 'ngo' or 'volunteer'
  const [stats, setStats] = useState({});
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentApps, setRecentApps] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [suggestedOpps, setSuggestedOpps] = useState([]);
  const [appliedOpps, setAppliedOpps] = useState(new Set());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Real-time updates for messages
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.id;
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    socket.connect();
    joinNotifications(userId);

    const handleNewMessage = (data) => {
      // Re-fetch recent messages to get accurate state
      fetchRecentMessages(token);
    };

    const handleMessagesRead = (data) => {
      console.log("Dashboard: Received messages-read event", data);
      // Immediately update the local state to clear unread counts for this conversation
      setRecentMessages(prev =>
        prev.map(msg =>
          msg.applicationId === data.applicationId
            ? { ...msg, unreadCount: 0 }
            : msg
        )
      );

      // Also refresh from server to ensure consistency
      fetchRecentMessages(token);
    };

    socket.on("receive-message", handleNewMessage);
    socket.on("messages-read", handleMessagesRead);
    socket.on("new-notification", handleNewMessage);

    return () => {
      socket.off("receive-message", handleNewMessage);
      socket.off("messages-read", handleMessagesRead);
      socket.off("new-notification", handleNewMessage);
      leaveNotifications(userId);
    };
  }, []);

  const fetchRecentMessages = async (token) => {
    try {
      const res = await axios.get("http://localhost:4001/api/messages/user/recent", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentMessages(res.data);
    } catch (err) {
      console.error("Error fetching recent messages:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch user profile to determine user type
      const profileResponse = await axios.get(
        "http://localhost:4001/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const profile = profileResponse.data;
      const type = profile.role; // Using 'role' based on the backend
      setUserType(type);

      if (type === 'ngo') {
        // Fetch NGO-specific data
        setUserName(profile.organizationName || profile.fullName || "NGO User");

        // Fetch all opportunities created by this NGO
        const opportunitiesResponse = await axios.get(
          "http://localhost:4001/api/opportunities",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const allOpportunities = opportunitiesResponse.data;
        // Filter opportunities created by this NGO
        const myOpportunities = allOpportunities.filter(
          opp => opp.ngo && opp.ngo._id === profile._id
        );
        const activeOpps = myOpportunities.filter(opp => opp.status === "Open").length;

        // Fetch applications for this NGO's opportunities
        const applicationsResponse = await axios.get(
          "http://localhost:4001/api/applications/ngo",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const applications = applicationsResponse.data;
        // Sort by date just in case
        applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentApps(applications.slice(0, 5));

        const totalApplications = applications.length;
        const pendingApps = applications.filter(app => app.status === "pending").length;
        const acceptedApps = applications.filter(app => app.status === "accepted").length;

        // Get unique volunteers who have been accepted
        const uniqueAcceptedVolunteers = new Set(
          applications
            .filter(app => app.status === "accepted")
            .map(app => app.volunteer._id)
        );

        setStats({
          activeOpportunities: activeOpps,
          applications: totalApplications,
          activeVolunteers: uniqueAcceptedVolunteers.size,
          pendingApplications: pendingApps
        });

        // Fetch recent messages for NGO
        fetchRecentMessages(token);
      } else {
        // Fetch Volunteer-specific data
        setUserName(profile.fullName || "Volunteer User");

        // Fetch volunteer's applications
        const applicationsResponse = await axios.get(
          "http://localhost:4001/api/applications/volunteer",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const applications = applicationsResponse.data;
        const acceptedApps = applications.filter(app => app.status === "accepted").length;
        const pendingApps = applications.filter(app => app.status === "pending").length;

        const appliedIds = new Set(applications.map(app => app.opportunity?._id));
        setAppliedOpps(appliedIds);

        setStats({
          applications: applications.length,
          accepted: acceptedApps,
          pending: pendingApps,
          skills: profile.skills?.length || 0
        });

        // Fetch suggested opportunities
        const oppsResponse = await axios.get("http://localhost:4001/api/opportunities");
        setSuggestedOpps(oppsResponse.data.filter(opp => opp.status === 'Open').slice(0, 3));

        // Fetch recent messages
        fetchRecentMessages(token);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C2A48] flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // NGO Dashboard
  if (userType === 'ngo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Main White Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                  Welcome {userName}
                </h1>
                <p className="text-sm text-gray-500">Here's your organization overview</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">{userName.charAt(0)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* SIDEBAR */}
              <div className="lg:col-span-3">
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <button
                    onClick={() => handleNavigation("/dashboard")}
                    className="w-full px-4 py-3 rounded-xl font-medium bg-[#D4E4F7] text-gray-800 text-left
                    transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavigation("/opportunities")}
                    className="w-full px-4 py-3 rounded-xl text-gray-600 text-left font-medium
                    transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Opportunities
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavigation("/applications")}
                    className="w-full px-4 py-3 rounded-xl text-gray-600 text-left font-medium
                    transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Applications
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavigation("/messages")}
                    className="w-full px-4 py-3 rounded-xl text-gray-600 text-left flex items-center justify-between font-medium
                    transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Messages
                    </span>
                    {recentMessages.reduce((sum, m) => sum + (m.unreadCount || 0), 0) > 0 && (
                      <span className="bg-orange-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                        {recentMessages.reduce((sum, m) => sum + (m.unreadCount || 0), 0)}
                      </span>
                    )}
                  </button>


                </div>
              </div>

              {/* MAIN CONTENT */}
              <div className="lg:col-span-9 space-y-6">

                {/* STATS CARDS WITH CIRCULAR PROGRESS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                  {/* Active Opportunities */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800">{stats.activeOpportunities}</div>
                        <div className="text-xs text-gray-600 mt-1">Active</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">Opportunities</div>
                  </div>

                  {/* Applications */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800">{stats.applications}</div>
                        <div className="text-xs text-gray-600 mt-1">Total</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">Applications</div>
                  </div>

                  {/* Volunteers */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800">{stats.activeVolunteers}</div>
                        <div className="text-xs text-gray-600 mt-1">Active</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">Volunteers</div>
                  </div>

                  {/* Pending */}
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800">{stats.pendingApplications}</div>
                        <div className="text-xs text-gray-600 mt-1">Waiting</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">Pending</div>
                  </div>

                </div>

                {/* RECENT APPLICATIONS */}
                <div className="bg-gray-50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Recent Applications</h3>
                    <button
                      onClick={() => handleNavigation("/application")}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {recentApps.length > 0 ? (
                      recentApps.map((app) => (
                        <div key={app._id} className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                          <div>
                            <p className="font-semibold text-gray-900">{app.volunteer?.fullName || 'Volunteer'}</p>
                            <p className="text-sm text-gray-500">{app.opportunity?.title}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                            {app.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No recent applications</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Quick Actions Card */}
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
                    <h3 className="text-xl font-bold mb-2">Create Opportunity</h3>
                    <p className="text-purple-100 text-sm mb-6">Post a new volunteer opportunity</p>
                    <button
                      onClick={() => handleNavigation("/create-opportunity")}
                      className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:shadow-lg transition-all"
                    >
                      + Create Now
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="bg-gray-50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Messages</h3>
                      {recentMessages.reduce((sum, m) => sum + (m.unreadCount || 0), 0) > 0 && (
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {recentMessages.reduce((sum, m) => sum + (m.unreadCount || 0), 0)} new
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                      {recentMessages.length > 0 ? (
                        recentMessages.slice(0, 3).map((msg) => (
                          <div key={msg._id} className="p-3 bg-white rounded-xl hover:shadow-sm transition-all cursor-pointer" onClick={() => handleNavigation(`/messages/${msg.applicationId}`)}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-sm text-gray-900">{msg.chatPartnerName || msg.senderId?.fullName || "User"}</p>
                              {msg.unreadCount > 0 && (
                                <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                  {msg.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-1">{msg.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No messages</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleNavigation("/messages")}
                      className="w-full border-2 border-gray-300 text-gray-700 font-medium py-2 rounded-xl hover:bg-white transition-all text-sm"
                    >
                      View All
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Volunteer Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Main White Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                Welcome {userName}
              </h1>
              <p className="text-sm text-gray-500">Track your volunteer journey</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">{userName.charAt(0)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* SIDEBAR */}
            <div className="lg:col-span-3">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className="w-full px-4 py-3 rounded-xl font-medium bg-[#D4E4F7] text-gray-800 text-left
                  transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </span>
                </button>

                <button
                  onClick={() => handleNavigation("/opportunities")}
                  className="w-full px-4 py-3 rounded-xl text-gray-600 text-left font-medium
                  transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Opportunities
                  </span>
                </button>

                <button
                  onClick={() => handleNavigation("/my-applications")}
                  className="w-full px-4 py-3 rounded-xl text-gray-600 text-left font-medium
                  transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    My Applications
                  </span>
                </button>

                <button
                  onClick={() => handleNavigation("/messages")}
                  className="w-full px-4 py-3 rounded-xl text-gray-600 text-left flex items-center justify-between font-medium
                  transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Messages
                  </span>
                  {recentMessages.reduce((sum, m) => sum + (m.unreadCount || 0), 0) > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      {recentMessages.reduce((sum, m) => sum + (m.unreadCount || 0), 0)}
                    </span>
                  )}
                </button>


              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="lg:col-span-9 space-y-6">

              {/* STATS CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                {/* Applications */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-800">{stats.applications}</div>
                      <div className="text-xs text-gray-600 mt-1">Total</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Applications</div>
                </div>

                {/* Accepted */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-800">{stats.accepted}</div>
                      <div className="text-xs text-gray-600 mt-1">Success</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Accepted</div>
                </div>

                {/* Pending */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-800">{stats.pending}</div>
                      <div className="text-xs text-gray-600 mt-1">Waiting</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Pending</div>
                </div>

                {/* Skills */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-800">{stats.skills}</div>
                      <div className="text-xs text-gray-600 mt-1">Listed</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Skills</div>
                </div>

              </div>

              {/* MESSAGES & OPPORTUNITIES GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Messages */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Messages</h3>
                    {recentMessages.reduce((sum, m) => sum + (m.unreadCount || 0), 0) > 0 && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {recentMessages.reduce((sum, m) => sum + (m.unreadCount || 0), 0)} new
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                    {recentMessages.length > 0 ? (
                      recentMessages.map((msg) => (
                        <div key={msg._id} className="p-3 bg-white rounded-xl hover:shadow-sm transition-all cursor-pointer" onClick={() => handleNavigation(`/messages/${msg.applicationId}`)}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm text-gray-900">{msg.chatPartnerName || msg.senderId?.organizationName || "User"}</p>
                            {msg.unreadCount > 0 && (
                              <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {msg.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1">{msg.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No messages</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleNavigation("/messages")}
                    className="w-full border-2 border-gray-300 text-gray-700 font-medium py-2 rounded-xl hover:bg-white transition-all text-sm"
                  >
                    View All
                  </button>
                </div>

                {/* Discover CTA */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Discover Opportunities</h3>
                    <p className="text-purple-100 text-sm mb-6">Find volunteer opportunities that match your skills</p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/opportunities")}
                    className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    Browse Now
                  </button>
                </div>

              </div>

              {/* SUGGESTED OPPORTUNITIES */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Suggested for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {suggestedOpps.map(opp => (
                    <div key={opp._id} className="bg-white rounded-xl p-4 hover:shadow-md transition-all">
                      <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{opp.title}</h4>
                      <p className="text-xs text-gray-500 mb-3">{opp.ngo?.organizationName || "NGO"}</p>
                      <button
                        onClick={() => navigate(`/apply/${opp._id}`)}
                        disabled={appliedOpps.has(opp._id)}
                        className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${appliedOpps.has(opp._id)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                      >
                        {appliedOpps.has(opp._id) ? 'Applied' : 'Apply Now'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}