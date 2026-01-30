import React, { useEffect, useState, useMemo } from "react";

const truncateText = (text, limit = 20) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

const VolunteerFilterBar = ({ filters, setFilters, opportunities }) => {
  /* COMPUTE FREQUENT SKILLS & LOCATIONS */
  const { frequentSkills, frequentLocations } = useMemo(() => {
    const skillCount = {};
    const locationCount = {};

    (opportunities || []).forEach((opp) => {
      opp.skillsRequired?.split(",").forEach((skill) => {
        const s = skill.trim();
        skillCount[s] = (skillCount[s] || 0) + 1;
      });

      const loc = opp.location?.trim();
      if (loc) locationCount[loc] = (locationCount[loc] || 0) + 1;
    });

    return {
      frequentSkills: Object.entries(skillCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map((item) => item[0]),

      frequentLocations: Object.entries(locationCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map((item) => item[0]),
    };
  }, [opportunities]);

  const [skillSearch, setSkillSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  /* TOGGLE CHIPS */
  const toggleSkill = (skill) => {
    setFilters({
      ...filters,
      skills: filters.skills.includes(skill)
        ? filters.skills.filter((s) => s !== skill)
        : [...filters.skills, skill],
    });
  };

  const toggleLocation = (loc) => {
    setFilters({
      ...filters,
      locations: filters.locations.includes(loc)
        ? filters.locations.filter((l) => l !== loc)
        : [...filters.locations, loc],
    });
  };

  /* RESET */
  const resetFilters = () => {
    setFilters({
      status: "All",
      locations: [],
      skills: [],
      skillSearch: "",
      locationSearch: "",
      apply: false,
    });
  };

  /* UPDATE FILTERS WHEN TYPING */
  const handleSkillSearch = (e) => {
    const value = e.target.value;
    setSkillSearch(value);
    setFilters({ ...filters, skillSearch: value, apply: false });
  };

  const handleLocationSearch = (e) => {
    const value = e.target.value;
    setLocationSearch(value);
    setFilters({ ...filters, locationSearch: value, apply: false });
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl p-6 
      shadow-[0_10px_30px_rgba(0,0,0,0.08)] mb-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1f3a5f]">
            Volunteering Opportunities
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Discover opportunities that match your skills and interests
          </p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
        {/* SKILLS */}
        <div>
          <h3 className="text-sm font-semibold text-[#1f3a5f] mb-2">Skills</h3>
          <input
            type="text"
            placeholder="Search skills..."
            value={skillSearch}
            onChange={handleSkillSearch}
            className="w-full mb-2 px-3 py-2 rounded-lg text-sm
            border border-slate-200
            focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40"

          />
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {frequentSkills
              .filter((skill) =>
                skill.toLowerCase().includes(skillSearch.toLowerCase())
              )
              .map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium
                  transition
                  ${
                    filters.skills.includes(skill)
                      ? "bg-[#E6F4F7] text-[#1f3a5f] shadow-sm border border-[#6EC0CE]"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {skill}
                </button>
              ))}
          </div>
        </div>

        {/* LOCATIONS */}
        <div>
          <h3 className="text-sm font-semibold text-[#1f3a5f] mb-2">Location</h3>
          <input
            type="text"
            placeholder="Search locations..."
            value={locationSearch}
            onChange={handleLocationSearch}
            className="w-full mb-2 px-3 py-2 rounded-lg text-sm
            border border-slate-200
            focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40"
          />
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {frequentLocations
              .filter((loc) =>
                loc.toLowerCase().includes(locationSearch.toLowerCase())
              )
              .map((loc) => (
                <button
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium
                  transition
                  ${
                    filters.locations.includes(loc)
                      ? "bg-[#E6F4F7] text-[#1f3a5f] shadow-sm border border-[#6EC0CE]"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}

                >
                  {loc}
                </button>
              ))}
          </div>
        </div>

        {/* STATUS */}
        <div>
          <h3 className="text-sm font-semibold text-[#1f3a5f] mb-2">Status</h3>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, apply: false })}
            className="w-full mb-2 px-3 py-2 rounded-lg text-sm
            border border-slate-200
            focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40"

          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end mt-4">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm font-medium
          text-[#1f3a5f]
          border border-[#1f3a5f] rounded-lg
          hover:bg-[#1f3a5f] hover:text-white"
        >
          Reset Filters
        </button>

        {/* <button
          onClick={() => setFilters({ ...filters, apply: true })}
          className="px-4 py-2 text-sm bg-[#1f3a5f] text-white rounded-md hover:opacity-90"
        >
          Apply Filters
        </button> */}
      </div>
    </div>
  );
};

export default VolunteerFilterBar;
