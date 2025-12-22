import React, { useEffect, useState } from "react";
import axios from "axios";
import VolunteerOpportunityCard from "../components/VolunteerOpportunityCard";
import VolunteerFilterBar from "../components/VolunteerFilterBar";
import VolunteerOpportunityModal from "../components/VolunteerOpportunityModal";

const VolunteerOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "All",
    locations: [],
    skills: [],
  });

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  /* FETCH OPPORTUNITIES */
  useEffect(() => {
    const fetchOpportunities = async () => {
      const res = await axios.get("http://localhost:8000/api/opportunities");
      setOpportunities(res.data);
      setFiltered(res.data);
      setLoading(false);
    };
    fetchOpportunities();
  }, []);

  /* APPLY FILTERS */
  useEffect(() => {
    let data = [...opportunities];

    if (filters.status !== "All") {
      data = data.filter((o) => o.status === filters.status);
    }

    if (filters.locations.length > 0) {
      data = data.filter((o) =>
        filters.locations.includes(o.location)
      );
    }

    if (filters.skills.length > 0) {
      data = data.filter((o) =>
        filters.skills.some((skill) =>
          o.skillsRequired?.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }
    

    setFiltered(data);
  }, [filters, opportunities]);

  /* DYNAMIC SKILLS & LOCATIONS */
  const availableSkills = [
    ...new Set(
      opportunities.flatMap((o) =>
        o.skillsRequired ? o.skillsRequired.split(",").map((s) => s.trim()) : []
      )
    ),
  ];

  const availableLocations = [
    ...new Set(opportunities.map((o) => o.location).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-[#E9F5F8] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Volunteering Opportunities</h1>
        <p className="text-gray-600 mb-6">
          Discover opportunities that match your skills and interests
        </p>

        <VolunteerFilterBar
          filters={filters}
          setFilters={setFilters}
          skills={availableSkills}
          locations={availableLocations}
        />

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p>No opportunities found.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((opp) => (
              <VolunteerOpportunityCard
                key={opp._id}
                opportunity={opp}
                onViewDetails={setSelectedOpportunity}
                onApply={() =>
                  alert("Application submitted (backend integration pending)")
                }
              />
            ))}
          </div>
        )}
      </div>

      <VolunteerOpportunityModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
};

export default VolunteerOpportunities;
