import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "../hooks/useApplications.js";
import {
  FiLayers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const NgoApplications = () => {
  const navigate = useNavigate();
  const { applications, stats, loading, error, updateApplicationStatus } =
    useApplications();

  const [filter, setFilter] = useState("all");
  const [expandedOpp, setExpandedOpp] = useState(null);

  const handleStatusUpdate = async (appId, newStatus) => {
    if (window.confirm(`Are you sure you want to ${newStatus} this application?`)) {
      const result = await updateApplicationStatus(appId, newStatus);
      if (!result.success) {
        alert(`Error: ${result.error}`);
      }
    }
  };

  /* ---------- GROUP APPLICATIONS BY OPPORTUNITY ---------- */
  const opportunities = useMemo(() => {
    const map = {};
    applications.forEach((app) => {
      const opp = app.opportunity_id;
      if (!opp?._id) return;

      if (!map[opp._id]) {
        map[opp._id] = {
          opportunity: opp,
          applications: [],
        };
      }
      map[opp._id].applications.push(app);
    });
    return Object.values(map);
  }, [applications]);

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
          Volunteer Applications
        </h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Track opportunities, applications, and volunteer activity.
        </p>
      {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          {[
            {
              label: "Total",
              value: stats.total,
              bg: "from-[#E6F6F9] to-[#F2FBFD]",
              color: "#1f3a5f",
              icon: <FiLayers />,
            },
            {
              label: "Pending",
              value: stats.pending,
              bg: "from-[#FFF1E8] to-[#FFF7F2]",
              color: "#FF7A30",
              icon: <FiClock />,
            },
            {
              label: "Accepted",
              value: stats.accepted,
              bg: "from-[#EAF7F1] to-[#F4FBF7]",
              color: "#2F8F7A",
              icon: <FiCheckCircle />,
            },
            {
              label: "Rejected",
              value: stats.rejected,
              bg: "from-[#F6EAF2] to-[#FBF4F8]",
              color: "#9B4F7A",
              icon: <FiXCircle />,
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`relative rounded-xl p-5 bg-gradient-to-br ${card.bg}
              shadow-[0_6px_16px_rgba(0,0,0,0.08)]
              hover:shadow-[0_20px_40px_rgba(0,0,0,0.14)]
              hover:-translate-y-1 transition-all`}
            >
                          <span
              className="absolute top-4 right-4 text-xl opacity-80"
              style={{ color: card.color }}
            >
              {card.icon}
            </span>

              <h3 className="text-3xl font-semibold" style={{ color: card.color }}>
                {card.value}
              </h3>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                {card.label}
              </p>
            </div>
          ))}
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* ================= FILTERS ================= */}
        <div className="flex gap-2">
          {["all", "pending", "accepted", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition
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

      {/* ---------- OPPORTUNITIES ---------- */}
      <div className="space-y-6">
        {opportunities.map(({ opportunity, applications }) => {
          const visibleApps =
            filter === "all"
              ? applications
              : applications.filter((a) => a.status === filter);

          const applicantText =
            applications.length === 0
              ? "No Applicants"
              : applications.length === 1
              ? "1 Applicant"
              : `${applications.length} Applicants`;

          return (
            <div key={opportunity._id} className="bg-white rounded-2xl p-6
              border border-slate-100
              shadow-[0_6px_16px_rgba(0,0,0,0.08)]
              hover:shadow-[0_20px_40px_rgba(0,0,0,0.14)]
              transition-all">
              {/* ---------- OPPORTUNITY HEADER ---------- */}
              <button
                onClick={() =>
                  setExpandedOpp(
                    expandedOpp === opportunity._id ? null : opportunity._id
                  )
                }
                className="w-full text-left"
              >
                <div className="flex justify-between gap-6">
                  {/* LEFT (75%) */}
                  <div className="w-[75%]">
                    <h3 className="text-lg font-semibold text-black">
                      {opportunity.title}
                    </h3>

                    <p className="text-sm text-slate-600 mt-2">
                      {opportunity.description}
                    </p>

                    <h3 className="text-sm font-semibold text-[#1f3a5f] mt-3">
                      Required Skills
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {opportunity.skillsRequired?.split(",").map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full text-xs font-medium
                          bg-[#E6F4F7] text-[#1f3a5f]
                          shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                          hover:-translate-y-[1px] transition"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {applicantText}
                  </div>
                </div>
              </button>

              {/* ---------- VOLUNTEERS ---------- */}
              {expandedOpp === opportunity._id && (
                <div className="mt-6 space-y-4">
                  {visibleApps.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-4">
                      No {filter.charAt(0).toUpperCase() + filter.slice(1)} applications
                    </p>
                  ) : (
                    visibleApps.map((app) => {
                      const required = opportunity.skillsRequired
                        ? opportunity.skillsRequired
                            .split(",")
                            .map((s) => s.trim().toLowerCase())
                        : [];

                      const volunteerSkills = app.volunteer_id?.skills || [];
                      const matchCount = volunteerSkills.filter((s) =>
                        required.includes(s.toLowerCase())
                      ).length;

                      return (
                        <div
                          key={app._id}
                          className="bg-[#F9FBFC] p-4 rounded-xl
                            border border-slate-200
                            grid grid-cols-[1fr_auto] gap-4
                            shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                            hover:shadow-[0_14px_28px_rgba(0,0,0,0.14)]
                            hover:-translate-y-[2px]
                            transition-all duration-300"
                        >
                          {/* LEFT */}
                          <div>
                            <h3 className="text-sm font-semibold text-[#1f3a5f]">
                              {app.volunteer_id?.fullName}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {app.volunteer_id?.email}
                            </p>

                            <p className="text-xs text-gray-600 mt-0">
                              <span >Applied On:</span>{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </p>

                            <h4 className="text-xs font-semibold text-[#1f3a5f] mt-2 mb-1">
                              Volunteer Skills
                            </h4>

                            <div className="flex flex-wrap gap-2">
                              {volunteerSkills.length > 0 ? (
                                volunteerSkills.map((skill, i) => (
                                  <span
                                    key={i}
                                    className="bg-[#E3F5F9] text-[#183B56] px-2 py-0.5 rounded-full text-xs font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-red-600 font-semibold">
                                  No skills added
                                </span>
                              )}
                            </div>

                            {matchCount === 0 ? (
                              <p className="text-xs mt-2 text-red-600 font-semibold">
                                No Matching skills
                              </p>
                            ) : (
                              <p
                                className={`text-xs mt-2 font-semibold ${
                                  matchCount > 3
                                    ? "text-green-600"
                                    : "text-orange-500"
                                }`}
                              >
                                Matching skills: {matchCount}
                              </p>
                            )}
                          </div>

                          {/* RIGHT */}
                          <div className="flex flex-col items-end justify-between">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                app.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 font-semibold"
                                  : app.status === "accepted"
                                  ? "bg-green-100 text-green-800 font-semibold"
                                  : "bg-red-100 text-red-800 font-semibold"
                              }`}
                            >
                              {app.status.charAt(0).toUpperCase() +
                                app.status.slice(1)}
                            </span>

                            <div className="flex gap-2 mt-4 items-center">
                              {app.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(app._id, "accepted")
                                    }
                                    className="px-3 py-1.5 rounded-md text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(app._id, "rejected")
                                    }
                                    className="px-3 py-1.5 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button
                            onClick={() => {
                              navigate("/ngo/messages", {
                                state: {
                                  type: "application",
                                  applicationId: app._id,
                                  receiverId: app.volunteer_id._id,
                                  receiverName: app.volunteer_id.fullName,
                                },
                              });
                            }}
                            className="px-3 py-1.5 rounded-md text-sm font-semibold bg-[#1f3a5f] text-white hover:bg-[#14253c] transition"
                          >
                            Message
                          </button>

                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </main>
    </div>
  );
};

export default NgoApplications;
