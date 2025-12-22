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
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Opportunities
            </h1>
            <p className="text-sm text-gray-500">
              Explore and manage volunteering opportunities across NGOs
            </p>
          </div>

          <Link
            to="/opportunities/create"
            className="bg-[#1f3a5f] text-white px-5 py-2 rounded-md font-medium"
          >
            + Create New Opportunity
          </Link>
        </div>

        {/* Filters */}
        <OpportunityFilterBar
          showMine={showMine}
          setShowMine={setShowMine}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

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
