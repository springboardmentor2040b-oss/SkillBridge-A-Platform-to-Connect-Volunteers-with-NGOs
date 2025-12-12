import { Link, useNavigate } from "react-router-dom";
import illustration from "../assets/signup-illustration.png";
import logo from "../assets/image.png";

function SignupNGO() {
  const navigate = useNavigate();

  const handleSignup = () => {
    const email = document.getElementById("signupEmail").value;

    // save email
    localStorage.setItem("userEmail", email);

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

        {/* Form Section */}
        <div className="flex flex-col justify-center p-10">

          {/* TITLE */}
          <h2 className="text-3xl font-semibold text-[#183B56] mb-2">
            Create an Account
          </h2>

          {/* NEW PARAGRAPH ADDED */}
          <p className="text-gray-500 mb-8">
            Join SkillBridge to connect NGOs and volunteers.
          </p>

          {/* INPUTS */}
          <input
            type="text"
            placeholder="Enter username"
            className="w-full mb-3 px-4 py-3 border border-[#6EC0CE] rounded-lg"
          />

          <input
            id="signupEmail"
            type="email"
            placeholder="Enter your email"
            className="w-full mb-3 px-4 py-3 border border-[#6EC0CE] rounded-lg"
          />

          <input
            type="password"
            placeholder="Create a password"
            className="w-full mb-3 px-4 py-3 border border-[#6EC0CE] rounded-lg"
          />

          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-3 px-4 py-3 border border-[#6EC0CE] rounded-lg"
          />

          <select className="w-full mb-3 px-4 py-3 border border-[#6EC0CE] rounded-lg">
            <option>NGO / Organization</option>
          </select>

          <input
            type="text"
            placeholder="Location (Optional)"
            className="w-full mb-3 px-4 py-3 border border-[#6EC0CE] rounded-lg"
          />

          <input
            type="text"
            placeholder="Organization Description"
            className="w-full mb-3 px-4 py-3 border border-[#6EC0CE] rounded-lg"
          />

          <input
            type="text"
            placeholder="Website URL (optional)"
            className="w-full mb-3 px-4 py-3 border border-[#6EC0CE] rounded-lg"
          />

          {/* BUTTON */}
          <button
            onClick={handleSignup}
            className="w-full bg-[#FF7A30] hover:bg-[#E86820] text-white py-3 rounded-lg mt-3 transition shadow-md"
          >
            Create Account
          </button>

          {/* BOTTOM TEXT (PROPER SPACING ADDED) */}
          <p className="text-sm text-[#2D4A60] mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#6EC0CE] font-semibold">
              Login
            </Link>
          </p>
        </div>

        {/* Illustration Section */}
        <div className="hidden md:flex items-center justify-center bg-[#E3F5F9] p-6">
          <img src={illustration} alt="illustration" className="w-4/5 max-w-sm drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}

export default SignupNGO;
