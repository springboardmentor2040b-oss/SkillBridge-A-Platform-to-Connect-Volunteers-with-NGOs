import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO SECTION */}
      <section className="w-full lg:h-[650px] bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col md:flex-row items-center gap-14">

          {/* LEFT CONTENT */}
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Empowering NGOs.
            </h1>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
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
                className="px-7 py-3 rounded-full bg-white text-black font-semibold hover:bg-cyan-300 transition"
              >
                Join as Volunteer
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-7 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
              >
                Register NGO
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/home.jpeg"
              alt="Volunteers"
              className="w-full max-w-xl rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800">
            Why Choose SkillBridge?
          </h2>
          <p className="text-center text-gray-600 mt-2 mb-12">
            Connecting passion with purpose.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <img src="/connect.png" className="mx-auto w-72 rounded-xl" />
              <h3 className="text-xl font-semibold mt-4">Connect with NGOs</h3>
              <p className="text-gray-600 mt-2">
                Find NGOs aligned with your passion.
              </p>
            </div>

            <div className="text-center">
              <img src="/skills.png" className="mx-auto w-72 rounded-xl" />
              <h3 className="text-xl font-semibold mt-4">Use Your Skills</h3>
              <p className="text-gray-600 mt-2">
                Apply your skills to real causes.
              </p>
            </div>

            <div className="text-center">
              <img src="/opportunities.png" className="mx-auto w-72 rounded-xl" />
              <h3 className="text-xl font-semibold mt-4">Find Opportunities</h3>
              <p className="text-gray-600 mt-2">
                Discover roles made for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default Home;
