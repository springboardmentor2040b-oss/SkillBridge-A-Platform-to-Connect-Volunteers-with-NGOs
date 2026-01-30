import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";
import { FiChevronDown } from "react-icons/fi";

/* JWT helper */
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id;
  } catch {
    return null;
  }
};

const PREDEFINED_SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Django",
  "Project Management",
  "UI/UX Design",
  "Data Analysis",
  "Marketing",
  "Content Writing",
  "Canva",
];

const EditOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const loggedInNgoId = getUserIdFromToken();

  const [authorized, setAuthorized] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: [],
    duration: "",
    location: "",
    status: "Open",
  });
const SoftDropdown = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full px-4 py-2.5 text-sm text-left
          bg-white border border-slate-300 rounded-lg
          flex items-center justify-between
          focus:outline-none focus:border-[#6EC0CE]
          focus:ring-2 focus:ring-[#6EC0CE]/30"
        >
          <span className={value ? "text-slate-800" : "text-slate-400"}>
            {value || placeholder}
          </span>
          <FiChevronDown className="text-slate-400" />
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full bg-white
          border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left
                hover:bg-[#E6F4F7] hover:text-[#1f3a5f]"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* FETCH OPPORTUNITY */
  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/opportunities/${id}`
        );

        const opp = res.data;

        // 🔒 ownership check
        if (opp.createdBy?._id !== loggedInNgoId) {
          setAuthorized(false);
          return;
        }

        setForm({
          title: opp.title,
          description: opp.description,
          skills: opp.skillsRequired
            ? opp.skillsRequired.split(",").map((s) => s.trim())
            : [],
          duration: opp.duration || "",
          location: opp.location || "",
          status: opp.status || "Open",
        });
      } catch (error) {
        console.error(error);
        setAuthorized(false);
      }
    };

    fetchOpportunity();
  }, [id, loggedInNgoId]);

  /* INPUT HANDLER */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8000/api/opportunities/${id}`,
        {
          title: form.title,
          description: form.description,
          skillsRequired: form.skills.join(", "),
          duration: form.duration,
          location: form.location,
          status: form.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Opportunity updated successfully");

      setTimeout(() => {
        navigate("/ngo/opportunities", { replace: true });
      }, 1200);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  /* CANCEL */
  const handleCancel = () => navigate("/ngo/opportunities");
  
  /* UNAUTHORIZED VIEW */
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E9F5F8]">
        <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You are not authorized to edit this opportunity.
          </p>
          <button
            onClick={handleCancel}
            className="px-5 py-2 border rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

return (
  <div className="min-h-screen overflow-y-auto bg-[#E9F5F8] py-4 px-4 sm:px-6 lg:px-8 pb-10">
    <div className="max-w-3xl mx-auto">
      <div
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl
        border border-slate-100
        shadow-[0_12px_40px_rgba(31,58,95,0.12)]"
      >
        {/* HEADER */}
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-[#1f3a5f] tracking-tight">
            Edit Opportunity
          </h1>

          <p className="text-sm text-slate-600 mt-1">
            Update details of your volunteering opportunity
          </p>

          {/* X CLOSE */}
          <button
            type="button"
            onClick={() => navigate("/ngo/opportunities")}
            className="absolute top-6 right-6
            text-slate-400 hover:text-slate-600
            transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {/* TITLE */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="font-bold">Title:</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm
              border border-slate-300 rounded-lg bg-white
              focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="font-bold">Description:</span>
            </label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm
              border border-slate-300 rounded-lg bg-white
              focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40
              resize-none"
              required
            />
          </div>

          {/* REQUIRED SKILLS */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="font-bold">Required skills:</span>
            </label>

            <div className="border rounded-xl bg-white px-4 py-3 min-h-[52px]">
              <SoftDropdown
                value=""
                onChange={(skill) =>
                  !form.skills.includes(skill) &&
                  setForm({ ...form, skills: [...form.skills, skill] })
                }
                options={PREDEFINED_SKILLS}
                placeholder="Select or type required skills"
              />

              <div className="flex flex-wrap gap-2 mt-3">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-2 px-3 py-1.5
                    rounded-full bg-[#E6F4F7] text-[#1f3a5f]
                    text-xs font-medium
                    shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          skills: form.skills.filter((s) => s !== skill),
                        })
                      }
                      className="font-bold text-sm leading-none hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* DURATION & LOCATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="font-bold">Duration:</span>
              </label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm
                border border-slate-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="font-bold">Location:</span>
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm
                border border-slate-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#6EC0CE]/40"
              />
            </div>
          </div>

          {/* STATUS */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="font-bold">Status:</span>
            </label>
            <SoftDropdown
              value={form.status}
              onChange={(value) =>
                setForm({ ...form, status: value })
              }
              options={["Open", "In Progress", "Closed"]}
              placeholder="Select status"
            />
          </div>

          {successMessage && (
            <p className="text-green-600 font-medium text-sm">
              {successMessage}
            </p>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-lg
              border border-slate-300 text-slate-700
              hover:bg-slate-100 transition
              text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg
              bg-[#FF7A30] text-white font-medium
              shadow-[0_6px_18px_rgba(255,122,48,0.35)]
              hover:shadow-[0_10px_26px_rgba(255,122,48,0.45)]
              transition text-sm"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

export default EditOpportunity;
