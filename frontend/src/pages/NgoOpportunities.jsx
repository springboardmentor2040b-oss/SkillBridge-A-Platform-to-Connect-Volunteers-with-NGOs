import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";
import SkillSelector from "../components/SkillSelector";


export default function NgoOpportunities() {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
  title: "",
  description: "",
  skills: [],
  duration: "",
  location: "",
  status: "Open",
  });

  const [filter, setFilter] = useState("all");
  


  // 🔹 Load user + opportunities
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setUserRole(profile.role);
    }

    const storedOpps = localStorage.getItem("ngoOpportunities");
    if (storedOpps) {
      setOpportunities(JSON.parse(storedOpps));
    }
  }, []);

  // 🔹 Delete opportunity (NGO only)
  const handleDelete = (id) => {
    const updated = opportunities.filter((o) => o.id !== id);
    setOpportunities(updated);
    localStorage.setItem("ngoOpportunities", JSON.stringify(updated));
  };
  // 🔐 NGO-only page protection
  if (userRole === "volunteer") {
   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-lg text-gray-600">
        Only NGOs can manage opportunities.
      </p>
    </div>
    );
  }
  const filteredOpportunities = opportunities.filter((opp) => {
  if (filter === "open") return opp.status === "open";
  if (filter === "closed") return opp.status === "closed";
  return true; // all
  });



  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV */}
      <header className="bg-blue-600 text-white">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Logo size={32} textColor="white" />
            <span
              className="cursor-pointer hover:text-blue-200"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </span>
          </div>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            NGO
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Your Opportunities</h1>
            <p className="text-gray-600">
              Manage the opportunities you have created
            </p>
          </div>

          {userRole === "ngo" && (
            <button
              onClick={() => navigate("/create-opportunity")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              + Create New Opportunity
            </button>
          )}
        </div>
        {/* FILTER BAR */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1 rounded-full text-sm ${
                filter === "all"
                 ? "bg-blue-600 text-white"
                 : "bg-gray-200 text-gray-700"
              }`}
            >
             All
            </button>

            <button
              onClick={() => setFilter("open")}
              className={`px-4 py-1 rounded-full text-sm ${
                filter === "open"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
             }`}
            >
              Open
            </button>

            <button
               onClick={() => setFilter("closed")}
               className={`px-4 py-1 rounded-full text-sm ${
               filter === "closed"
               ? "bg-blue-600 text-white"
               : "bg-gray-200 text-gray-700"
              }`}
            >
             Closed
            </button>
          </div>


        {/* OPPORTUNITY LIST */}
        <div className="space-y-5">
          {opportunities.length === 0 && (
            <p className="text-gray-500">No opportunities created yet.</p>
          )}

          {filteredOpportunities.map((opp) => (

            <div
              key={opp.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"

            >
              <div className="flex justify-between items-start gap-6">
                <div>
                  <h3 className="text-lg font-semibold">{opp.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      opp.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {opp.status === "open" ? "Open" : "Closed"}
                  </span>
                  <p className="text-gray-600 mt-1 max-w-3xl">
                    {opp.description} 
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {opp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500 mt-3">
                    <span>📍 {opp.location}</span>
                    <span>⏳ {opp.duration}</span>
                  </div>

                
                 <button
                  onClick={() => setSelectedOpportunity(opp)}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                 >
                  View Details →
                </button>
                </div>


                {/* ACTIONS */}
                {userRole === "ngo" && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedOpportunity(null);
                        setEditForm({
                          id: opp.id, 
                          title: opp.title,
                          description: opp.description,
                          skills: opp.skills,
                          duration: opp.duration,
                          location: opp.location,
                          status: opp.status,
                        });
                        setIsEditing(true);
                      }}
                      className="border border-blue-600 text-blue-600 px-4 py-1 rounded-lg hover:bg-blue-50"
                    >
                      Edit
                    </button>



                    <button
                      onClick={() => handleDelete(opp.id)}
                      className="border border-red-500 text-red-500 px-4 py-1 rounded-lg hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* EDIT OPPORTUNITY FORM */}
        {isEditing && editForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

             <h2 className="text-xl font-semibold mb-6">Edit Opportunity</h2>

             {/* TITLE */}
             <div className="mb-4">
               <label className="text-sm font-medium">Title</label>
               <input
                className="w-full border p-2 rounded mt-1"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
             </div>

             {/* DESCRIPTION */}
             <div className="mb-4">
               <label className="text-sm font-medium">Description</label>
               <textarea
                 className="w-full border p-2 rounded mt-1"
                 rows={3}
                 value={editForm.description}
                 onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                 }
                />
              </div>

              {/* SKILLS */}
              <div className="mb-4">
                <label className="text-sm font-medium block mb-2">
                 Required Skills
                </label>
                <SkillSelector
                  selectedSkills={editForm.skills}
                  onChange={(skills) =>
                    setEditForm({ ...editForm, skills })
                  }
                />
              </div>

              {/* DURATION */}
              <div className="mb-4">
                <label className="text-sm font-medium">Duration</label>
                <input
                  className="w-full border p-2 rounded mt-1"
                  value={editForm.duration}
                  onChange={(e) =>
                    setEditForm({ ...editForm, duration: e.target.value })
                  }
                />
              </div>

              {/* LOCATION */}
              <div className="mb-4">
              <label className="text-sm font-medium">Location</label>
              <input
                className="w-full border p-2 rounded mt-1"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
              </div>

              {/* STATUS */}
              <div className="mb-6">
              <label className="text-sm font-medium">Status</label>
              <select
              className="w-full border p-2 rounded mt-1"
              value={editForm.status}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
              >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              </select>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    const updated = opportunities.map((o) =>
                      o.id === editForm.id ? editForm : o
                    );

                    setOpportunities(updated);
                    localStorage.setItem(
                      "ngoOpportunities",
                      JSON.stringify(updated)
                    );
                    setIsEditing(false);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>

          </div>
      
        )}

  </main>
      {/* ================= MODAL : VIEW OPPORTUNITY DETAILS ================= */}
      {selectedOpportunity && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
       {/* Background Overlay */}
       <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setSelectedOpportunity(null)}
       ></div>

        {/* Modal Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 z-50">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">
            {selectedOpportunity.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            NGO: {selectedOpportunity.ngoName || "NGO"}
          </p>
        </div>

        <button
          onClick={() => setSelectedOpportunity(null)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-1">
          Description
        </h4>
        <p className="text-gray-600">
          {selectedOpportunity.description}
        </p>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">
          Required Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {selectedOpportunity.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
        <div>
          📍 <strong>Location:</strong> {selectedOpportunity.location}
        </div>
        <div>
          ⏳ <strong>Duration:</strong> {selectedOpportunity.duration}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <button
          onClick={() => setSelectedOpportunity(null)}
          className="px-5 py-2 border rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
   </div>
    )}

    </div>
  );
}
