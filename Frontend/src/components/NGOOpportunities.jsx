import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, MapPin, Clock, ChevronRight, X, Calendar, User } from 'lucide-react';

export default function NGOOpportunities() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch opportunities
    axios
      .get('http://localhost:4001/api/opportunities')
      .then((res) => setOpportunities(res.data))
      .catch((err) => console.error(err));

    // Fetch current user info
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:4001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          setCurrentUserId(res.data._id);
          setCurrentUserRole(res.data.role);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return opp.status === "Open";
    if (activeTab === "closed") return opp.status === "Closed";
    if (activeTab === "yours") {
      return currentUserRole === 'ngo' && 
             opp.ngo && 
             opp.ngo._id === currentUserId;
    }
    return true;
  });

  // Check if current user can edit this opportunity
  const canEdit = (opportunity) => {
    return currentUserRole === 'ngo' && 
           opportunity.ngo && 
           opportunity.ngo._id === currentUserId;
  };

  const handleViewDetails = (opp) => {
    setSelectedOpportunity(opp);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOpportunity(null);
  };

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

  // Count for "Your Opportunities" tab
  const yourOpportunitiesCount = currentUserRole === 'ngo' 
    ? opportunities.filter(opp => opp.ngo && opp.ngo._id === currentUserId).length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Opportunities</h1>
              <p className="text-gray-600 mt-1">Browse volunteering opportunities from all NGOs</p>
            </div>
            {currentUserRole === 'ngo' && (
              <button 
                onClick={() => navigate('/create-opportunity')}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Create New Opportunity
              </button>
            )}
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
              <div className="flex gap-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`pb-1 font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'text-gray-900 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All ({opportunities.length})
                </button>
                <button
                  onClick={() => setActiveTab('open')}
                  className={`pb-1 font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'open'
                      ? 'text-gray-900 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Open ({opportunities.filter(opp => opp.status === "Open").length})
                </button>
                <button
                  onClick={() => setActiveTab('closed')}
                  className={`pb-1 font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'closed'
                      ? 'text-gray-900 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Closed ({opportunities.filter(opp => opp.status === "Closed").length})
                </button>
                {currentUserRole === 'ngo' && (
                  <button
                    onClick={() => setActiveTab('yours')}
                    className={`pb-1 font-medium transition-colors whitespace-nowrap ${
                      activeTab === 'yours'
                        ? 'text-gray-900 border-b-2 border-orange-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Your Opportunities ({yourOpportunitiesCount})
                  </button>
                )}
              </div>

              {/* Filter Dropdown */}
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer"
              >
                <option value="all">All Opportunities</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                {currentUserRole === 'ngo' && (
                  <option value="yours">Your Opportunities</option>
                )}
              </select>
            </div>
          </div>

          {/* Opportunities List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredOpportunities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No opportunities found.</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {activeTab === 'yours' 
                      ? "You haven't created any opportunities yet. Click 'Create New Opportunity' to get started!"
                      : "Check back later for new opportunities!"
                    }
                  </p>
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
                              {opp.ngo?.organisationName || opp.ngo?.fullName || 'NGO'} · {new Date(opp.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            opp.status === 'Open' 
                              ? 'bg-green-100 text-green-700' 
                              : opp.status === 'Closed'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-orange-100 text-orange-700'
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
                                className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium"
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

                        {/* View Details Button */}
                        <button 
                          onClick={() => handleViewDetails(opp)}
                          className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium mt-4 text-sm"
                        >
                          View details
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      {/* Right Actions - Only show if user can edit */}
                      {canEdit(opp) && (
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
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Opportunity Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Title and Status */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {selectedOpportunity.title}
                  </h3>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    selectedOpportunity.status === 'Open' 
                      ? 'bg-green-100 text-green-700' 
                      : selectedOpportunity.status === 'Closed'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {selectedOpportunity.status}
                  </span>
                </div>
                
                {/* NGO Info */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <User size={18} />
                  <span className="font-medium">
                    {selectedOpportunity.ngo?.organisationName || selectedOpportunity.ngo?.fullName || 'NGO'}
                  </span>
                  <span className="text-gray-400">·</span>
                  <Calendar size={18} />
                  <span>Posted on {new Date(selectedOpportunity.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedOpportunity.description}
                </p>
              </div>

              {/* Required Skills */}
              {selectedOpportunity.skills && selectedOpportunity.skills.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium border border-orange-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Duration */}
                {selectedOpportunity.duration && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={20} className="text-orange-500" />
                      <h4 className="font-semibold text-gray-900">Duration</h4>
                    </div>
                    <p className="text-gray-700">{selectedOpportunity.duration}</p>
                  </div>
                )}

                {/* Location */}
                {selectedOpportunity.location && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={20} className="text-orange-500" />
                      <h4 className="font-semibold text-gray-900">Location</h4>
                    </div>
                    <p className="text-gray-700">{selectedOpportunity.location}</p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              {selectedOpportunity.ngo?.email && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <p className="text-gray-700">
                    For more information, contact: <span className="font-medium">{selectedOpportunity.ngo.email}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
              {currentUserRole === 'volunteer' && selectedOpportunity.status === 'Open' && (
                <button
                  onClick={() => {
                    closeModal();
                    navigate(`/apply/${selectedOpportunity._id}`);
                  }}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition shadow-lg"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}