import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import illustration from "../assets/signup-illustration.png";
import logo from "../assets/image.png";

function SignupNGO() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    organization: "",
    location: "",
    description: "",
    website: ""
  });

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/signup", form);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E3F5F9] to-[#CBE7EF] px-6 relative">

      <div className="absolute top-6 right-6 flex items-center">
        <img src={logo} className="w-12" />
        <span className="text-2xl font-bold text-[#183B56] ml-2">SkillBridge</span>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">

        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-[#183B56]">Create Account</h2>

          {Object.keys(form).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key}
              className="border border-[#6EC0CE] p-3 rounded-lg mb-3"
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}

          <button
            onClick={handleSignup}
            className="bg-[#FF7A30] text-white py-3 rounded-lg shadow-md mt-3"
          >
            Create Account
          </button>

          <p className="text-sm mt-4 text-[#2D4A60]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#6EC0CE] font-semibold">
              Login
            </Link>
          </p>
        </div>

        <div className="hidden md:flex bg-[#E3F5F9] justify-center items-center p-6">
          <img src={illustration} className="w-4/5" />
        </div>
      </div>
    </div>
  );
}

export default SignupNGO;
