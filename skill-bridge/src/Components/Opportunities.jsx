import React, { useEffect, useState } from "react";
import axios from "axios";
import OpportunityCard from "./OpportunityCard";
import OpportunityModal from "./OpportunityModal";
import FilterBar from "./FilterBar";
import { useNavigate } from "react-router-dom";
import "./Opportunities.css";

const Opportunities = () => {
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyError, setApplyError] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  /* ================= TOKEN VALIDATION (ADDED) ================= */
  const isValidToken = (token) => {
    return token && token !== "undefined" && token !== "null";
  };

  /* ================= FETCH OPPORTUNITIES ================= */
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError("");

      /* ===== TOKEN SAFETY CHECK (ADDED) ===== */
      if (!isValidToken(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Session expired. Please login again.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/opportunities",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const cleanData = Array.isArray(res.data)
        ? res.data.filter((opp) => opp && opp._id)
        : [];

      // Normalize status
      cleanData.forEach((opp) => {
        if (opp.status) opp.status = opp.status.toUpperCase();
      });

      setAllOpportunities(cleanData);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err.response || err.message);

      /* ===== AUTO LOGOUT ON INVALID TOKEN (ADDED) ===== */
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }

      setError(err.response?.data?.message || "Failed to fetch opportunities.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [token]);

  /* ================= FILTER ================= */
  const filteredOpportunities = allOpportunities.filter((opp) => {
    if (!opp || !opp.status) return false;
    if (filter === "ALL") return true;
    return opp.status === filter;
  });

  /* ================= APPLY ================= */
  const handleApply = async (opp) => {
    setApplyError("");

    const creatorId = opp.createdBy?._id || opp.createdBy;

    if (opp.status === "CLOSED") {
      setApplyError("This opportunity is closed.");
      return;
    }

    if (
      user?.role === "NGO" &&
      (user?.id === creatorId || user?._id === creatorId)
    ) {
      setApplyError("You cannot apply to your own opportunity.");
      return;
    }

    try {
      /* ===== APPLY API FIX (ADDED) ===== */
      await axios.post(
        "http://localhost:5000/api/applications/apply",
        { opportunityId: opp._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/applications");
    } catch (err) {
      setApplyError(
        err.response?.data?.message || "Failed to apply for opportunity."
      );
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const opp = allOpportunities.find((o) => o._id === id);
    if (!opp) return;

    const creatorId = opp.createdBy?._id || opp.createdBy;

    if (user?.id !== creatorId && user?._id !== creatorId) {
      alert("You are not authorized to delete this opportunity.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/opportunities/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchOpportunities();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete opportunity.");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="opportunities-container">
      <div className="opportunities-header">
        <div>
          <h2>Opportunities</h2>
          <p className="subtitle">
            Explore and manage volunteering opportunities
          </p>
        </div>

        {user?.role === "NGO" && (
          <button
            className="btn-create-opportunity"
            onClick={() => navigate("/create-opportunity")}
          >
            + Create New Opportunity
          </button>
        )}
      </div>

      <div className="opportunities-filter-row">
        <FilterBar filter={filter} setFilter={setFilter} />
      </div>

      {applyError && <p className="error-text">{applyError}</p>}
      {error && <p className="error-text">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading &&
        filteredOpportunities.map((opp) => {
          const creatorId = opp.createdBy?._id || opp.createdBy;
          const isOwner =
            user?.role === "NGO" &&
            (user?.id === creatorId || user?._id === creatorId);

          return (
            <OpportunityCard
              key={opp._id}
              opportunity={opp}
              isOwner={isOwner}
              onView={() => {
                setSelectedOpportunity(opp);
                setIsEditMode(false);
              }}
              onApply={handleApply}
              onEdit={() => {
                setSelectedOpportunity(opp);
                setIsEditMode(true);
              }}
              onDelete={handleDelete}
            />
          );
        })}

      {selectedOpportunity && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          isOwner={
            user?.role === "NGO" &&
            (user?.id ===
              (selectedOpportunity.createdBy?._id ||
                selectedOpportunity.createdBy))
          }
          isEditMode={isEditMode}
          onClose={() => {
            setSelectedOpportunity(null);
            setIsEditMode(false);
            fetchOpportunities();
          }}
        />
      )}
    </div>
  );
};

export default Opportunities;
