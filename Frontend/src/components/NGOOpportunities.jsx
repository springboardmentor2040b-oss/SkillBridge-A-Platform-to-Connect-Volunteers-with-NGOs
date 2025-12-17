import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

export default function NGOOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    axios
      .get('http://localhost:4001/api/opportunities')
      .then((res) => setOpportunities(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return opp.status === "Open";
    if (activeTab === "closed") return opp.status === "Closed";
    return true;
  });

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
                  All({opportunities.length})
                </button>
                <button
                  onClick={() => setActiveTab('open')}
                  className={`pb-1 font-medium transition-colors ${
                    activeTab === 'open'
                      ? 'text-gray-900 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Open ({opportunities.filter(opp => opp.status === "Open").length})
                </button>
                <button
                  onClick={() => setActiveTab('closed')}
                  className={`pb-1 font-medium transition-colors ${
                    activeTab === 'closed'
                      ? 'text-gray-900 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Closed ({opportunities.filter(opp => opp.status === "Closed").length})
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

          {/* Opportunities List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredOpportunities.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No opportunities found.</p>
              ) : (
                filteredOpportunities.map((opp) => (
                  <div key={opp._id} className="p-4 bg-gray-50 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800">{opp.title}</h3>
                    <p className="text-gray-600">{opp.description}</p>
                    {/* Show skills */}
                    {opp.skills && opp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {opp.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium bg-green-100 text-green-700 rounded-full px-3 py-1"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs font-medium bg-orange-100 text-orange-700 rounded-full px-3 py-1">
                        {opp.status}
                      </span>
                      <span className="text-xs font-medium bg-blue-100 text-blue-700 rounded-full px-3 py-1">
                        {new Date(opp.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={async () => {
                          if (window.confirm("Delete this opportunity?")) {
                            try {
                              await axios.delete(
                                `http://localhost:4001/api/opportunities/${opp._id}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                  },
                                }
                              );
                              setOpportunities((prev) => prev.filter((o) => o._id !== opp._id));
                            } catch (err) {
                              alert("Delete failed");
                            }
                          }
                        }}
                        className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}