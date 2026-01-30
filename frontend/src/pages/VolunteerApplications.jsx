import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useApplications } from "../hooks/useApplications.js";
import VolunteerOpportunityCard from "../components/VolunteerOpportunityCard.jsx";
import VolunteerOpportunityModal from "../components/VolunteerOpportunityModal.jsx";
import {
  FiLayers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

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
  const [localApplications, setLocalApplications] = useState([]);
  // Sync localApplications with applications from the hook
  useEffect(() => {
  setLocalApplications(applications);
}, [applications]);


  const openDetails = (opp) => {
    setSelectedOpportunity(opp);
    setShowModal(true);
  };

  const closeDetails = () => {
    setShowModal(false);
    setSelectedOpportunity(null);
  };

  const filteredApplications = localApplications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });
  

// Withdraw application function
const withdrawApplication = async (applicationId) => {
  const confirmWithdraw = window.confirm(
    "Are you sure you want to withdraw this application?\n\nThe NGO will no longer be able to view it."
  );

  if (!confirmWithdraw) return;

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:8000/api/applications/${applicationId}/withdraw`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔵 Update local UI safely
    setLocalApplications((prev) =>
      prev.map((app) =>
        app._id === applicationId
          ? { ...app, status: "withdrawn" }
          : app
      )
    );
  } catch (error) {
    console.error("Withdraw failed:", error);
    alert(
      error.response?.data?.message ||
        "Failed to withdraw application. Please try again."
    );
  }
};



  if (loading) {
    return <div className="p-8 text-center">Loading applications...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F5F8] to-[#F7FBFC]">
      <main className="p-6 space-y-8">
        {/* ================= HEADER CARD ================= */}
        <div className="bg-white rounded-2xl p-6
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <h1 className="text-2xl font-bold text-[#1f3a5f]">
            My Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Track and manage all your volunteer applications
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                label: "Total",
                value: stats.total,
                icon: <FiLayers />,
                bg: "from-[#E6F6F9] to-[#F2FBFD]",
                color: "#1f3a5f",
              },
              {
                label: "Pending",
                value: stats.pending,
                icon: <FiClock />,
                bg: "from-[#FFF1E8] to-[#FFF7F2]",
                color: "#FF7A30",
              },
              {
                label: "Accepted",
                value: stats.accepted,
                icon: <FiCheckCircle />,
                bg: "from-[#EAF7F1] to-[#F4FBF7]",
                color: "#2F8F7A",
              },
              {
                label: "Rejected",
                value: stats.rejected,
                icon: <FiXCircle />,
                bg: "from-[#F6EAF2] to-[#FBF4F8]",
                color: "#9B4F7A",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`relative rounded-xl p-5 bg-gradient-to-br ${card.bg}
                shadow-[0_6px_16px_rgba(0,0,0,0.08)]
                hover:shadow-[0_20px_40px_rgba(0,0,0,0.14)]
                hover:-translate-y-1 transition-all duration-300`}
              >
                <div
                  className="absolute top-4 right-4 text-xl opacity-80"
                  style={{ color: card.color }}
                >
                  {card.icon}
                </div>

                <h3 className="text-3xl font-semibold" style={{ color: card.color }}>
                  {card.value}
                </h3>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  {card.label}
                </p>
              </div>
            ))}
                    {/* ================= FILTERS ================= */}
        <div className="flex gap-2 p-1 rounded-full">
          {["all", "pending", "accepted", "rejected", "withdrawn"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${
                  filter === tab
                    ? "bg-[#1f3a5f] text-white shadow"
                    : "text-[#1f3a5f] hover:bg-[#E6F4F7]"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
          </div>
        </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        {/* ================= APPLICATION LIST ================= */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center
            shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            text-slate-500">
            No applications found.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredApplications.map((app) => {
              const skills = app.opportunity_id?.skillsRequired
                ? app.opportunity_id.skillsRequired.split(",").map(s => s.trim())
                : [];

              const firstThree = skills.slice(0, 3);
              const extraCount = skills.length - 3;

              /* 🔴 IMPORTANT: PASS FULL DATA TO MODAL */
              const oppForModal = {
                ...app.opportunity_id,
                status: app.status,
                createdAt: app.createdAt,
              };

              const badgeStyle =
                app.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : app.status === "accepted"
                  ? "bg-green-100 text-green-800"
                  : app.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-slate-200 text-slate-700";


              return (
                <div
                  key={app._id}
                  className="relative bg-white rounded-2xl p-6
                  border border-slate-100
                  shadow-[0_6px_16px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_20px_40px_rgba(0,0,0,0.14)]
                  hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Status */}
                  <span className={`absolute top-5 right-6 px-4 py-1 rounded-full
                    text-xs font-semibold capitalize ${badgeStyle}`}>
                    {app.status}
                  </span>

                  {/* Title */}
                  <h3 className="text-[18px] font-semibold text-black">
                    {app.opportunity_id?.title}
                  </h3>

                  {/* NGO */}
                  <p className="text-sm font-semibold text-[#1f3a5f] mt-1">
                    NGO: {app.opportunity_id?.ngoName ||
                      app.opportunity_id?.createdBy?.fullName}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mt-2">
                    {trimText(app.opportunity_id?.description)}
                  </p>

                  {/* Skills */}
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {firstThree.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-xs font-medium
                  bg-[#E6F4F7] text-[#1f3a5f]
                  shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                      >
                        {skill}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium
                         text-[#1f3a5f]">
                        +{extraCount} more
                      </span>
                    )}
                  </div>

                  {/* Applied on (MOVED ABOVE BUTTONS) */}
                  <p className="text-xs text-slate-500 mt-4">
                    Applied on {formatDate(app.createdAt)}
                  </p>

                  {/* Buttons */}
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => openDetails(oppForModal)}
                      className="px-4 py-2 rounded-md text-sm font-semibold
                      border border-[#1f3a5f] text-[#1f3a5f]
                      hover:bg-[#1f3a5f] hover:text-white transition-all"
                    >
                      View Details
                    </button>

                    {app.status === "pending" && (
                      <button
                        onClick={() => withdrawApplication(app._id)}
                        className="px-4 py-2 rounded-md text-sm font-semibold
                        border border-red-600 text-red-600
                        hover:bg-red-600 hover:text-white transition-all"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= MODAL ================= */}
        {showModal && selectedOpportunity && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex
            items-center justify-center p-4 z-50">
            <div className="relative bg-white rounded-xl shadow-lg
              max-w-lg w-full p-6">

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
              <button
                onClick={closeDetails}
                className="absolute top-4 right-4 text-xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>

            {/* Opportunity Modal reused */}
            <VolunteerOpportunityModal
              opportunity={selectedOpportunity}
              onClose={closeDetails}
            />
          </div>
        </div>
      )}
     </main> 
    </div>
  );
};

export default VolunteerApplications;
