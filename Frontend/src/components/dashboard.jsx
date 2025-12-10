import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

            <span className="text-2xl font-bold text-black">SkillBride</span>
        

          {/* Navigation Links */}
          <div className="flex items-center gap-12">
            <a href="./" className="text-gray-700 hover:text-black font-medium">
              Dashboard
            </a>
            <a href="./postedopp" className="text-gray-700 hover:text-black font-medium">
              Opportunities
            </a>
            <a href="./Application" className="text-gray-700 hover:text-black font-medium">
              Application
            </a>
            <a href="./Messages" className="text-gray-700 hover:text-black font-medium">
              Messages
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-full">
              NGO
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR */}
          <div className="col-span-3">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              {/* Organization Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-1">Hope For All Foundation</h2>
                <p className="text-gray-600 text-sm">Ngo</p>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-100 rounded-xl text-left font-medium">
                  Dashboard
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl text-left font-medium text-gray-700">
                 Opportunities
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl text-left font-medium text-gray-700">
                  Applications
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl text-left font-medium text-gray-700">
                  Messages
                </button>
              </div>

              {/* Organization Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-black text-sm mb-2">ORGANIZATION INFO</h3>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-span-9 space-y-6">
            
            {/* OVERVIEW CARDS */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-6">Overview</h3>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-black mb-2">0</div>
                  <div className="text-sm text-gray-600">Active Opportunities</div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-black mb-2">0</div>
                  <div className="text-sm text-gray-600">Application</div>
                </div>

                <div className="bg-purple-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-black mb-2">0</div>
                  <div className="text-sm text-gray-600">Active Volunteers</div>
                </div>

                <div className="bg-yellow-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-black mb-2">0</div>
                  <div className="text-sm text-gray-600">Pending Application</div>
                </div>
              </div>
            </div>

            {/* RECENT APPLICATIONS */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black">Recent Applications</h3>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-xl">
                  View All
                </button>
              </div>

              {/* Application Card */}
              <div className="border-2 border-gray-200 rounded-2xl p-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    No recent application  </p>
                </div>
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="grid grid-cols-2 gap-6">
              
              {/* QUICK ACTIONS */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-black mb-6">Quick Actions</h3>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                  Create New Opportunity
                </button>
              </div>

              {/* VIEW MESSAGES */}
              <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-black">View Messages</h3>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}