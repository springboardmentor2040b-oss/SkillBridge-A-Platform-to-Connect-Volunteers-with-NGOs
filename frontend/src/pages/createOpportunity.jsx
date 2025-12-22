import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";

const CreateOpportunity = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Open");
  const [successMessage, setSuccessMessage] = useState("");

  const PREDEFINED_SKILLS = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Django",
    "Project Management",
    "UI/UX Design",
    "Data Analysis",
    "Marketing",
    "Content Writing",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/api/opportunities",
        {
          title,
          description,
          skillsRequired: skills.join(", "),
          duration,
          location,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Show success
      setSuccessMessage("Opportunity created successfully");

      // ✅ Clear form after 2.5 seconds
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setSkills([]);
        setDuration("");
        setLocation("");
        setStatus("Open");
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create opportunity");
    }
  };

  const handleCancel = () => navigate("/opportunities");

  return (
    /* 🔑 FIX: make page scrollable */
    <div className="min-h-screen overflow-y-auto bg-[#E9F5F8] py-4 px-4 sm:px-6 lg:px-8 pb-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Create New Opportunity
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="font-bold">Title:</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Website Redesign"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="font-bold">Description:</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the opportunity"
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm"
                  required
                />
              </div>

              {/* Required Skills */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="font-bold">Required skills:</span>
                </label>

                <div className="border rounded-xl bg-white px-4 py-3 min-h-[52px]">
                  {/* Custom Dropdown */}
                  <CustomDropdown
                    options={PREDEFINED_SKILLS}
                    selectedValues={skills}
                    onSelect={(skill) => setSkills([...skills, skill])}
                    placeholder="Select or type required skills"
                  />

                  {/* Selected skills chips */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 px-3 py-2
                     rounded-full bg-[#A7DDE3] text-[#2F4858] text-xs"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            setSkills(skills.filter((s) => s !== skill))
                          }
                          className="font-bold text-sm leading-none hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Duration & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="font-bold">Duration:</span>
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 2 - 3 weeks, Ongoing"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="font-bold">Location:</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Mumbai, IND, Remote"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="font-bold">Status:</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>
              {successMessage && (
                <p className="text-green-600 font-medium text-sm mb-4">
                  {successMessage}
                </p>
              )}

              {/* Action Buttons */}

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-5 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5  bg-[#FF7A30] text-white font-medium rounded-md text-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOpportunity;
