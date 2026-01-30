import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

// ICONS FROM ASSETS

import CustomDropdown from "../components/CustomDropdown";

import userIcon from "../assets/user.svg";
import mailIcon from "../assets/mail.svg";
import skillsIcon from "../assets/skills.svg";
import locationIcon from "../assets/location.svg";
import editIcon from "../assets/edit.svg";
import saveIcon from "../assets/save.svg";
import lockIcon from "../assets/lock.svg";
import eyeIcon from "../assets/eye.svg";
import shieldIcon from "../assets/shield.svg";
import infoIcon from "../assets/info.svg";
import volunteerIcon from "../assets/volunteer.svg";

const PREDEFINED_SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "Communication",
  "Teaching",
  "Content Writing",
];

const VolunteerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [tempData, setTempData] = useState(null);

  // 🔹 Tabs (same as NGO)
  const [activeTab, setActiveTab] = useState("account");

  // 🔹 Security states (same as NGO)
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
        setTempData(res.data);
        setSelectedSkills(res.data.skills || []);
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };
    fetchProfile();
  }, []);

  if (!userData) return <p>Loading...</p>;

  const initials = userData.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSave = async () => {
    try {
      const updatedData = { ...tempData, skills: selectedSkills };

      const token = localStorage.getItem("token");
      const res = await axios.patch(
        "http://localhost:8000/api/auth/profile",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(res.data);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleCancel = () => {
    setTempData(userData);
    setIsEditing(false);
  };

  const handlePasswordSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        "http://localhost:8000/api/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Password updated successfully");

      setTimeout(() => {
        setShowPasswordFields(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordFields(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPwd(false);
    setShowNewPwd(false);
    setShowConfirmPwd(false);
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-[#E9F5F8] overflow-y-auto">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6">
        {/* BACK BUTTON */}
        <div className="mt-2 sm:mt-4 mb-4">
          <Link
                      to="/volunteer/dashboard"
                      className="flex items-center gap-2 text-sm-[#183B56]
                                hover:text-[#245a84] transition"
                    >
                      <FiArrowLeft className="text-base" />
                      <span>Back</span>
                    </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[360px_1fr] gap-6 lg:gap-12 items-start">
          {/* LEFT PROFILE CARD */}
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#2F4858] border-4 border-[#3DB8C2] flex items-center justify-center text-white text-3xl sm:text-4xl font-semibold">
              {initials}
            </div>

            <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-semibold text-gray-800">
              {userData.fullName}
            </h2>

            <p className="text-gray-500 mt-1 text-sm sm:text-base break-all">
              {userData.email}
            </p>

            <span className="mt-4 sm:mt-6 flex items-center gap-2 px-6 py-2 rounded-xl bg-[#A7DDE3] text-[#2F4858] font-medium">
              <img src={volunteerIcon} className="w-4 h-4" />
              {userData.role}
            </span>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 lg:h-[610px] flex flex-col overflow-hidden">
            {/* TABS */}
            <div className="border-b flex gap-6 sm:gap-10 text-gray-700 font-medium">
              <span
                onClick={() => setActiveTab("account")}
                className={`pb-3 cursor-pointer flex items-center gap-2 ${
                  activeTab === "account"
                    ? "border-b-2 border-gray-800"
                    : "text-gray-500"
                }`}
              >
                <img src={userIcon} className="w-4 h-4" />
                Account Details
              </span>

              <span
                onClick={() => setActiveTab("security")}
                className={`pb-3 cursor-pointer flex items-center gap-2 ${
                  activeTab === "security"
                    ? "border-b-2 border-gray-800"
                    : "text-gray-500"
                }`}
              >
                <img src={shieldIcon} className="w-4 h-4" />
                Security
              </span>
            </div>

            {/* ACCOUNT DETAILS (UNCHANGED) */}
            {activeTab === "account" && (
              <><div
                    className={`flex-1 pr-2 ${
                      isEditing ? "overflow-y-auto" : "overflow-hidden"
                    }`}
                  >
                {/* HEADER */}
                <div className="flex justify-between items-center mt-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Your Information
                  </h2>
                
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg bg-[#FF7A30] text-white"
                    >
                      <img src={editIcon} className="w-4 h-4" />
                      Edit
                    </button>
                  )} 
                </div>

                {/* FORM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 flex-1">
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Full Name
                    </label>
                    <div className="relative">
                      <img
                        src={userIcon}
                        className="absolute left-3 top-3 w-4 sm:w-5"
                      />
                      <input
                        disabled={!isEditing}
                        value={tempData.fullName}
                        onChange={(e) =>
                          setTempData({ ...tempData, fullName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3  border rounded-xl disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600">
                      Email Address
                    </label>
                    <div className="relative">
                      <img
                        src={mailIcon}
                        className="absolute left-3 top-3 w-4 sm:w-5"
                      />
                      <input
                        disabled
                        value={tempData.email}
                        className="w-full pl-10 pr-4 py-3  border rounded-xl bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600">
                      Location
                    </label>
                    <div className="relative">
                      <img
                        src={locationIcon}
                        className="absolute left-3 top-3 w-4 sm:w-5"
                      />
                      <input
                        disabled={!isEditing}
                        value={tempData.location}
                        onChange={(e) =>
                          setTempData({ ...tempData, location: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3  border rounded-xl disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600">
                      Role
                    </label>
                    <div className="relative">
                      <img
                        src={volunteerIcon}
                        className="absolute left-3 top-3.5 w-4"
                        alt="role"
                      />
                      <input
                        disabled
                        value={userData.role}
                        className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1 text-gray-600">
                      Skills
                    </label>

                    <div className="relative">
                      {/* ICON — SAME PATTERN AS OTHER FIELDS */}
                      <img
                        src={skillsIcon}
                        className="absolute left-3 top-3 w-4 sm:w-5"
                        alt="skills"
                      />

                      {/* CONTENT AREA */}
                      <div className="pl-10 pr-4 py-3 border rounded-xl bg-white min-h-[52px]">
                        {/* INPUT + ADD (COMPACT) */}
                        {isEditing && (
                          <CustomDropdown
                            options={PREDEFINED_SKILLS}
                            selectedValues={selectedSkills}
                            onSelect={(skill) =>
                              setSelectedSkills([...selectedSkills, skill])
                            }
                            placeholder="Select or type a skill"
                          />
                        )}

                        {/* SELECTED SKILLS CHIPS */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#A7DDE3] text-[#2F4858] text-sm"
                            >
                              {skill}

                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="font-bold text-sm leading-none"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* BIO */}
                <div className="md:col-span-2 mt-3">
                  <label className="block mb-1 text-gray-600">
                    Bio
                  </label>
                  
                  <div className="relative">
                    <img
                      src={infoIcon}
                      className="absolute left-3 top-3.5 w-4"
                    />
                    <textarea
                      disabled={!isEditing}
                      value={tempData.bio || ""}
                      onChange={(e) =>
                        setTempData({ ...tempData, bio: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl resize-none
                        text-sm sm:text-base disabled:bg-gray-100
                        overflow-y-auto
                        ${isEditing
                          ? "h-[90px]"
                          : "h-[70px] scrollbar-hidden"
                        }
                        disabled:bg-gray-100`}
                    />
                  </div>
                </div>
              </div>
                {isEditing && (
                  <div className="pt-4 mt-4 border-t flex justify-end gap-4">
                    <button
                      onClick={handleCancel}
                      className="px-4 sm:px-6 py-2 sm:py-3 border rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#FF7A30] text-white rounded-xl"
                    >
                      <img src={saveIcon} className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}
              </>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="mt-6 max-w-md">
                <label className="block mb-1 text-gray-600">Username</label>
                <input
                  disabled
                  value={userData.username}
                  className="w-full px-4 py-3 border rounded-xl bg-gray-100"
                />

                {!showPasswordFields && (
                  <button
                    onClick={() => setShowPasswordFields(true)}
                    className="mt-4 px-6 py-3 bg-[#FF7A30] text-white rounded-xl"
                  >
                    Change Password
                  </button>
                )}

                {showPasswordFields && (
                  <>
                    {[
                      [
                        "Current Password",
                        currentPassword,
                        setCurrentPassword,
                        showCurrentPwd,
                        setShowCurrentPwd,
                      ],
                      [
                        "New Password",
                        newPassword,
                        setNewPassword,
                        showNewPwd,
                        setShowNewPwd,
                      ],
                      [
                        "Confirm Password",
                        confirmPassword,
                        setConfirmPassword,
                        showConfirmPwd,
                        setShowConfirmPwd,
                      ],
                    ].map(([label, value, setter, show, toggle], i) => (
                      <div key={i} className="mt-4">
                        <label className="block mb-1 text-gray-600">
                          {label}
                        </label>
                        <div className="relative">
                          <img
                            src={lockIcon}
                            className="absolute left-3 top-3 w-5"
                          />
                          <input
                            type={show ? "text" : "password"}
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 border rounded-xl"
                          />
                          <img
                            src={eyeIcon}
                            onClick={() => toggle(!show)}
                            className="absolute right-3 top-3 w-5 cursor-pointer opacity-70"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={handlePasswordCancel}
                        className="px-6 py-3 border rounded-xl text-gray-700"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handlePasswordSave}
                        className="px-6 py-3 bg-[#FF7A30] text-white rounded-xl"
                      >
                        Save
                      </button>
                    </div>

                    {successMessage && (
                      <p className="mt-4 text-green-600 font-medium">
                        {successMessage}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
