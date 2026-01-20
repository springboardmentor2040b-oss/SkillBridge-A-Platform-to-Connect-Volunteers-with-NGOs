import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [stats, setStats] = useState({});
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

      const profileResponse = await axios.get(
        "http://localhost:4001/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const profile = profileResponse.data;
      const type = profile.role;
      setUserType(type);

      if (type === 'ngo') {
        setUserName(profile.organizationName || profile.fullName || "NGO User");
        
        const opportunitiesResponse = await axios.get(
          "http://localhost:4001/api/opportunities",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const allOpportunities = opportunitiesResponse.data;
        const myOpportunities = allOpportunities.filter(
          opp => opp.ngo && opp.ngo._id === profile._id
        );
        const activeOpps = myOpportunities.filter(opp => opp.status === "Open").length;

        const applicationsResponse = await axios.get(
          "http://localhost:4001/api/applications/ngo",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const applications = applicationsResponse.data;
        const totalApplications = applications.length;
        const pendingApps = applications.filter(app => app.status === "pending").length;
        
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
        setUserName(profile.fullName || "Volunteer User");

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
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const isNGO = userType === 'ngo';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 sticky top-16 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">
            {isNGO ? 'NGO Dashboard' : 'Volunteer Dashboard'}
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* SIDEBAR */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-0
            w-72 lg:w-64 bg-white
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:block flex-shrink-0
          `}>
            <div className="h-full lg:h-auto p-4 lg:p-0">
              {/* Close button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 truncate">{userName}</h2>
                    <p className="text-sm text-slate-500 capitalize">{userType}</p>
                  </div>
                </div>
              </div>

              {/* Navigation - Mobile */}
              <div className="lg:hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
                <nav className="space-y-1">
                  <button 
                    onClick={() => handleNavigation("/dashboard")}
                    className="w-full px-4 py-3 rounded-xl text-left font-semibold bg-slate-800 text-white"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => handleNavigation(isNGO ? "/ngo-opportunities" : "/opportunities")}
                    className="w-full px-4 py-3 rounded-xl text-left text-slate-600 hover:bg-slate-100"
                  >
                    {isNGO ? 'Opportunities' : 'Browse Opportunities'}
                  </button>
                  <button 
                    onClick={() => handleNavigation("/application")}
                    className="w-full px-4 py-3 rounded-xl text-left text-slate-600 hover:bg-slate-100"
                  >
                    Applications
                  </button>
                  <button 
                    onClick={() => handleNavigation("/messages")}
                    className="w-full px-4 py-3 rounded-xl text-left text-slate-600 hover:bg-slate-100"
                  >
                    Messages
                  </button>
                </nav>
              </div>

              {/* Navigation - Desktop */}
              <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
                <nav className="space-y-1">
                  <button 
                    onClick={() => handleNavigation("/dashboard")}
                    className="w-full px-4 py-3 rounded-xl text-left font-semibold bg-slate-800 text-white"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => handleNavigation(isNGO ? "/ngo-opportunities" : "/opportunities")}
                    className="w-full px-4 py-3 rounded-xl text-left text-slate-600 hover:bg-slate-100"
                  >
                    {isNGO ? 'Opportunities' : 'Browse Opportunities'}
                  </button>
                  <button 
                    onClick={() => handleNavigation("/application")}
                    className="w-full px-4 py-3 rounded-xl text-left text-slate-600 hover:bg-slate-100"
                  >
                    Applications
                  </button>
                  <button 
                    onClick={() => handleNavigation("/messages")}
                    className="w-full px-4 py-3 rounded-xl text-left text-slate-600 hover:bg-slate-100"
                  >
                    Messages
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            
            {/* Desktop Header */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold text-slate-800">
                {isNGO ? 'NGO Dashboard' : 'Volunteer Dashboard'}
              </h1>
              <p className="text-slate-500 mt-1">Welcome back, {userName}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
              
              {/* Card 1 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 lg:p-5 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl lg:text-4xl font-bold text-slate-800 mb-1">
                  {isNGO ? stats.activeOpportunities : stats.applications}
                </div>
                <div className="text-sm text-slate-500">
                  {isNGO ? 'Active Opportunities' : 'Applications'}
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 lg:p-5 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl lg:text-4xl font-bold text-slate-800 mb-1">
                  {isNGO ? stats.applications : stats.accepted}
                </div>
                <div className="text-sm text-slate-500">
                  {isNGO ? 'Applications' : 'Accepted'}
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 lg:p-5 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl lg:text-4xl font-bold text-slate-800 mb-1">
                  {isNGO ? stats.activeVolunteers : stats.pending}
                </div>
                <div className="text-sm text-slate-500">
                  {isNGO ? 'Volunteers' : 'Pending'}
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 lg:p-5 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl lg:text-4xl font-bold text-slate-800 mb-1">
                  {isNGO ? stats.pendingApplications : stats.skills}
                </div>
                <div className="text-sm text-slate-500">
                  {isNGO ? 'Pending' : 'Skills'}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              
              {/* Action 1 */}
              <button 
                onClick={() => handleNavigation(isNGO ? "/create-opportunity" : "/opportunities")}
                className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-800">
                  {isNGO ? 'Create Opportunity' : 'Browse Opportunities'}
                </span>
              </button>

              {/* Action 2 */}
              <button 
                onClick={() => handleNavigation("/messages")}
                className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-800">View Messages</span>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                {isNGO ? 'Recent Applications' : 'Recent Activity'}
              </h3>
              
              <div className="border border-slate-200 rounded-xl p-8 bg-slate-50 text-center">
                <p className="text-slate-600 font-medium mb-1">No recent activity</p>
                <p className="text-sm text-slate-500">
                  {isNGO ? 'Applications will appear here' : 'Your activity will appear here'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

