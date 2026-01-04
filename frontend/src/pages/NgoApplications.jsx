import React, { useState, useMemo } from "react";
import { useApplications } from "../hooks/useApplications.js";

const NgoApplications = () => {
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
    <div className="min-h-screen bg-[#E9F5F8] p-6">
      <h1 className="text-2xl font-bold mb-6">Volunteer Applications</h1>

      {/* ---------- STATS ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, bg: "bg-gray-50", text: "text-[#1f3a5f]" },
          { label: "Pending", value: stats.pending, bg: "bg-yellow-50", text: "text-yellow-600" },
          { label: "Accepted", value: stats.accepted, bg: "bg-green-50", text: "text-green-600" },
          { label: "Rejected", value: stats.rejected, bg: "bg-red-50", text: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} p-4 rounded-lg shadow`}>
            <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
            <div className="text-gray-600">{s.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* ---------- FILTER ---------- */}
      <div className="flex gap-2 mb-6">
        {["all", "pending", "accepted", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 border rounded-md text-sm font-medium transition ${
              filter === tab
                ? "bg-[#1f3a5f] text-white border-[#1f3a5f]"
                : "border-[#1f3a5f] text-[#1f3a5f] hover:bg-[#1f3a5f] hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
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
            <div key={opportunity._id} className="bg-white rounded-lg shadow">
              {/* ---------- OPPORTUNITY HEADER ---------- */}
              <button
                onClick={() =>
                  setExpandedOpp(
                    expandedOpp === opportunity._id ? null : opportunity._id
                  )
                }
                className="w-full text-left p-6"
              >
                <div className="flex justify-between gap-6">
                  {/* LEFT (75%) */}
                  <div className="w-[75%]">
                    <h3 className="text-lg font-extrabold text-[#1f3a5f]">
                      {opportunity.title}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {opportunity.description}
                    </p>

                    <h3 className="text-sm font-semibold text-[#1f3a5f] mt-3 mb-1">
                      Required Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {opportunity.skillsRequired?.split(",").map((skill, i) => (
                        <span
                          key={i}
                          className="bg-[#E3F5F9] text-[#1f3a5f] px-3 py-1 rounded-full text-xs font-medium"
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
                <div className="px-6 pb-6 space-y-4">
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
                          className="bg-[#F9FBFC] p-4 rounded-lg border border-gray-200 grid grid-cols-[1fr_auto] gap-4"
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
                              <p className="text-xs mt-2 text-red-600 font-bold">
                                No matching skills
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
                              className={`px-3 py-1 rounded-full text-xs ${
                                app.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : app.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {app.status.charAt(0).toUpperCase() +
                                app.status.slice(1)}
                            </span>

                            <div className="flex gap-2 mt-4">
                              {app.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(app._id, "accepted")
                                    }
                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(app._id, "rejected")
                                    }
                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button className="px-3 py-1 bg-[#1f3a5f] text-white rounded text-sm hover:bg-[#14253c]">
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
    </div>
  );
};

export default NgoApplications;
