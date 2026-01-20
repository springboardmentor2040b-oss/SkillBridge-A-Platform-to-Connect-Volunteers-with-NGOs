import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";
import SkillSelector from "../components/SkillSelector";

export default function Profile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("details");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    skills: [],
    location: "",
    role: "",
  });

  /* ✅ FIX: USE ONLY currentUser */
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      navigate("/login"); // ✅ NOT signup
      return;
    }

    const user = JSON.parse(storedUser);

    setProfile({
      name: user.name || "",
      email: user.email || "",
      skills: user.skills || [],
      location: user.location || "",
      role: user.role || "",
    });
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    const updatedUser = {
      ...JSON.parse(localStorage.getItem("currentUser")),
      ...profile,
    };

    // update session
    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    setMessage("Profile updated successfully");
    setIsEditing(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV */}
      <header className="bg-white border-b">
        <div className="px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            <Logo size={36} textColor="text-blue-600" />

            <div className="hidden md:flex items-center gap-6 text-gray-600">
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </span>

              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/create-opportunity")}
              >
                Opportunities
              </span>

              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/applications")}
              >
                Applications
              </span>

              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/messages")}
              >
                Messages
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              {profile.name?.charAt(0) || "U"}
            </div>
            <span>{profile.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-1">
          Account Settings
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your profile details and security.
        </p>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-100 text-green-700">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CARD */}
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500 flex items-center justify-center text-3xl font-bold">
              {profile.name?.charAt(0) || "U"}
            </div>

            <h3 className="mt-4 font-semibold">{profile.name}</h3>
            <p className="text-sm text-gray-500">{profile.email}</p>

            <span className="inline-block mt-3 px-4 py-1 text-sm rounded-full bg-blue-100 text-blue-600">
              {profile.role}
            </span>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
            <div className="border-b px-6 flex gap-6">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-4 ${
                  activeTab === "details"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Personal Details
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  Your Information
                </h3>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full mt-1 px-4 py-3 border rounded-lg ${
                      !isEditing && "bg-gray-100"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    value={profile.email}
                    disabled
                    className="w-full mt-1 px-4 py-3 border rounded-lg bg-gray-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <SkillSelector
                    selectedSkills={profile.skills}
                    onChange={(skills) =>
                      setProfile({ ...profile, skills })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Location
                  </label>
                  <input
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full mt-1 px-4 py-3 border rounded-lg ${
                      !isEditing && "bg-gray-100"
                    }`}
                  />
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={saveProfile}
                  className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
