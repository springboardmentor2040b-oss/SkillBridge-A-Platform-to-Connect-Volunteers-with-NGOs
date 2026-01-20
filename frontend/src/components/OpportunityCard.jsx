import { FaMapMarkerAlt, FaClock, FaCalendarAlt } from "react-icons/fa";

import React from "react";
import { Link } from "react-router-dom";

const truncateText = (text, wordLimit = 30) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + " ..."
    : text;
};

const OpportunityCard = ({
  opportunity,
  loggedInNgoId,
  onViewDetails,
  onDelete,
}) => {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition flex justify-between gap-6">

      {/* LEFT */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900">
          {opportunity.title}
        </h3>

        {/* NGO NAME */}
        <p className="text-sm font-medium text-[#1f3a5f]">
          NGO: {opportunity.createdBy?.fullName || opportunity.ngoName}
        </p>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 mt-3">
          {truncateText(opportunity.description)}
        </p>
        {/* SKILLS */}
{opportunity.skillsRequired && (
  <div className="flex flex-wrap gap-2 mt-3">
    {opportunity.skillsRequired
      .split(",")
      .slice(0, 3)
      .map((skill, index) => (
        <span
          key={index}
          className="bg-[#E3F5F9] text-[#183B56] px-3 py-1 
                     rounded-full text-xs font-medium"
        >
          {skill.trim()}
        </span>
      ))}

    {opportunity.skillsRequired.split(",").length > 3 && (
      <span className="text-xs text-gray-500 px-2 py-1">
        +{opportunity.skillsRequired.split(",").length - 3} more
      </span>
    )}
  </div>
)}

        {/* META INFO: Location | Duration | Posted Date */}
<div className="flex flex-wrap items-center gap-6 text-sm text-[#2D4A60] mt-4">

  {/* Location */}
  <div className="flex items-center gap-2">
    <FaMapMarkerAlt className="text-[#6EC0CE]" />
    <span className="font-medium">
      {opportunity.location || "Remote"}
    </span>
  </div>

  {/* Duration */}
  <div className="flex items-center gap-2">
    <FaClock className="text-[#6EC0CE]" />
    <span className="font-medium">
      {opportunity.duration || "Flexible"}
    </span>
  </div>

  {/* Posted Date */}
  <div className="flex items-center gap-2">
    <FaCalendarAlt className="text-[#6EC0CE]" />
    <span className="font-medium">
      {new Date(opportunity.createdAt).toLocaleDateString()}
    </span>
  </div>

</div>


        {/* VIEW DETAILS */}
        <button
          onClick={() => onViewDetails(opportunity)}
          className="mt-5 px-4 py-2 border font-medium border-[#1f3a5f] text-[#1f3a5f] rounded-md text-sm hover:bg-[#1f3a5f] hover:text-white"
        >
          View Details
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end justify-between">
        {/* STATUS */}
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium
          ${
            opportunity.status === "Open"
              ? "bg-green-100 text-green-700"
              : opportunity.status === "In Progress"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {opportunity.status}
        </span>

        {/* ACTIONS */}
        {opportunity.createdBy?._id === loggedInNgoId && (
          <div className="flex gap-2 mt-3">
            <Link
              to={`/ngo/opportunities/edit/${opportunity._id}`}
              className="px-3 py-1.5 border rounded-md text-sm
              hover:bg-gray-100 transition"
            >
              Edit
            </Link>

            <button
              onClick={() => onDelete(opportunity._id)}
              className="px-3 py-1.5 border rounded-md text-sm text-red-600
              hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
