import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <section className="w-full h-fit lg:h-[650px] bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col md:flex-row items-center gap-14">

        {/* LEFT CONTENT */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Empowering NGOs.
          </h1>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            <span className="text-cyan-400">Inspiring</span>{" "}
            <span className="text-emerald-400">Volunteers.</span>
          </h1>

          <p className="text-violet-100/90 text-base md:text-lg max-w-md">
            SkillBridge connects volunteers with NGOs to create meaningful impact.
            Explore opportunities, share your skills, and support causes you care about.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-3 rounded-full bg-white text-black font-semibold shadow-md hover:bg-cyan-300 hover:-translate-y-0.5 hover:shadow-lg transition"
            >
              Join as Volunteer
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-3 rounded-full  bg-orange-500 text-white font-semibold hover:bg-white/10 transition"
            >
              Register NGO
            </button>
          </div>
        </div>

        {/* RIGHT ILLUSTRATION / IMAGE */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl rounded-3xl overflow-hidden">
            <img
            src="/home.jpeg"
            alt="Volunteers Illustration"
            className="w-full h-auto object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default Home;
