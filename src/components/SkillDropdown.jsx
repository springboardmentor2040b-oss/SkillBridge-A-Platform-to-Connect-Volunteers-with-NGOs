import { useState } from "react";

export default function SkillDropdown({ skills, selected, onChange }) {
  const [open, setOpen] = useState(false);

  const toggleSkill = (skill) => {
    if (selected.includes(skill)) {
      onChange(selected.filter(s => s !== skill));
    } else {
      onChange([...selected, skill]);
    }
  };

  return (
    <div className="skill-dropdown">
      <button onClick={() => setOpen(!open)}>
        {selected.length === 0 ? "All Skills" : selected.join(", ")}
      </button>

      {open && (
        <div className="dropdown-box">
          {skills.map(skill => (
            <div
              key={skill}
              className={`skill-item ${selected.includes(skill) ? "active" : ""}`}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
