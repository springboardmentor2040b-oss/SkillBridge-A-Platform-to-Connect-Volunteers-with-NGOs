import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import illustration from "../assets/signup-illustration.png";
import logo from "../assets/image.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("userEmail", res.data.user.email);
      localStorage.setItem("token", res.data.token);

      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
          <h2 className="text-3xl font-semibold text-[#183B56]">Login</h2>

          <input
            type="email"
            placeholder="Email"
            className="border border-[#6EC0CE] p-3 rounded-lg mb-3"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-[#6EC0CE] p-3 rounded-lg mb-3"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="bg-[#FF7A30] text-white py-3 rounded-lg shadow-md mt-3"
          >
            Login
          </button>

          <p className="text-sm mt-4 text-[#2D4A60]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#6EC0CE] font-semibold">
              Sign up
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

export default Login;
