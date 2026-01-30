import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";
import { FiChevronDown } from "react-icons/fi";

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

  const handleCancel = () => navigate("/ngo/opportunities");
  const SoftDropdown = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full px-4 py-2.5 text-sm text-left
          bg-white border border-slate-300 rounded-lg
          flex items-center justify-between
          focus:outline-none focus:border-[#6EC0CE]
          focus:ring-2 focus:ring-[#6EC0CE]/30"
        >
          <span className={value ? "text-slate-800" : "text-slate-400"}>
            {value || placeholder}
          </span>
          <FiChevronDown className="text-slate-400" />
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full bg-white
          border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left
                hover:bg-[#E6F4F7] hover:text-[#1f3a5f]"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    /* 🔑 FIX: make page scrollable */
    <div className="min-h-screen overflow-y-auto bg-[#E9F5F8] py-4 px-4 sm:px-6 lg:px-8 pb-10">
      <div className="max-w-3xl mx-auto">
        <div
          className="relative bg-white/90 backdrop-blur-xl rounded-3xl
          border border-slate-100
          shadow-[0_12px_40px_rgba(31,58,95,0.12)]"
        >

          <div className="px-6 py-6">
            <h1 className="text-2xl font-bold text-[#1f3a5f] tracking-tight">
              Create New Opportunity
            </h1>

            <p className="text-sm text-slate-600 mt-1 mb-4">
              Provide details to publish a new volunteering opportunity
            </p>
            <button
              type="button"
              onClick={() => navigate("/ngo/opportunities")}
              className="absolute top-6 right-6
              text-slate-400 hover:text-slate-600
              transition text-lg"
            >
              ✕
            </button>


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
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40"
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
                  className="w-full px-4 py-2.5 text-sm
                  border border-slate-300 rounded-lg
                  bg-white
                  focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40
                  resize-none"
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
                  <SoftDropdown
                  value=""
                  onChange={(skill) =>
                    !skills.includes(skill) && setSkills([...skills, skill])
                  }
                  options={PREDEFINED_SKILLS}
                  placeholder="Select or type required skills"
                />
                
                  {/* Selected skills chips */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F4F7] text-[#1f3a5f] text-xs font-medium shadow-[0_1px_4px_rgba(0,0,0,0.12)]"

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
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40"

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
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40"

                  />
                </div>
              </div>

              {/* Status */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="font-bold">Status:</span>
                </label>
                <div className="relative">
                <SoftDropdown
                  value={status}
                  onChange={setStatus}
                  options={["Open", "In Progress", "Closed"]}
                  placeholder="Select status"
                />

              </div>

              </div>
              {successMessage && (
                <p className="text-green-600 font-medium text-sm mb-2">
                  {successMessage}
                </p>
              )}

              {/* Action Buttons */}

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-lg
                border border-slate-300 text-slate-700
                hover:bg-slate-100 transition
                text-sm font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg
                bg-[#FF7A30] text-white font-medium
                shadow-[0_6px_18px_rgba(255,122,48,0.35)]
                hover:shadow-[0_10px_26px_rgba(255,122,48,0.45)]
                transition text-sm"
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
