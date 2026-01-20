import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";

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
        navigate("/opportunities");
      }, 2000);
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
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
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

  /* MAIN FORM */
  return (
    <div className="min-h-screen bg-[#E9F5F8] py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Edit Opportunity</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}
          <div>
            <label className="font-semibold block mb-2">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-semibold block mb-2">Description</label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
          </div>

          {/* SKILLS */}
          <div>
            <label className="font-semibold block mb-2">Required Skills</label>
            <div className="border rounded-xl p-4">
              <CustomDropdown
                options={PREDEFINED_SKILLS}
                selectedValues={form.skills}
                onSelect={(skill) =>
                  !form.skills.includes(skill) &&
                  setForm({ ...form, skills: [...form.skills, skill] })
                }
                placeholder="Select skills"
              />

              <div className="flex flex-wrap gap-2 mt-3">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-[#A7DDE3] px-3 py-1 rounded-full text-xs flex items-center gap-2"
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
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* DURATION */}
          <div>
            <label className="font-semibold block mb-2">Duration</label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="font-semibold block mb-2">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="font-semibold block mb-2">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {successMessage && (
            <p className="text-green-600 font-medium">{successMessage}</p>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="border px-5 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#1f3a5f] text-white px-5 py-2 rounded-md"
            >
              Update Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOpportunity;
