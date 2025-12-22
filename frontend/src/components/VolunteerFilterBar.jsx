import React, { useState } from "react";

const VolunteerFilterBar = ({ filters, setFilters, skills, locations }) => {
  const [skillSearch, setSkillSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

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

  const resetFilters = () => {
    setFilters({
      status: "All",
      locations: [],
      skills: [],
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm mb-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* SKILLS */}
        <div>
          <p className="text-sm font-semibold mb-2">Skills</p>
          <input
            type="text"
            placeholder="Search skills..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            className="w-full mb-2 px-3 py-2 border rounded-md text-sm"
          />
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {skills
              .filter((s) =>
                s.toLowerCase().includes(skillSearch.toLowerCase())
              )
              .map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    filters.skills.includes(skill)
                      ? "bg-[#E6F4F7] border-[#6EC0CE]"
                      : "border-gray-300"
                  }`}
                >
                  {skill}
                </button>
              ))}
          </div>
        </div>

        {/* LOCATIONS */}
        <div>
          <p className="text-sm font-semibold mb-2">Location</p>
          <input
            type="text"
            placeholder="Search locations..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full mb-2 px-3 py-2 border rounded-md text-sm"
          />
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {locations
              .filter((l) =>
                l.toLowerCase().includes(locationSearch.toLowerCase())
              )
              .map((loc) => (
                <button
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    filters.locations.includes(loc)
                      ? "bg-[#E6F4F7] border-[#6EC0CE]"
                      : "border-gray-300"
                  }`}
                >
                  {loc}
                </button>
              ))}
          </div>
        </div>

        {/* STATUS */}
        <div>
          <p className="text-sm font-semibold mb-2">Status</p>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default VolunteerFilterBar;
