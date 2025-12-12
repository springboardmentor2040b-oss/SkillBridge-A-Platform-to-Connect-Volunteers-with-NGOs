// SignupVolunteer.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import illustration from "../assets/signup-illustration.png";
import logo from "../assets/image.png";
// If you have a central axios instance, import it instead:
// import API from "../api/api";

export default function SignupVolunteer() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer", // fixed for this page
    skills: "",        // comma-separated input, we'll convert to array
    location: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Convert comma-separated skills to trimmed array
  const parseSkills = (str) => {
    if (!str) return [];
    return str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // very small client-side validation
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password, // hashing is done on backend
      role: "volunteer",
      skills: parseSkills(form.skills),
      location: form.location,
      bio: form.bio,
    };

    try {
      setLoading(true);
      // Use your axios instance if you have it:
      // const res = await API.post("/auth/register", payload);
      // Or fetch:
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registration failed");

      // On success you might get { token, user }. Save token or redirect
      // localStorage.setItem("token", data.token);
      // Optionally set axios default header if using axios
      // API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      navigate("/login"); // or redirect to dashboard
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 relative">
      <img src={logo} alt="SkillBridge Logo" className="absolute top-6 right-6 w-20" />

      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Form */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">Volunteer Sign Up</h2>
          <p className="text-gray-500 mb-6">Join SkillBridge as a volunteer and offer your skills.</p>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <input
            name="name"
            value={form.name}
            onChange={onChange}
            type="text"
            placeholder="Full name"
            className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg"
          />

          <input
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            placeholder="Email address"
            className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg"
          />

          <input
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
            placeholder="Create a password"
            className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg"
          />

          <input
            name="skills"
            value={form.skills}
            onChange={onChange}
            type="text"
            placeholder="Skills (comma separated) e.g. teaching, web dev, fundraising"
            className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg"
          />

          <input
            name="location"
            value={form.location}
            onChange={onChange}
            type="text"
            placeholder="Location (city, country) - optional"
            className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg"
          />

          <textarea
            name="bio"
            value={form.bio}
            onChange={onChange}
            placeholder="Short bio (what you can offer)"
            className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg min-h-[100px]"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg mt-3 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-sm mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold">
              Login
            </Link>
          </p>
        </div>

        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center bg-blue-50 p-6">
          <img src={illustration} alt="illustration" className="w-4/5 max-w-sm" />
        </div>
      </div>
    </div>
  );
}
