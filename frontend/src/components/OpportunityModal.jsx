import React from "react";

const OpportunityModal = ({ opportunity, onClose }) => {
  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-xl max-w-2xl w-full p-8 z-10 shadow-lg">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
        >
          ×
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-900">
          {opportunity.title}
        </h2>

        {/* NGO */}
        <p className="text-sm font-semibold text-[#1f3a5f] mt-1">
          NGO: {opportunity.createdBy?.fullName || opportunity.ngoName}
        </p>

        {/* DESCRIPTION */}
        <p className="mt-5 text-gray-700 leading-relaxed max-h-[200px] overflow-y-auto">
          {opportunity.description}
        </p>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
          <p><b>Status:</b> {opportunity.status}</p>
          <p><b>Location:</b> {opportunity.location}</p>
          <p><b>Duration:</b> {opportunity.duration}</p>
          <p>
            <b>Posted On:</b>{" "}
            {new Date(opportunity.createdAt).toDateString()}
          </p>
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
                  className="bg-[#A7DDE3] text-[#2F4858]
                  px-3 py-1 rounded-full text-xs"
                >
                  {skill.trim()}
                </span>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OpportunityModal;
