import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <section className="w-full h-fit lg:h-[650px] bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col md:flex-row items-center gap-14">

        {/* LEFT CONTENT */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Empowering NGOs.<br />
            <span className="text-cyan-300">Inspiring</span>{" "}
            <span className="text-emerald-300">Volunteers.</span>
          </h1>

          <p className="text-violet-100/90 text-base md:text-lg max-w-md">
            SkillBridge connects volunteers with NGOs to create meaningful impact.
            Explore opportunities, share your skills, and support causes you care about.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-3 rounded-full bg-cyan-400 text-slate-900 font-semibold shadow-md hover:bg-cyan-300 hover:-translate-y-0.5 hover:shadow-lg transition"
            >
              Join as Volunteer
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-3 rounded-full border border-white/70 text-white font-semibold hover:bg-white/10 transition"
            >
              Register NGO
            </button>
          </div>
        </div>

        {/* RIGHT ILLUSTRATION / IMAGE */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md rounded-3xl overflow-hidden bg-white/90 border border-white/40 shadow-2xl backdrop-blur-sm">
            <img
              src="/home.jpeg"  // from public/home.jpeg
              alt="Volunteers Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default Home;
