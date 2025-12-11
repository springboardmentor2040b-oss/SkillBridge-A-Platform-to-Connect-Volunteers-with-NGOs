import React from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO SECTION */}
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
                className="px-7 py-3 rounded-full bg-white text-black font-semibold shadow-md hover:bg-cyan-300 transition"
              >
                Join as Volunteer
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-7 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-white/10 transition"
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

      {/* FEATURES SECTION */}
      <section className="w-full  py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            Why Choose SkillBridge?
          </h2>
          <p className="text-center text-gray-600 mt-2 mb-12">
            Connecting passion with purpose.
          </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* CARD 1 */}
          <div className="flex flex-col items-center text-center">
            <img src="/connect.png" alt="Connect NGOs"
          className="w-80 h-56 object-cover rounded-xl hover:scale-105 transition-transform "
        />
            <h3 className="text-xl font-semibold">Connect with NGOs</h3>
              <p className="text-gray-600 mt-2">
                Easily find NGOs aligned with the causes you care about.
              </p>
          </div>
          {/* CARD 2 */}
          <div className="flex flex-col items-center text-center">
            <img src="/skills.png" alt="Use Your Skills"
          className="w-80 h-56 object-cover rounded-xl hover:scale-105 transition-transform "
            />
            <h3 className="text-xl font-semibold">Use Your Skills</h3>
            <p className="text-gray-600 mt-2">
              Apply your skills to make a meaningful community impact.
            </p>
          </div>
          {/* CARD 3 */}
          <div className="flex flex-col items-center text-center">
            <img src="/opportunities.png" alt="Find Opportunities"
          className="w-80 h-56 object-cover rounded-xl hover:scale-105 transition-transform "
            />
            <h3 className="text-xl font-semibold ">Find Opportunities</h3>
            <p className="text-gray-600 mt-2">
              Explore volunteer roles tailored to your interests.
             </p>
          </div>
          </div>
      </div>
    </section>


      {/* FOOTER SECTION */}
      <footer className="w-full bg-gray-900 text-gray-300 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ABOUT */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">SkillBridge</h2>
            <p className="text-gray-400 text-sm">
              Connecting NGOs and volunteers to create meaningful social impact.<br/>
              Fall in love of service.
            </p>
            
          </div>

          {/* QUICK LINKS */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/opportunities" className="hover:text-white">Opportunities</a></li>
              <li><a href="/signup" className="hover:text-white">Join Us</a></li>
            </ul>
          </div>

          {/* SOCIAL LINKS */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">Connect</h2>
            <div className="flex gap-4">
              <Facebook className="w-6 h-6 hover:text-white cursor-pointer" />
              <Instagram className="w-6 h-6 hover:text-white cursor-pointer" />
              <Linkedin className="w-6 h-6 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} SkillBridge. All rights reserved.
        </div>
      </footer>
    </>
  );
}
export default Home;
