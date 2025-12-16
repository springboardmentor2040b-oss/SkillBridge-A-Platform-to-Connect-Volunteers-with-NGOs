import { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function CreateOpportunity() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    location: '',
    status: 'Open'
  });
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4001/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          requiredSkills: skills
        })
      });

      if (response.ok) {
        alert('Opportunity created successfully!');
        window.location.href = '/opportunities';
      } else {
        alert('Failed to create opportunity');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Opportunity</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Website Redesign"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about the opportunity"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. Web Development"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition flex items-center gap-2"
                >
                  Add
                </button>
              </div>
              
              {/* Skills Tags */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-900 transition"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Duration and Location - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 2-3 weeks, Ongoing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. New York, NY, Remote"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white cursor-pointer"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}