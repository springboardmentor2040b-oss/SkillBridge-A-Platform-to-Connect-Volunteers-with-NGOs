import React from "react";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt } from "react-icons/fa";

const truncateText = (text, limit = 20) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit
    ? words.slice(0, limit).join(" ") + "..."
    : text;
};

const VolunteerOpportunityCard = ({ opportunity, onViewDetails, onApply }) => {
  const isOpen = opportunity.status === "Open";
  const inprogress = opportunity.status === "In Progress";
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition flex justify-between gap-6">

      {/* LEFT */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900">
          {opportunity.title}
        </h3>

        <p className="text-sm font-semibold text-[#1f3a5f] mt-1">
          NGO: {opportunity.ngoName}
        </p>

        <p className="text-sm text-gray-600 mt-3">
          {truncateText(opportunity.description)}
        </p>

        {/* SKILLS */}
        <div className="flex flex-wrap gap-2 mt-4">
          {opportunity.skillsRequired?.split(",").map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#E6F4F7] text-[#1f3a5f]"
            >
              {skill.trim()}
            </span>
          ))}
        </div>

        {/* META WITH ICONS */}
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

        <button
          onClick={() => onViewDetails(opportunity)}
          className="mt-5 px-4 py-2 border font-medium border-[#1f3a5f] text-[#1f3a5f] rounded-md text-sm hover:bg-[#1f3a5f] hover:text-white"
        >
          View Details
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end justify-between">
        <span
          className={`px-4 py-1 rounded-full text-xs font-semibold ${
            isOpen 
              ? "bg-green-100 text-green-700"
              : inprogress 
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {opportunity.status}
        </span>

        {isOpen | inprogress ?  (
          <button
            onClick={() => onApply(opportunity)}
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
    </div>
  );
};

export default VolunteerOpportunityCard;
