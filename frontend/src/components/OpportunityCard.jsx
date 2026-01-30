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

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const OpportunityCard = ({
  opportunity,
  loggedInNgoId,
  onViewDetails,
  onDelete,
}) => {
  return (
    <div
  className="bg-white/90 backdrop-blur rounded-2xl p-6
  border border-slate-100
  shadow-[0_6px_18px_rgba(0,0,0,0.08)]
  hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)]
  hover:-translate-y-[2px]
  transition-all duration-300
  flex flex-col md:flex-row justify-between gap-6"
>


      {/* LEFT */}
      <div className="flex-1">
       <h3 className="text-[18px] font-semibold text-[#000000] leading-snug">
        {opportunity.title}
        </h3>

        <p className="text-sm font-semibold text-[#1f3a5f] mt-0.5 tracking-tight">
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
                  className="px-3 py-1.5 rounded-full text-xs font-medium
                  bg-[#E6F4F7] text-[#1f3a5f]
                  shadow-[0_1px_4px_rgba(0,0,0,0.12)]"

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
      <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-600 mt-4">
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
      {formatDate(opportunity.createdAt)}
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
          className={`px-4 py-1.5 rounded-full text-xs font-semibold 
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
                className="px-3 py-1.5 border rounded-md text-sm border-[#1f3a5f]
                hover:text-white hover:bg-[#1f3a5f] transition"
              >
                Edit
              </Link>

              <button
                onClick={() => onDelete(opportunity._id)}
                className="px-3 py-1.5 border rounded-md text-sm text-red-600 border-red-500
                hover:text-white hover:bg-red-500 transition"
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
