import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, MapPin, Clock, ChevronRight } from 'lucide-react';

export default function NGOOpportunities() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [ngoName, setNgoName] = useState('');

  useEffect(() => {
    // Fetch opportunities
    axios
      .get('http://localhost:4001/api/opportunities')
      .then((res) => setOpportunities(res.data))
      .catch((err) => console.error(err));

    // Fetch NGO name from token (using existing /profile endpoint)
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:4001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          setNgoName(res.data.organisationName || res.data.fullName);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return opp.status === "Open";
    if (activeTab === "closed") return opp.status === "Closed";
    return true;
  });

  const handleEdit = (id) => {
    navigate(`/edit-opportunity/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      try {
        await axios.delete(
          `http://localhost:4001/api/opportunities/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOpportunities((prev) => prev.filter((o) => o._id !== id));
        alert("Opportunity deleted successfully");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete opportunity");
      }
    }
  };

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
              onClick={() => navigate('/create-opportunity')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
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
          {/* Tabs */}
          <div className="border-b px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Tabs */}
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`pb-1 font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'text-gray-900 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All ({opportunities.length})
                </button>
                <button
                  onClick={() => setActiveTab('open')}
                  className={`pb-1 font-medium transition-colors ${
                    activeTab === 'open'
                      ? 'text-gray-900 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Open ({opportunities.filter(opp => opp.status === "Open").length})
                </button>
                <button
                  onClick={() => setActiveTab('closed')}
                  className={`pb-1 font-medium transition-colors ${
                    activeTab === 'closed'
                      ? 'text-gray-900 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Closed ({opportunities.filter(opp => opp.status === "Closed").length})
                </button>
              </div>

              {/* Filter Dropdown */}
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="all">All Opportunities</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Opportunities List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredOpportunities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No opportunities found.</p>
                  <p className="text-gray-400 text-sm mt-2">Create your first opportunity to get started!</p>
                </div>
              ) : (
                filteredOpportunities.map((opp) => (
                  <div 
                    key={opp._id} 
                    className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {opp.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {ngoName || 'NGO'} · {new Date(opp.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            opp.status === 'Open' 
                              ? 'bg-green-100 text-green-700' 
                              : opp.status === 'Closed'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {opp.status}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {opp.description}
                        </p>

                        {/* Skills */}
                        {opp.skills && opp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {opp.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Duration and Location */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {opp.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              <span>{opp.location}</span>
                            </div>
                          )}
                          {opp.duration && (
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              <span>{opp.duration}</span>
                            </div>
                          )}
                        </div>

                        {/* View Details Link */}
                        <button 
                          onClick={() => navigate(`/opportunity/${opp._id}`)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium mt-4 text-sm"
                        >
                          View details
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      {/* Right Actions */}
                      <div className="flex lg:flex-col gap-2">
                        <button
                          onClick={() => handleEdit(opp._id)}
                          className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(opp._id)}
                          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
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