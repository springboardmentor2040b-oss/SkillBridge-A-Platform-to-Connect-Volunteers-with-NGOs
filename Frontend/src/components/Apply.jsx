import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Clock, Send, CheckCircle, AlertCircle, Briefcase } from 'lucide-react';

export default function Apply() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch opportunity details
    axios
      .get(`http://localhost:4001/api/opportunities/${id}`)
      .then((res) => {
        setOpportunity(res.data);
        setLoading(false);
        setError(''); // Clear any previous errors
      })
      .catch((err) => {
        console.error('Error fetching opportunity:', err);
        setError('Failed to load opportunity details');
        setLoading(false);
      });

    // Check if already applied
    axios
      .get('http://localhost:4001/api/applications/volunteer', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const hasApplied = res.data.some(app => app.opportunity._id === id);
        setAlreadyApplied(hasApplied);
      })
      .catch((err) => {
        console.error('Error checking applications:', err);
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError('');

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication required. Please log in again.');
      setSubmitting(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4001/api/applications',
        {
          opportunityId: id,
          coverLetter: coverLetter.trim()
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Application submitted successfully:', response.data);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/opportunities');
      }, 2000);
    } catch (err) {
      console.error('Error submitting application:', err);
      
      if (err.response) {
        const errorMessage = err.response.data?.message || 'Failed to submit application';
        setError(errorMessage);
        
        if (err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response.status === 403) {
          setError('You do not have permission to apply. Please ensure you are logged in as a volunteer.');
        } else if (err.response.status === 404) {
          setError('This opportunity no longer exists.');
        }
      } else if (err.request) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The opportunity you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/opportunities')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
          >
            Browse Opportunities
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your application has been successfully submitted. The NGO will review it and get back to you soon.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your applications...</p>
        </div>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => navigate('/opportunities')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Opportunities</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <AlertCircle size={64} className="text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Applied</h2>
            <p className="text-gray-600 mb-6">
              You have already submitted an application for this opportunity. You can view your application status in your applications page.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/application')}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
              >
                View My Applications
              </button>
              <button
                onClick={() => navigate('/opportunities')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Browse More Opportunities
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/opportunities')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Opportunities</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Apply for Opportunity</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side - Opportunity Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Opportunity Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{opportunity.title}</h3>
                  <p className="text-sm text-gray-500">
                    {opportunity.ngo?.organizationName || opportunity.ngo?.fullName || 'NGO'}
                  </p>
                </div>

                {opportunity.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} className="text-orange-500" />
                    <span className="text-sm">{opportunity.location}</span>
                  </div>
                )}

                {opportunity.duration && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={18} className="text-orange-500" />
                    <span className="text-sm">{opportunity.duration}</span>
                  </div>
                )}

                {opportunity.skills && opportunity.skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Briefcase size={18} className="text-orange-500" />
                      <span className="text-sm font-medium">Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    opportunity.status === 'Open' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {opportunity.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Application</h2>

              {error && !loading && opportunity && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the NGO why you're interested in this opportunity and what makes you a great fit..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    A well-written cover letter can increase your chances of being selected.
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Before you apply</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Review the opportunity details carefully</li>
                    <li>• You can only apply once per opportunity</li>
                    <li>• The NGO will review your application and contact you</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/opportunities')}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}