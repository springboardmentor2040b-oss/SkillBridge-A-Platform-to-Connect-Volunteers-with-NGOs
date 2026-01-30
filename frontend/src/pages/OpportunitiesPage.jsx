import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/* Components */
import OpportunityFilterBar from "../components/OpportunityFilterBar";
import OpportunityCard from "../components/OpportunityCard";
import OpportunityModal from "../components/OpportunityModal";

/* Extract logged-in user id from JWT */
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id || null;
  } catch {
    return null;
  }
};

const OpportunitiesPage = () => {
  const loggedInNgoId = getUserIdFromToken();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showMine, setShowMine] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  /* Fetch opportunities */
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/opportunities"
        );

        /* fallback static data for demo */
        if (res.data.length === 0) {
          setOpportunities([
            {
              _id: "demo1",
              title: "Web Development Volunteer",
              description: "Build a website for a rural education NGO.",
              skillsRequired: "React, CSS",
              duration: "4 weeks",
              location: "Remote",
              status: "Open",
              createdBy: { _id: "demoNgo", name: "Demo NGO" },
              createdAt: new Date(),
            },
          ]);
        } else {
          setOpportunities(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch opportunities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  /* Delete opportunity (creator only) */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this opportunity?")) return;

    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:8000/api/opportunities/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setOpportunities((prev) =>
      prev.filter((opp) => opp._id !== id)
    );
  };

  /* Filtering logic */
  const filteredOpportunities = opportunities.filter((opp) => {
    if (showMine && opp.createdBy?._id !== loggedInNgoId) return false;
    if (filterStatus !== "All" && opp.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#E9F5F8] p-6">
      <div className="w-full">

{/* HEADER + FILTER CARD */}
<div className="bg-white rounded-2xl p-6 mb-8 shadow-md">

  {/* TOP ROW: TITLE + CREATE BUTTON */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold text-[#1f3a5f]">
        Opportunities
      </h1>
      <p className="text-sm text-slate-600 mt-1">
        Explore and manage volunteering opportunities across NGOs
      </p>
    </div>

    <Link
            to="/ngo/opportunities/create"
            className="w-full md:w-auto px-6 py-2.5 rounded-lg
  bg-[#1f3a5f] text-white font-medium
  shadow-md hover:shadow-lg transition"
          >
            + Create New Opportunity
          </Link>
  </div>

  {/* DIVIDER */}
  <div className="h-p my-3" />

  {/* FILTER BAR */}
  <OpportunityFilterBar
    showMine={showMine}
    setShowMine={setShowMine}
    filterStatus={filterStatus}
    setFilterStatus={setFilterStatus}
  />

</div>


        {/* List */}
        {loading ? (
          <p className="text-gray-600">Loading opportunities...</p>
        ) : filteredOpportunities.length === 0 ? (
          <p className="text-gray-600">No opportunities found.</p>
        ) : (
          <div className="grid gap-4">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                loggedInNgoId={loggedInNgoId}
                onDelete={handleDelete}
                onViewDetails={setSelectedOpportunity}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
};

export default OpportunitiesPage;