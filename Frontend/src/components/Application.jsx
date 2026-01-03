import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import axios from 'axios';
import { Clock, MapPin, Calendar, FileText, Trash2, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user profile to determine role
    axios
      .get('http://localhost:4001/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const role = res.data.role;
        setUserRole(role);

        // Fetch applications based on role
        const endpoint = role === 'volunteer' 
          ? 'http://localhost:4001/api/applications/volunteer'
          : 'http://localhost:4001/api/applications/ngo';

        return axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4001/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setApplications(applications.filter(app => app._id !== applicationId));
      alert('Application withdrawn successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:4001/api/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));

      alert(`Application ${newStatus} successfully`);
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status');
    }
  };

  const handleViewDetails = (app) => {
    setSelectedApplication(app);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'pending':
      default:
        return <AlertCircle size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {userRole === 'volunteer' ? 'My Applications' : 'Applications Received'}
          </h1>
          <p className="text-gray-600 mt-1">
            {userRole === 'volunteer' 
              ? 'Track the status of your volunteer applications'
              : 'Review and manage applications from volunteers'
            }
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm">
          {/* Tabs */}
          <div className="border-b px-6 py-4">
            <div className="flex gap-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-1 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'text-gray-900 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-1 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'pending'
                    ? 'text-gray-900 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending ({applications.filter(a => a.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`pb-1 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'accepted'
                    ? 'text-gray-900 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Accepted ({applications.filter(a => a.status === 'accepted').length})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`pb-1 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'rejected'
                    ? 'text-gray-900 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Rejected ({applications.filter(a => a.status === 'rejected').length})
              </button>
            </div>
          </div>

          {/* Applications List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No applications found.</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {userRole === 'volunteer'
                      ? "You haven't applied to any opportunities yet."
                      : "No volunteers have applied to your opportunities yet."
                    }
                  </p>
                  {userRole === 'volunteer' && (
                    <button
                      onClick={() => navigate('/opportunities')}
                      className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                    >
                      Browse Opportunities
                    </button>
                  )}
                </div>
              ) : (
                filteredApplications.map((app) => (
                  <div
                    key={app._id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {app.opportunity?.title || 'Opportunity'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {userRole === 'volunteer' 
                                ? (app.opportunity?.ngo?.organizationName || app.opportunity?.ngo?.fullName || 'NGO')
                                : (app.volunteer?.fullName || 'Volunteer')
                              }
                            </p>
                          </div>
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>

                        {/* Opportunity Details */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          {app.opportunity?.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              <span>{app.opportunity.location}</span>
                            </div>
                          )}
                          {app.opportunity?.duration && (
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              <span>{app.opportunity.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Cover Letter Preview (for NGOs) */}
                        {userRole === 'ngo' && app.coverLetter && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            "{app.coverLetter}"
                          </p>
                        )}

                        {/* Volunteer Skills (for NGOs) */}
                        {userRole === 'ngo' && app.volunteer?.skills && app.volunteer.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {app.volunteer.skills.slice(0, 5).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {app.volunteer.skills.length > 5 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                                +{app.volunteer.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => handleViewDetails(app)}
                          className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </div>

                      {/* Right Actions */}
                      <div className="flex lg:flex-col gap-2">
                        {userRole === 'volunteer' && app.status === 'pending' && (
                          <button
                            onClick={() => handleWithdraw(app._id)}
                            className="px-4 py-2 border-2 border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Withdraw
                          </button>
                        )}
                        
                        {userRole === 'ngo' && app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'accepted')}
                              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                            >
                              <CheckCircle size={16} />
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'rejected')}
                              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                            >
                              <XCircle size={16} />
                              Reject
                            </button>
                          </>
                        )}
                        {/* CHAT BUTTON (for BOTH roles when accepted) */}
                        {app.status === 'accepted' && (
                          <button
                          onClick={() => navigate(`/messages?applicationId=${app._id}`)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
                          >
                            <MessageSquare size={16} />
                            Chat
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Status */}
              <div>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedApplication.status)}`}>
                  {getStatusIcon(selectedApplication.status)}
                  {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                </span>
              </div>

              {/* Opportunity Info */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedApplication.opportunity?.title}
                </h3>
                <p className="text-gray-600">
                  {userRole === 'volunteer'
                    ? (selectedApplication.opportunity?.ngo?.organizationName || selectedApplication.opportunity?.ngo?.fullName || 'NGO')
                    : `Applied by ${selectedApplication.volunteer?.fullName || 'Volunteer'}`
                  }
                </p>
              </div>

              {/* Volunteer Info (for NGOs) */}
              {userRole === 'ngo' && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Volunteer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedApplication.volunteer?.fullName}</p>
                    <p><span className="font-medium">Email:</span> {selectedApplication.volunteer?.email}</p>
                    {selectedApplication.volunteer?.location && (
                      <p><span className="font-medium">Location:</span> {selectedApplication.volunteer.location}</p>
                    )}
                    {selectedApplication.volunteer?.bio && (
                      <p><span className="font-medium">Bio:</span> {selectedApplication.volunteer.bio}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-4">
                    {selectedApplication.coverLetter}
                  </p>
                </div>
              )}

              {/* Application Date */}
              <div className="text-sm text-gray-500">
                Applied on {new Date(selectedApplication.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
              {selectedApplication.status === 'accepted' && (
                <button
                onClick={() => {
                  setShowModal(false);
                  navigate(`/messages?applicationId=${selectedApplication._id}`);
                  }}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                  >
                  Open Chat
                </button>
              )}

              {userRole === 'ngo' && selectedApplication.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication._id, 'accepted')}
                    className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                  >
                    Accept Application
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication._id, 'rejected')}
                    className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
                  >
                    Reject Application
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}