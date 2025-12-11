import { Link, useNavigate } from "react-router-dom";
import illustration from "../assets/signup-illustration.png";
import logo from "../assets/image.png";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-[#E3F5F9] via-[#D8F0F4] to-[#CBE7EF] 
                    px-6 relative">

      {/* Logo + Name Top Right */}
      <div className="absolute top-6 right-6 flex items-center space-x-2">
        <img src={logo} alt="SkillBridge Logo" className="w-12 h-auto drop-shadow-md" />
        <span className="text-2xl font-bold" style={{ color: "#183B56" }}>
          SkillBridge
        </span>
      </div>

      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl 
                      grid grid-cols-1 md:grid-cols-2 overflow-hidden 
                      border border-gray-200">

        {/* Form */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-3xl font-semibold" style={{ color: "#183B56" }}>
            Login to your NGO Account
          </h2>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mb-4 px-4 py-3 border border-[#6EC0CE] rounded-lg"
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mb-4 px-4 py-3 border border-[#6EC0CE] rounded-lg"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-[#FF7A30] hover:bg-[#E86820] text-white py-3 rounded-lg transition shadow-md"
          >
            Login
          </button>

          <p className="text-sm mt-4" style={{ color: "#2D4A60" }}>
            Don’t have an account?{" "}
            <Link to="/signup" className="font-semibold" style={{ color: "#6EC0CE" }}>
              Sign up
            </Link>
          </p>
        </div>

        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center bg-[#E3F5F9] p-6">
          <img src={illustration} alt="illustration" className="w-4/5 max-w-sm drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}

export default Login;
