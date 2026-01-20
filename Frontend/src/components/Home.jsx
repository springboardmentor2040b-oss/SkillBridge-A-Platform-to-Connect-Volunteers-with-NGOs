import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import HowWorks from "./HowWorks";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO SECTION */}
      <section className="w-full lg:h-[680px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.3),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12 relative z-10">

          {/* LEFT CONTENT */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm font-medium">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              Bridging Skills with Social Impact
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Empowering NGOs.
              <span className="block mt-2">
                <span className="text-orange-500">Inspiring</span>{" "}
                <span className="text-teal-400">Volunteers.</span>
              </span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg max-w-md leading-relaxed">
              SkillBridge connects volunteers with NGOs to create meaningful impact.
              Explore opportunities, share your skills, and support causes you care about.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-7 py-3.5 rounded-xl bg-white text-slate-900 font-semibold hover:bg-orange-50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5"
              >
                Join as Volunteer
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-7 py-3.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
              >
                Register NGO
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 teal-500/20 rounded-full blur-2xl" />
              
              <img
                src="/home.jpeg"
                alt="Volunteers"
                className="w-full max-w-lg rounded-3xl object-cover shadow-2xl shadow-slate-900/50 relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Why Choose <span className="text-orange-500">SkillBridge</span>?
            </h2>
            <p className="text-slate-600 mt-3 text-lg">
              Connecting passion with purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="ui-card p-8 text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                <img src="/connect.png" className="w-16 h-16 object-contain" alt="Connect" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Connect with NGOs</h3>
              <p className="text-slate-600">
                Find NGOs aligned with your passion and make a difference in your community.
              </p>
            </div>

            <div className="ui-card p-8 text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                <img src="/skills.png" className="w-16 h-16 object-contain" alt="Skills" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Use Your Skills</h3>
              <p className="text-slate-600">
                Apply your professional skills to real causes and create meaningful impact.
              </p>
            </div>

            <div className="ui-card p-8 text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-300">
                <img src="/opportunities.png" className="w-16 h-16 object-contain" alt="Opportunities" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Find Opportunities</h3>
              <p className="text-slate-600">
                Discover volunteer roles made for you and start your impact journey today.
              </p>
            </div>
          </div>
        </div>
      </section>
      <HowWorks/>
      <Footer />
    </>
  );
}

export default Home;
