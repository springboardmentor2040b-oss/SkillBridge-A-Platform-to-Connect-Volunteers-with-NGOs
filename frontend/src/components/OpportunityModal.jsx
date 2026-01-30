import React from "react";

const OpportunityModal = ({ opportunity, onClose }) => {
  if (!opportunity) return null;

  const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

  const getStatusStyle = (status) => {
    if (status === "Open") return "bg-green-100 text-green-700";
    if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
    if (status === "Closed") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative bg-white rounded-xl max-w-2xl w-full p-8 z-10 shadow-lg">

        {/* STATUS BADGE (small, top-left, same row as title visually but before it in order) */}
        <span
          className={`inline-block mb-2 px-3 py-1 rounded-full text-[10px] font-semibold ${getStatusStyle(
            opportunity.status
          )}`}
        >
          {opportunity.status}
        </span>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-900 text-left">
          {opportunity.title}
        </h2>

        {/* NGO NAME */}
        <p className="text-sm font-semibold text-[#1f3a5f] mt-2 text-left">
          NGO: {opportunity.createdBy?.fullName || opportunity.ngoName}
        </p>

        {/* DESCRIPTION (left aligned, not justified) */}
        <p className="mt-4 text-gray-700 leading-relaxed text-left max-h-[200px] overflow-y-auto">
          {opportunity.description}
        </p>

        {/* SKILLS */}
        <div className="mt-6 text-left">
          <p className="font-semibold mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {opportunity.skillsRequired?.split(",").map((skill, index) => (
              <span
                key={index}
                className="bg-[#E6F4F7] text-[#1f3a5f] px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* META INFO GRID (Location, Duration, Status, Posted On) */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-700 text-left">
          <p><b>Location:</b> {opportunity.location || "Remote"}</p>
          <p><b>Duration:</b> {opportunity.duration || "Flexible"}</p>
          <p><b>Status:</b> {opportunity.status}</p>
          <p><b>Posted On:</b> {formatDate(opportunity.createdAt)}</p>
        </div>

        {/* CLOSE BUTTON (restored, bigger spacing from status badge) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-black"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default OpportunityModal;
