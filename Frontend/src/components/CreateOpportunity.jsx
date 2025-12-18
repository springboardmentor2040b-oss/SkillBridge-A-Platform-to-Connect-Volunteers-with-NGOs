import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';

export default function CreateOpportunity() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    location: '',
    status: 'Open'
  });
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedSkills = [
    'Html',
    'CSS',
    'UI/UX Design',
    'Graphic Design',
    'Content Writing',
    'JavaScript',
    'Data Analysis',
    'Project Management',
    'Video Editing',
    'Photography',
    'Social Media Management',
    'ReactJS'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addSkill = (skillName = null) => {
    const skillToAdd = skillName || currentSkill.trim();
    if (skillToAdd && !skills.includes(skillToAdd)) {
      setSkills([...skills, skillToAdd]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const togglePredefinedSkill = (skill) => {
    if (skills.includes(skill)) {
      removeSkill(skill);
    } else {
      addSkill(skill);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to create an opportunity");
        navigate('/login');
        return;
      }

      const response = await fetch(
        "http://localhost:4001/api/opportunities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            skills: skills, // Changed from requiredSkills to skills to match EditOpportunity
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Opportunity created successfully!");
        navigate("/opportunities"); // Using React Router navigate instead of window.location
      } else {
        alert(data.message || "Failed to create opportunity");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/opportunities');
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
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Website Redesign"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about the opportunity"
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Required Skills
              </label>
              
              {/* Predefined Skills */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Quick select:</p>
                <div className="flex flex-wrap gap-2">
                  {predefinedSkills.map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => togglePredefinedSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        skills.includes(skill)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Skill Input */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Or add custom skill:</p>
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
                    placeholder="e.g. Python Programming"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill()}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition flex items-center gap-2"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Selected Skills Tags */}
              {skills.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2 mt-4">Selected skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-orange-900 transition"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
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
    disabled
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition appearance-none bg-white cursor-not-allowed opacity-60"
  >
    <option value="Open">Open</option>
    <option value="Closed">Closed</option>
    <option value="In Progress">In Progress</option>
  </select>
  <p className="text-xs text-gray-500 mt-1">New opportunities are always created as Open</p>
</div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Opportunity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}