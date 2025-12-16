import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function NGOOpportunities() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Opportunities</h1>
              <p className="text-gray-600 mt-1">Manage your volunteering opportunities</p>
            </div>
            <button 
              onClick={() => window.location.href = '/create-opportunity'}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Create New Opportunity
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm">
          {/* Tabs and Filter */}
          <div className="border-b px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Tabs */}
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`pb-1 font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'text-gray-900 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All (3)
                </button>
                <button
                  onClick={() => setActiveTab('open')}
                  className={`pb-1 font-medium transition-colors ${
                    activeTab === 'open'
                      ? 'text-gray-900 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Open (3)
                </button>
                <button
                  onClick={() => setActiveTab('closed')}
                  className={`pb-1 font-medium transition-colors ${
                    activeTab === 'closed'
                      ? 'text-gray-900 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Closed (0)
                </button>
              </div>

              {/* Filter Dropdown */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer">
                <option>All Opportunities</option>
                <option>Open</option>
                <option>Closed</option>
              </select>
            </div>
          </div>

          {/* Opportunities List - Empty State */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Opportunity cards will go here */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}