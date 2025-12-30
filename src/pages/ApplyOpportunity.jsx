import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";

export default function ApplyOpportunity() {
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    note: "",
  });

  useEffect(() => {
    const selected = localStorage.getItem("selectedOpportunity");
    const profile = localStorage.getItem("userProfile");

    if (!selected || !profile) {
      navigate("/volunteer-opportunities");
      return;
    }

    setOpportunity(JSON.parse(selected));
    setUser(JSON.parse(profile));
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const application = {
      id: Date.now(),
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      applicantName: user.name,
      applicantRole: user.role,
      ngoName: opportunity.ngoName,
      message: form.note,
      status: "Pending",
      appliedAt: new Date().toISOString(),
    };

    const existing =
      JSON.parse(localStorage.getItem("applications")) || [];

    localStorage.setItem(
      "applications",
      JSON.stringify([...existing, application])
    );

    setMessage("Application submitted successfully!");

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  if (!opportunity || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Logo size={34} textColor="#2563eb" />
            <span
              className="cursor-pointer text-gray-600 hover:text-blue-600"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </span>
            <span className="font-semibold">Apply</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
            <span>{user.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {message && (
          <div className="mb-6 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-2">
            Apply for Opportunity
          </h1>

          <p className="text-gray-600 mb-6">
            {opportunity.title} • {opportunity.ngoName}
          </p>

          <div className="mb-6 text-sm text-gray-600">
            📍 {opportunity.location} &nbsp;•&nbsp; ⏳{" "}
            {opportunity.duration}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium">
                Why are you interested?
              </label>
              <textarea
                required
                rows={4}
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
                className="w-full mt-1 px-4 py-3 border rounded-lg"
                placeholder="Write a short note..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
