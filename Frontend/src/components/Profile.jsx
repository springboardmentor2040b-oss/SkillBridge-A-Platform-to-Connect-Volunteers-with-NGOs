import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";


export default function Profile() {
  const [activeTab, setActiveTab] = useState("details");
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:4001/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => alert("Failed to load profile"));
  }, []);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const saveProfile = async () => {
  try {
    const payload = {
      fullName: user.fullName,
      location: user.location,
      bio: user.bio,
      organisationName: user.organisationName,
      organizationUrl: user.organizationUrl,
    };

    const res = await axios.patch(
      "http://localhost:4001/api/profile",
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setUser(res.data);
    setEditMode(false);
    alert("Profile updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update profile");
  }
};


  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-1">Account Settings</h1>
      <p className="text-gray-500 mb-8">
        Manage your profile details and security.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT PROFILE CARD */}
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-3xl font-bold text-white-600">
            {user.fullName[0]}
          </div>

          <h2 className="mt-4 text-xl font-semibold">{user.fullName}</h2>
          <p className="text-gray-500">{user.email}</p>

          <span className="inline-block mt-3 px-4 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">
            {user.role}
          </span>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow p-6">
          {/* TABS */}
          <div className="flex gap-6 border-b mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-2 ${
                activeTab === "details"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`pb-2 ${
                activeTab === "security"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              Security
            </button>
          </div>

          {/* PERSONAL DETAILS */}
          {activeTab === "details" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Full Name"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  disabled={!editMode}
                />

                <Field label="Email Address" value={user.email} readOnly />

                <Field
                  label="Location"
                  name="location"
                  value={user.location || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />

                <Field label="Role" value={user.role} readOnly />
              </div>

              <div className="mt-6">
                <Field
                  label="Bio"
                  name="bio"
                  value={user.bio || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  textarea
                />
              </div>

              {user.role === "ngo" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Field
                    label="Organization Name"
                    name="organisationName"
                    value={user.organisationName || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                  <Field
                    label="Website"
                    name="organizationUrl"
                    value={user.organizationUrl || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-4 mt-8">
                {editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && <ChangePassword />}
        </div>
      </div>
    </div>
  );
}

/* FIELD COMPONENT */
function Field({ label, textarea, readOnly, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {textarea ? (
        <textarea
          {...props}
          disabled={readOnly || props.disabled}
          className="w-full mt-1 border rounded-lg px-3 py-2"
        />
      ) : (
        <input
          {...props}
          disabled={readOnly || props.disabled}
          className="w-full mt-1 border rounded-lg px-3 py-2"
        />
      )}
    </div>
  );
}

/* CHANGE PASSWORD */
function ChangePassword() {
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const submit = async () => {
    try {
      await axios.put(
        "http://localhost:4001/api/change-password",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Password changed successfully");
      setData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      alert("Failed to change password");
    }
  };

  return (
    <div className="max-w-md space-y-5">

      {/* CURRENT PASSWORD */}
      <div>
        <label className="text-sm font-medium text-gray-600">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={data.currentPassword}
            onChange={(e) =>
              setData({ ...data, currentPassword: e.target.value })
            }
            className="w-full mt-1 border rounded-lg px-3 py-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* NEW PASSWORD */}
      <div>
        <label className="text-sm font-medium text-gray-600">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={data.newPassword}
            onChange={(e) =>
              setData({ ...data, newPassword: e.target.value })
            }
            className="w-full mt-1 border rounded-lg px-3 py-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        onClick={submit}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg w-full"
      >
        Update Password
      </button>
    </div>
  );
}
