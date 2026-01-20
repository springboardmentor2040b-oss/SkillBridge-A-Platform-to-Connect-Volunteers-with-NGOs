import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Clock, ChevronRight, X, Calendar, User, Bell } from 'lucide-react';

export default function VolunteerOpportunities() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);

  // Filter states
  const [searchSkills, setSearchSkills] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Open');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkillTags, setSelectedSkillTags] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:4001/api/opportunities')
      .then((res) => {
        setOpportunities(res.data);
        setFilteredOpportunities(res.data.filter(opp => opp.status === 'Open'));

        const skills = new Set();
        res.data.forEach(opp => {
          if (opp.skills) {
            opp.skills.forEach(skill => skills.add(skill));
          }
        });
        setAvailableSkills(Array.from(skills));
      })
      .catch((err) => console.error(err));

    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:4001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          setCurrentUserRole(res.data.role);

          // Fetch applied opportunities for volunteers
          if (res.data.role === 'volunteer') {
            axios
              .get('http://localhost:4001/api/applications/volunteer', {
                headers: { Authorization: `Bearer ${token}` }
              })
              .then((appRes) => {
                const appliedIds = appRes.data.map(app => app.opportunity?._id || app.opportunity);
                setAppliedOpportunities(appliedIds);
              })
              .catch((err) => console.error('Error fetching applications:', err));
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    let filtered = opportunities;

    if (selectedStatus) {
      filtered = filtered.filter(opp => opp.status === selectedStatus);
    }

    // Filter by selected skill tags - ALL skills must match
    if (selectedSkillTags.length > 0) {
      filtered = filtered.filter(opp =>
        opp.skills && selectedSkillTags.every(selectedSkill =>
          opp.skills.includes(selectedSkill)
        )
      );
    }

    // Filter by search skills input - ALL skills must match
    if (searchSkills.trim()) {
      const searchTerms = searchSkills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      filtered = filtered.filter(opp =>
        opp.skills && searchTerms.every(term =>
          opp.skills.some(skill => skill.toLowerCase().includes(term))
        )
      );
    }

    if (searchLocation.trim()) {
      filtered = filtered.filter(opp =>
        opp.location && opp.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    setFilteredOpportunities(filtered);
  }, [opportunities, selectedSkillTags, searchSkills, searchLocation, selectedStatus]);

  const handleSkillTagClick = (skill) => {
    if (selectedSkillTags.includes(skill)) {
      setSelectedSkillTags(selectedSkillTags.filter(s => s !== skill));
    } else {
      setSelectedSkillTags([...selectedSkillTags, skill]);
    }
  };

  const handleResetFilters = () => {
    setSearchSkills('');
    setSearchLocation('');
    setSelectedStatus('Open');
    setSelectedSkillTags([]);
  };

  const handleViewDetails = (opp) => {
    setSelectedOpportunity(opp);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOpportunity(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Volunteering Opportunities</h1>
              <p className="text-purple-100 pt-2 mt-1">Find opportunities that match your skills and interests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border-[2px] border-gray-400 rounded-2xl shadow-sm overflow-hidden">
          {/* Filter Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              {/* Skills Search with Dropdown */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Skills Required
                </label>
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchSkills}
                  onChange={(e) => setSearchSkills(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                {/* Skill Tags below input */}
                {availableSkills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {availableSkills.map((skill, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSkillTagClick(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border ${selectedSkillTags.includes(skill)
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                          }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Search */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Current Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none cursor-pointer transition-all"
                >
                  <option value="">All Opportunities</option>
                  <option value="Open">Currently Open</option>
                  <option value="Closed">Closed / Completed</option>
                  <option value="In Progress">In Progress</option>
                </select>
                <div className="absolute right-4 top-[42px] pointer-events-none text-gray-400">
                  <ChevronRight className="rotate-90" size={18} />
                </div>
              </div>
            </div>

            {/* Reset Filters Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors"
              >
                <X size={18} />
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Opportunities List Section */}
          <div className="p-6 bg-gray-50/30">
            <div className="space-y-4">
              {filteredOpportunities.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-lg">No opportunities found.</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              ) : (
                filteredOpportunities.map((opp) => (
                  <div
                    key={opp._id}
                    className="bg-white border border-orange-500 rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {opp.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {opp.ngo?.organizationName || opp.ngo?.fullName || 'NGO'}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${opp.status === 'Open'
                            ? 'border border-gray-600 bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                            }`}>
                            {opp.status}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                          {opp.description}
                        </p>

                        {/* Skills */}
                        {opp.skills && opp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {opp.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-1 border border-gray-900 rounded-lg text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Duration and Location */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          {opp.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span className="text-xs">{opp.location}</span>
                            </div>
                          )}
                          {opp.duration && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span className="text-xs">{opp.duration}</span>
                            </div>
                          )}
                        </div>

                        {/* View Details Link */}
                        <button
                          onClick={() => handleViewDetails(opp)}
                          className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-bold mt-4 text-sm transition-all hover:gap-2"
                        >
                          View details
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      {/* Right Actions - Apply Button */}
                      {currentUserRole === 'volunteer' && opp.status === 'Open' && (
                        <div>
                          <button
                            onClick={() => navigate(`/apply/${opp._id}`)}
                            disabled={appliedOpportunities.includes(opp._id)}
                            className={`px-8 py-3 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${appliedOpportunities.includes(opp._id)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                              : 'bg-orange-500 hover:bg-orange-600 text-white transform hover:-translate-y-1'
                              }`}
                          >
                            {appliedOpportunities.includes(opp._id) ? 'Applied' : 'Apply'}
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
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${selectedOpportunity.status === 'Open'
                      ? 'border border-gray-600 bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                      }`}>
                      {selectedOpportunity.status}
                    </span>
                  </div>

                  {/* NGO Info */}
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <User size={18} />
                    <span className="font-medium">
                      {selectedOpportunity.ngo?.organizationName || selectedOpportunity.ngo?.fullName || 'NGO'}
                    </span>
                    {selectedOpportunity.createdAt && (
                      <>
                        <span className="text-gray-400">·</span>
                        <Calendar size={18} />
                        <span>Posted on {new Date(selectedOpportunity.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedOpportunity.description}
                  </p>
                </div>

                {/* Skill Tags */}
                {availableSkills.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Quick select skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.slice(0, 8).map((skill, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSkillTagClick(skill)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${selectedSkillTags.includes(skill)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {skill}
                        </button>
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
                    disabled={appliedOpportunities.includes(selectedOpportunity._id)}
                    className={`px-8 py-3 font-bold rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${appliedOpportunities.includes(selectedOpportunity._id)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                  >
                    {appliedOpportunities.includes(selectedOpportunity._id) ? 'Already Applied' : 'Apply Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}