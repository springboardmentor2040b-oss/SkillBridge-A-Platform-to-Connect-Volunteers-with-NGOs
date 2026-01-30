import React from "react";

const VolunteerOpportunityModal = ({ opportunity, onClose }) => {
  if (!opportunity) return null;

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

  const getStatusStyle = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "accepted") return "bg-green-100 text-green-800";
    if (status === "rejected") return "bg-red-100 text-red-800";
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
      <div className="relative bg-white rounded-xl max-w-2xl w-full p-8 z-10 shadow-xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
        >
          ×
        </button>

        {/* STATUS BADGE — now on top of title */}
        <span
          className={`inline-block mb-2 px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${getStatusStyle(
            opportunity.status
          )}`}
        >
          {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
        </span>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-900">
          {opportunity.title}
        </h2>

        {/* NGO NAME */}
        <p className="mt-1 text-sm font-semibold text-[#1f3a5f]">
          NGO: {opportunity.ngoName || opportunity.createdBy?.fullName}
        </p>

        {/* DESCRIPTION — left aligned as requested */}
        <p className="mt-4 text-gray-700 leading-relaxed text-left">
          {opportunity.description}
        </p>

        {/* SKILLS */}
        <div className="mt-5">
          <p className="font-semibold mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {opportunity.skillsRequired?.split(",").map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#E6F4F7] text-[#1f3a5f]"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* META INFO (unchanged internally, just moved order) */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Location:</span>{" "}
            {opportunity.location || "Remote"}
          </div>
          <div>
            <span className="font-semibold">Duration:</span>{" "}
            {opportunity.duration || "Flexible"}
          </div>
          <div>
            <span className="font-semibold">Posted On:</span>{" "}
            {formatDate(opportunity.createdAt)}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {opportunity.status}
          </div>
        </div>

        {/* CONSTRAINTS stays untouched */}
        {opportunity.constraints && (
          <div className="mt-6">
            <p className="font-semibold mb-2">Additional Requirements / Constraints</p>
            <p className="text-sm text-gray-700">{opportunity.constraints}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerOpportunityModal;
