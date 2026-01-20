import React from "react";
import { SKILLS } from "../constants/skills";

export default function SkillSelector({ selectedSkills = [], onChange }) {
  const toggleSkill = (skill) => {
    const safeSkills = Array.isArray(selectedSkills) ? selectedSkills : [];

    if (safeSkills.includes(skill)) {
      onChange(safeSkills.filter((s) => s !== skill));
    } else {
      if (safeSkills.length >= 10) return;
      onChange([...safeSkills, skill]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Choose Skills 
      </label>

      <div className="flex flex-wrap gap-2">
        {SKILLS.map((skill) => (
          <button
            type="button"
            key={skill}
            onClick={() => toggleSkill(skill)}
            className={`px-3 py-1 rounded-full border text-sm transition
              ${
                selectedSkills.includes(skill)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {selectedSkills.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          <strong>Selected:</strong> {selectedSkills.join(", ")}
        </div>
      )}
    </div>
  );
}
