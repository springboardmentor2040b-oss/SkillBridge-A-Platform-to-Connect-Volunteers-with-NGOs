import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt } from "react-icons/fa";
import { useApplications } from "../hooks/useApplications.js";

const truncateText = (text, limit = 30) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

const VolunteerOpportunityCard = ({
  opportunity,
  onViewDetails,
  onApply,
  hasApplied,
}) => {
  const { applyForOpportunity } = useApplications();
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyClick = async () => {
    setApplying(true);
    const result = await applyForOpportunity(opportunity._id, coverLetter);
    setApplying(false);

    if (result.success) {
      alert('Application submitted successfully!');
      setShowModal(false);
      setCoverLetter('');
      if (onApply) onApply(opportunity._id);
    } else {
      alert('Error: ' + result.error);
    }
  };

  const isOpen = opportunity.status === "Open";
  const inProgress = opportunity.status === "In Progress";

  const skillArray = opportunity.skillsRequired
    ? opportunity.skillsRequired.split(",").map((s) => s.trim())
    : [];

  const firstThreeSkills = skillArray.slice(0, 3);
  const remainingCount = skillArray.length - 3;

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between gap-6">

      {/* LEFT SECTION */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900">
          {opportunity.title}
        </h3>

        <p className="text-sm font-semibold text-[#1f3a5f] mt-1">
          NGO: {opportunity.ngoName}
        </p>

        <p className="text-sm text-gray-600 mt-3">
          {truncateText(opportunity.description, 30)}
        </p>

        {/* SKILLS — only 3 shown + "+N" if more exist */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {firstThreeSkills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#E6F4F7] text-[#1f3a5f]"
            >
              {skill}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#E6F4F7] text-[#1f3a5f]">
              +{remainingCount}
            </span>
          )}

        </div>
           {/* META INFO */}
        <div className="flex flex-wrap gap-6 text-sm font-medium text-[#2D4A60] mt-4">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#6EC0CE]" />
            {opportunity.location || "Remote"}
          </div>

          <div className="flex items-center gap-2">
            <FaClock className="text-[#6EC0CE]" />
            {opportunity.duration || "Flexible"}
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-[#6EC0CE]" />
            {new Date(opportunity.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* View Details */}
        <button
          onClick={() => onViewDetails(opportunity)}
          className="mt-5 px-4 py-2 border font-medium border-[#1f3a5f] text-[#1f3a5f] rounded-md text-sm hover:bg-[#1f3a5f] hover:text-white"
        >
          View Details
        </button>

        
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-col items-end justify-between">
        <span
          className={`px-4 py-1 rounded-full text-xs font-semibold ${
            opportunity.status === "ending"
              ? "bg-yellow-100 text-yellow-800"
              : opportunity.status === "accepted"
              ? "bg-green-100 text-green-800"
              : opportunity.status === "rejected"
              ? "bg-red-100 text-red-800"
              : isOpen
              ? "bg-green-100 text-green-700"
              : inProgress
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {opportunity.status}
        </span>
           {/* APPLY / APPLIED BUTTON */}
        {hasApplied ? (
          <button
            disabled
            className="mt-6 px-5 py-2 bg-green-100 text-green-800 rounded-md cursor-not-allowed"
          >
            ✓ Applied
          </button>
        ) : isOpen || inProgress ? (
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 px-5 py-2 bg-[#FF7A30] text-white rounded-md hover:bg-[#e86a22]"
          >
            Apply
          </button>
        ) : (
          <button
            disabled
            className="mt-6 px-5 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed"
          >
            Apply
          </button>
        )}
      </div>

     {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">

      {/* Close Button */}
      <button
        onClick={() => {
          setShowModal(false);
          setCoverLetter('');
        }}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      {/* Header with Wrapped Title */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 w-4/5 break-words leading-snug">
          Apply for {opportunity.title}
        </h3>
      </div>

      {/* Cover Letter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Letter (Optional)
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Tell us why you're interested in this opportunity..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="4"
        />
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowModal(false);
            setCoverLetter('');
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
        >
          Cancel
        </button>

        <button
          onClick={handleApplyClick}
          disabled={applying}
          className="px-4 py-2 bg-[#1f3a5f] text-white rounded-lg hover:opacity-90 disabled:opacity-50 text-sm"
        >
          {applying ? 'Applying...' : 'Submit Application'}
        </button>
      </div>

    </div>
  </div>
)}


    </div>
  );
};

export default VolunteerOpportunityCard;
