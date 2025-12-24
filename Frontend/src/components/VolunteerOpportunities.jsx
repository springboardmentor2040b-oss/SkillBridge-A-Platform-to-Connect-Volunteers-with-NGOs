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


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Volunteering Opportunities</h2>
          <p className="text-gray-600 mb-6">Find opportunities that match your skills and interests</p>
        </div>

{/* Filter Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Skills Search with Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <input
                type="text"
                placeholder="Search skills..."
                value={searchSkills}
                onChange={(e) => setSearchSkills(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {/* Skill Tags below input */}
              {availableSkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {availableSkills.map((skill, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSkillTagClick(skill)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        selectedSkillTags.includes(skill)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Search locations..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="">All</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>
          {/* Reset Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={16} />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Opportunities List */}
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
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow"
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
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        opp.status === 'Open' 
                          ? 'bg-green-100 text-green-700' 
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
                            className="px-3 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium"
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
                      className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm"
                    >
                      View details
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Right Actions - Apply Button */}
                  {currentUserRole === 'volunteer' && opp.status === 'Open' && (
                    <div>
                      <button
                        onClick={() => navigate(`/apply/${opp._id}`)}
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition shadow-sm"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
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
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedSkillTags.includes(skill)
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