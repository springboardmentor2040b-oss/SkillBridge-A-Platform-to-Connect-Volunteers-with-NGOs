import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";

export default function CreateOpportunity() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    skill: "",
    duration: "",
    location: "",
    status: "Open",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP: backend will replace this later
    console.log("Opportunity Data:", form);

    // inline success
    alert("Opportunity created successfully!");

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* TOP NAV */}
      <header className="bg-teal-300 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size={34} />
          <nav className="flex gap-6 text-gray-700 font-medium">
            <span onClick={() => navigate("/dashboard")} className="cursor-pointer">
              Dashboard
            </span>
            <span className="cursor-pointer text-black font-semibold">
              Opportunities
            </span>
            <span className="cursor-pointer">Applications</span>
            <span className="cursor-pointer">Messages</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
            A
          </div>
        </div>
      </header>

      {/* FORM */}
      <main className="flex justify-center mt-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-3xl rounded-xl p-8 shadow"
        >
          <h2 className="text-2xl font-semibold mb-6">
            Create New Opportunity
          </h2>

          {/* TITLE */}
          <div className="mb-4">
            <label className="font-medium text-sm">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Website Redesign"
              className="w-full mt-1 border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-4">
            <label className="font-medium text-sm">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide details about the opportunity"
              rows={4}
              className="w-full mt-1 border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* SKILL */}
          <div className="mb-4">
            <label className="font-medium text-sm">Required skills</label>
            <div className="flex gap-2 mt-1">
              <input
                name="skill"
                value={form.skill}
                onChange={handleChange}
                placeholder="e.g. Web Development"
                className="flex-1 border rounded-lg px-4 py-3"
              />
              <button
                type="button"
                className="bg-orange-500 text-white px-5 rounded-lg"
              >
                ADD
              </button>
            </div>
          </div>

          {/* DURATION & LOCATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-medium text-sm">Duration</label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g. 2–3 weeks"
                className="w-full mt-1 border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="font-medium text-sm">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore / Remote"
                className="w-full mt-1 border rounded-lg px-4 py-3"
              />
            </div>
          </div>

          {/* STATUS */}
          <div className="mb-6">
            <label className="font-medium text-sm">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-4 py-3"
            >
              <option>Open</option>
              <option>Closed</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
