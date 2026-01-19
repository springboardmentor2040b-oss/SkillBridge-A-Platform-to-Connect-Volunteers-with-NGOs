import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";
import SkillSelector from "../components/SkillSelector";

export default function Profile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("details");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Profile success message
  const [message, setMessage] = useState("");

  // Profile data
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    skills: [],
    location: "",
  });

  // Security states
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [pwdMessage, setPwdMessage] = useState("");

  // Load profile
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    setProfile({
      name: user.name || "",
      email: user.email || "",
      skills: user.skills || [],
      location: user.location || "",
      role: user.role,
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

    // update current session
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // update users list (acts like DB)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === updatedUser.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setMessage("Profile updated successfully");
    setIsEditing(false);
    setTimeout(() => setMessage(""), 3000);
  };


  const updatePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdMessage("Please fill all password fields");
      return;
    }

    if (newPwd !== confirmPwd) {
      setPwdMessage("New password and confirm password do not match");
      return;
    }

    setPwdMessage("Password updated successfully");

    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");

    setTimeout(() => setPwdMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV */}
      
      <header className="bg-white border-b">
        <div className="px-4 md:px-8 py-4 flex justify-between items-center">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* ☰ Hamburger – mobile only */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            <Logo size={36} textColor="text-blue-600" />

            {/* Desktop links */}
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

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              {profile.name?.charAt(0) || "U"}
            </div>
            <span>{profile.name}</span>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-3 space-y-3 text-gray-600">
            <div
              className="cursor-pointer hover:text-blue-600"
              onClick={() => {
                navigate("/dashboard");
                setMenuOpen(false);
              }}
            >
              Dashboard
            </div>

            <div
              className="cursor-pointer hover:text-blue-600"
              onClick={() => {
                navigate("/create-opportunity");
                setMenuOpen(false);
              }}
            >
              Opportunities
            </div>

            <div
              className="cursor-pointer hover:text-blue-600"
              onClick={() => {
                navigate("/applications");
                setMenuOpen(false);
              }}
            >
              Applications
            </div>

            <div
              className="cursor-pointer hover:text-blue-600"
              onClick={() => {
                navigate("/messages");
                setMenuOpen(false);
              }}
            >
              Messages
            </div>
          </div>
        )}
      
      </header>


      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-1">Account Settings</h1>
        <p className="text-gray-600 mb-8">
          Manage your profile details and security.
        </p>

        {/* PROFILE SUCCESS MESSAGE */}
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

              <button
                onClick={() => setActiveTab("security")}
                className={`py-4 ${
                  activeTab === "security"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Security
              </button>
            </div>

            <div className="p-6">
              {/* PERSONAL DETAILS */}
              {activeTab === "details" && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Your Information</h3>

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
                      <label className="text-sm font-medium">Full Name</label>
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
                      <label className="text-sm font-medium">Email Address</label>
                      <input
                        value={profile.email}
                        disabled
                        className="w-full mt-1 px-4 py-3 border rounded-lg bg-gray-100"
                      />
                    </div>

                    {/* SKILL SELECTOR */}
                    <div className="md:col-span-2">
                      <SkillSelector
                        selectedSkills={profile.skills}
                        onChange={(skills) =>
                          setProfile({ ...profile, skills })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Location</label>
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
                </>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="space-y-5">
                  {pwdMessage && (
                    <div className="px-4 py-3 rounded-lg bg-green-100 text-green-700">
                      {pwdMessage}
                    </div>
                  )}

                  {/* CURRENT */}
                  <div>
                    <label className="text-sm font-medium">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                        className="w-full mt-1 px-4 py-3 border rounded-lg pr-10"
                      />
                      <span
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-4 cursor-pointer"
                      >
                        👁️
                      </span>
                    </div>
                  </div>

                  {/* NEW */}
                  <div>
                    <label className="text-sm font-medium">New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        className="w-full mt-1 px-4 py-3 border rounded-lg pr-10"
                      />
                      <span
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-4 cursor-pointer"
                      >
                        👁️
                      </span>
                    </div>
                  </div>

                  {/* CONFIRM */}
                  <div>
                    <label className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        className="w-full mt-1 px-4 py-3 border rounded-lg pr-10"
                      />
                      <span
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-4 cursor-pointer"
                      >
                        👁️
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={updatePassword}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Update Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
