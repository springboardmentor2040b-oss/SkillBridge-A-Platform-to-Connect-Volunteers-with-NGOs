import React from "react";

const VolunteerOpportunityModal = ({ opportunity, onClose }) => {
  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-xl max-w-2xl w-full p-8 z-10 shadow-xl">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
        >
          ×
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-900">
          {opportunity.title}
        </h2>

        {/* NGO NAME (FOCUS) */}
        <p className="mt-1 text-sm font-semibold text-[#1f3a5f]">
          NGO: {opportunity.ngoName || opportunity.createdBy?.fullName}
        </p>

        {/* STATUS */}
        <span
          className={`inline-block mt-3 px-4 py-1 rounded-full text-xs font-semibold ${
            opportunity.status === "Open"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {opportunity.status}
        </span>

        {/* DESCRIPTION */}
        <p className="mt-5 text-gray-700 leading-relaxed">
          {opportunity.description}
        </p>

        {/* META INFO */}
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
            {new Date(opportunity.createdAt).toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {opportunity.status}
          </div>
        </div>

        {/* SKILLS */}
        <div className="mt-6">
          <p className="font-semibold mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {opportunity.skillsRequired
              ?.split(",")
              .map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium
                  bg-[#E6F4F7] text-[#1f3a5f]"
                >
                  {skill.trim()}
                </span>
              ))}
          </div>
        </div>

        {/* OPTIONAL CONSTRAINTS SECTION */}
        {opportunity.constraints && (
          <div className="mt-6">
            <p className="font-semibold mb-2">
              Additional Requirements / Constraints
            </p>
            <p className="text-sm text-gray-700">
              {opportunity.constraints}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default VolunteerOpportunityModal;
