
import React from "react";
import Footer from "./Footer";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const About = () => {
  const navigate= useNavigate();
  
  return (
    <div className="w-full overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-24 md:py-28">

        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Bridging <span className="text-orange-500">Skills</span> with{" "}
            <span className="text-teal-400">Social Impact</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            SkillBridge is a platform where passionate volunteers and verified NGOs
            come together to create real-world impact through meaningful collaboration.
          </p>
        </div>

        {/* CARDS */}
        <div className="relative z-10 mt-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Card 1 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-10 text-white shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Why We Built <span className="text-orange-500">SkillBridge</span>
              </h2>

              <p className="flex items-start gap-3 text-slate-300 leading-relaxed mb-4">
                <span className="text-xl text-orange-500 mt-0.5">•</span>
                NGOs struggle to find skilled volunteers. Volunteers struggle to
                find genuine opportunities.
              </p>

              <p className="flex items-start gap-3 text-slate-300 leading-relaxed">
                <span className="text-xl text-orange-500 mt-0.5">•</span>
                SkillBridge bridges this gap by connecting the right people with
                the right causes — transparently, securely, and impactfully.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-10 text-white shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                What Makes Us Different
              </h3>

              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-300">
                  <span className="text-orange-500"><FaCheck /></span> Verified & trusted NGOs
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <span className="text-orange-500"><FaCheck /></span> Skill-based opportunity matching
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <span className="text-orange-500"><FaCheck /></span> Transparent collaboration
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <span className="text-orange-500"><FaCheck /></span> Real impact, measurable outcomes
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* BACKGROUND BLURS */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Be Part of the <span className="text-orange-500">Change</span>
        </h2>

        <p className="text-slate-600 max-w-2xl mx-auto mb-10 text-lg">
          Whether you're a volunteer ready to give back or an NGO looking for
          skilled support — SkillBridge is built for you.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={()=>navigate("/signup")} className="btn-primary">
            Join as Volunteer
          </button>

          <button onClick={()=>{navigate("/signup")}} className="btn-secondary">
            Register NGO
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default About;



