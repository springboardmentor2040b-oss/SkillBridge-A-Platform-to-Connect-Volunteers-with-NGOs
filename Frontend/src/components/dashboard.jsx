import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* SIDEBAR */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-black">
                Hope For All Foundation
              </h2>
              <p className="text-gray-600 text-sm mb-6">NGO</p>

              <div className="space-y-2">
                <button className="w-full px-4 py-3 rounded-xl font-medium bg-blue-100
                  transition-all duration-300 hover:bg-blue-200 hover:shadow-md hover:-translate-y-0.5">
                  Dashboard
                </button>

                <button 
                  onClick={() => window.location.href = '/ngo-opportunities'}
                  className="w-full px-4 py-3 rounded-xl text-gray-700
                  transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5">
                  Opportunities
                </button>

                <button className="w-full px-4 py-3 rounded-xl text-gray-700
                  transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5">
                  Applications
                </button>

                <button className="w-full px-4 py-3 rounded-xl text-gray-700
                  transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5">
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

                {/* CARD */}
                <div className="bg-blue-50 rounded-2xl p-6 text-center cursor-pointer
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]">
                  <div className="text-4xl font-bold text-black mb-2">2</div>
                  <div className="text-sm text-gray-600">Active Opportunities</div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 text-center cursor-pointer
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]">
                  <div className="text-4xl font-bold text-black mb-2">3</div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>

                <div className="bg-purple-50 rounded-2xl p-6 text-center cursor-pointer
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]">
                  <div className="text-4xl font-bold text-black mb-2">1</div>
                  <div className="text-sm text-gray-600">Active Volunteers</div>
                </div>

                <div className="bg-yellow-50 rounded-2xl p-6 text-center cursor-pointer
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]">
                  <div className="text-4xl font-bold text-black mb-2">0</div>
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

                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold
                  px-6 py-2 rounded-xl transition-all duration-300
                  hover:shadow-lg hover:shadow-orange-400/40 hover:-translate-y-0.5">
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
                onClick={() => window.location.href = '/create-opportunity'}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold
                      py-4 rounded-2xl transition-all duration-300
                      hover:shadow-xl hover:shadow-orange-400/50 hover:-translate-y-1 active:scale-95">
                        Create New Opportunity
                </button>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8
                transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                flex items-center justify-center cursor-pointer">
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
