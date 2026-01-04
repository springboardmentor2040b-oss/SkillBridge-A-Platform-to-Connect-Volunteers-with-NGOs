import React, { useState } from "react";
import { useApplications } from "../hooks/useApplications.js";
import VolunteerOpportunityCard from "../components/VolunteerOpportunityCard.jsx";
import VolunteerOpportunityModal from "../components/VolunteerOpportunityModal.jsx";

const trimText = (text, limit = 30) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

const VolunteerApplications = () => {
  const { applications, stats, loading, error } = useApplications();
  const [filter, setFilter] = useState("all");

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openDetails = (opp) => {
    setSelectedOpportunity(opp);
    setShowModal(true);
  };

  const closeDetails = () => {
    setShowModal(false);
    setSelectedOpportunity(null);
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  if (loading) {
    return <div className="p-8 text-center">Loading applications...</div>;
  }

  return (
    <div className="min-h-screen bg-[#E9F5F8] p-6">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "bg-gray-50" ,textColor: "text-[#1f3a5f]" },
          { label: "Pending", value: stats.pending, color: "bg-yellow-50", textColor: "text-yellow-600" },
          { label: "Accepted", value: stats.accepted, color: "bg-green-50", textColor: "text-green-600" },
          { label: "Rejected", value: stats.rejected, color: "bg-red-50", textColor: "text-red-600" }
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} p-4 rounded-lg shadow`}>
            <div className={`text-2xl font-bold ${stat.textColor || "text-gray-900"}`}>{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["all", "pending", "accepted", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 border font-medium rounded-md text-sm ${
              filter === tab ? "bg-[#1f3a5f] text-white border-[#1f3a5f]" : "border-[#1f3a5f] text-[#1f3a5f] hover:bg-[#1f3a5f] hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Application Cards */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {filter === "all" ? "You haven't applied to any opportunities yet." : `No ${filter} applications found.`}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {

            const skillArray = app.opportunity_id?.skillsRequired
              ? app.opportunity_id.skillsRequired.split(",").map(s => s.trim())
              : [];

            const firstThree = skillArray.slice(0, 3);     // ✅ only 3 skills
            const extraCount = skillArray.length - 3;      // ✅ remaining count

            const opp = {
              _id: app.opportunity_id?._id || app.opportunity_id,
              title: app.opportunity_id?.title,
              description: app.opportunity_id?.description,
              shortDescription: trimText(app.opportunity_id?.description),
              skillsRequired: app.opportunity_id?.skillsRequired,
              status: app.status,
              ngoName: app.opportunity_id?.ngoName,
              createdAt: app.createdAt,
              firstThreeSkills: firstThree,  // passed but modal handles full anyway
              extraSkillCount: extraCount > 0 ? extraCount : 0
              
            };

            const badgeStyle =
              opp.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : opp.status === "accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800";

            return (
              <div key={app._id}>
                <div className="relative bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">

                  {/* Status moved to TOP RIGHT */}
                  <span className={`absolute top-5 right-6 px-4 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
                    {opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900">{opp.title}</h3>

                  {/* NGO Name */}
                  <p className="text-sm font-semibold text-[#1f3a5f] mt-1">NGO: {opp.ngoName}</p>

                  {/* Trimmed description */}
                  <p className="text-sm text-gray-600 mt-2">{opp.shortDescription}</p>

                  {/* Skills pills (3 + "+N") */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {firstThree.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-[#E6F4F7] text-[#1f3a5f]">
                        {skill}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#E6F4F7] text-[#1f3a5f]">
                        +{extraCount}
                      </span>
                    )}
                  </div>

                  {/* View Details */}
                  <button
                    onClick={() => openDetails(opp)}
                    className="mt-5 px-4 py-2 border font-medium border-[#1f3a5f] text-[#1f3a5f] rounded-md text-sm hover:bg-[#1f3a5f] hover:text-white"
                  >
                    View Details
                  </button>

                  {/* Applied on inside the card */}
                  <p className="text-xs text-gray-500 mt-3">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal WITHOUT modifying modal file */}
      {showModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-xl shadow-lg max-w-lg w-full p-6">

            {/* STATUS BADGE OVERRIDDEN FROM THIS PAGE, TOP RIGHT */}
            <span className={`absolute top-4 right-4 px-4 py-1 rounded-full text-xs font-semibold ${
              selectedOpportunity.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : selectedOpportunity.status === "accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {selectedOpportunity.status.charAt(0).toUpperCase() + selectedOpportunity.status.slice(1)}
            </span>

            {/* Close Button */}
            <button onClick={closeDetails} className="absolute top-4 right-14 text-gray-400 hover:text-gray-600 text-xl">×</button>

            {/* Opportunity Modal reused */}
            <VolunteerOpportunityModal
              opportunity={selectedOpportunity}
              onClose={closeDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerApplications;
