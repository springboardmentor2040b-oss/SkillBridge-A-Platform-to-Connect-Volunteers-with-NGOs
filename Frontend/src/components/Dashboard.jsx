import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null); // 'ngo' or 'volunteer'
  const [stats, setStats] = useState({});
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

        setStats({
          applications: applications.length,
          accepted: acceptedApps,
          pending: pendingApps,
          skills: profile.skills?.length || 0
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // NGO Dashboard
  if (userType === 'ngo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* SIDEBAR */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-xl sm:text-2xl font-bold text-black">
                  {userName}
                </h2>
                <p className="text-gray-600 text-sm mb-6">NGO</p>

                <div className="space-y-2">
                  <button 
                    onClick={() => handleNavigation("/dashboard")}
                    className="w-full px-4 py-3 rounded-xl font-medium bg-blue-100 text-left
                    transition-all duration-300 hover:bg-blue-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    Dashboard
                  </button>

                  <button 
                    onClick={() => handleNavigation("/opportunities")}
                    className="w-full px-4 py-3 rounded-xl text-gray-700 text-left
                    transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5"
                  >
                    Opportunities
                  </button>

                  <button 
                    onClick={() => handleNavigation("/applications")}
                    className="w-full px-4 py-3 rounded-xl text-gray-700 text-left
                    transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5"
                  >
                    Applications
                  </button>

                  <button 
                    onClick={() => handleNavigation("/messages")}
                    className="w-full px-4 py-3 rounded-xl text-gray-700 text-left
                    transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5"
                  >
                    Messages
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="lg:col-span-9 space-y-6">

              {/* OVERVIEW */}
              <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8
                transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-lg sm:text-xl font-bold mb-6">
                  Overview
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                  {/* CARD - Active Opportunities */}
                  <div className="bg-blue-50 rounded-2xl p-6 text-center
                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]"
                  >
                    <div className="text-4xl font-bold text-black mb-2">
                      {stats.activeOpportunities}
                    </div>
                    <div className="text-sm text-gray-600">Active Opportunities</div>
                  </div>

                  {/* CARD - Applications */}
                  <div className="bg-green-50 rounded-2xl p-6 text-center
                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]"
                  >
                    <div className="text-4xl font-bold text-black mb-2">
                      {stats.applications}
                    </div>
                    <div className="text-sm text-gray-600">Applications</div>
                  </div>

                  {/* CARD - Active Volunteers */}
                  <div className="bg-purple-50 rounded-2xl p-6 text-center
                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]"
                  >
                    <div className="text-4xl font-bold text-black mb-2">
                      {stats.activeVolunteers}
                    </div>
                    <div className="text-sm text-gray-600">Active Volunteers</div>
                  </div>

                  {/* CARD - Pending Applications */}
                  <div className="bg-yellow-50 rounded-2xl p-6 text-center
                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]"
                  >
                    <div className="text-4xl font-bold text-black mb-2">
                      {stats.pendingApplications}
                    </div>
                    <div className="text-sm text-gray-600">Pending Applications</div>
                  </div>

                </div>
              </div>

              {/* RECENT APPLICATIONS */}
              <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8
                transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h3 className="text-lg sm:text-xl font-bold">
                    Recent Applications
                  </h3>

                  <button 
                    onClick={() => handleNavigation("/applications")}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold
                    px-6 py-2 rounded-xl transition-all duration-300
                    hover:shadow-lg hover:shadow-orange-400/40 hover:-translate-y-0.5"
                  >
                    View All
                  </button>
                </div>

                <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gray-50">
                  <p className="text-sm text-gray-700 text-center">
                    No recent applications
                  </p>
                </div>
              </div>

              {/* BOTTOM ACTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8
                  transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-6">
                    Quick Actions
                  </h3>

                  <button 
                    onClick={() => handleNavigation("/create-opportunity")}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold
                    py-4 rounded-2xl transition-all duration-300
                    hover:shadow-xl hover:shadow-orange-400/50 hover:-translate-y-1 active:scale-95"
                  >
                    Create New Opportunity
                  </button>
                </div>

                <div 
                  onClick={() => handleNavigation("/messages")}
                  className="bg-white rounded-3xl shadow-lg p-6 sm:p-8
                  transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                  flex items-center justify-center cursor-pointer"
                >
                  <h3 className="text-lg sm:text-xl font-bold">
                    View Messages
                  </h3>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* SIDEBAR */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-black">
                {userName}
              </h2>
              <p className="text-gray-600 text-sm mb-6">Volunteer</p>

              <div className="space-y-2">
                <button 
                  onClick={() => handleNavigation("/dashboard")}
                  className="w-full px-4 py-3 rounded-xl font-medium bg-blue-100 text-left
                  transition-all duration-300 hover:bg-blue-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  Dashboard
                </button>

                <button 
                  onClick={() => handleNavigation("/opportunities")}
                  className="w-full px-4 py-3 rounded-xl text-gray-700 text-left
                  transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5"
                >
                  Browse Opportunities
                </button>

                <button 
                  onClick={() => handleNavigation("/my-applications")}
                  className="w-full px-4 py-3 rounded-xl text-gray-700 text-left
                  transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5"
                >
                  My Applications
                </button>

                <button 
                  onClick={() => handleNavigation("/messages")}
                  className="w-full px-4 py-3 rounded-xl text-gray-700 text-left
                  transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5"
                >
                  Messages
                </button>

              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-9 space-y-6">

            {/* YOUR IMPACT */}
            <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8
              transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-lg sm:text-xl font-bold mb-6">
                Your Impact
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                {/* CARD - Applications */}
                <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]"
                >
                  <div className="text-4xl font-bold text-black mb-2">
                    {stats.applications}
                  </div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>

                {/* CARD - Accepted */}
                <div className="bg-green-50 rounded-2xl p-6 text-center
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]"
                >
                  <div className="text-4xl font-bold text-black mb-2">
                    {stats.accepted}
                  </div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>

                {/* CARD - Pending */}
                <div className="bg-yellow-50 rounded-2xl p-6 text-center
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]"
                >
                  <div className="text-4xl font-bold text-black mb-2">
                    {stats.pending}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>

                {/* CARD - Skills */}
                <div className="bg-purple-50 rounded-2xl p-6 text-center
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stats.skills}
                  </div>
                  <div className="text-sm text-gray-600">Skills</div>
                </div>

              </div>
            </div>

            {/* RECENT MESSAGES */}
            <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8
              transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-lg sm:text-xl font-bold mb-6">
                Recent Messages
              </h3>

              <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gray-50 mb-4">
                <p className="text-sm text-gray-700 text-center">
                  No recent messages
                </p>
              </div>

              <button 
                onClick={() => handleNavigation("/messages")}
                className="w-full border-2 border-gray-300 text-gray-700 font-semibold
                px-6 py-3 rounded-xl transition-all duration-300
                hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5"
              >
                View All Messages
              </button>
            </div>

            {/* BOTTOM ACTIONS */}
            <div>

              <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8
                transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <h3 className="text-lg sm:text-xl font-bold mb-6">
                  Explore Opportunities
                </h3>

                <button 
                  onClick={() => handleNavigation("/opportunities")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold
                  py-4 rounded-2xl transition-all duration-300
                  hover:shadow-xl hover:shadow-orange-400/50 hover:-translate-y-1 active:scale-95"
                >
                  Browse All Opportunities
                </button>
              </div>


            </div>

          </div>
        </div>
      </div>
    </div>
  );
}