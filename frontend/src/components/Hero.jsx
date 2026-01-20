import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#E9F5F8" }} // exact screenshot color
    >
      <div className="relative container mx-auto px-6 py-20 text-center max-w-5xl">

        {/* Small Tagline */}
        <h2 className="text-xl font-body tracking-wider uppercase"
            style={{ color: "#4A6670" }}>
          CONNECTING SKILLS TO CAUSE
        </h2>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-8 leading-tight"
            style={{ color: "#183B56" }}>
          SkillBridge:
          <br />
          <span style={{ color: "#2AA7B3" }}>Connect Skills to Causes</span>
        </h1>

        {/* Description */}
        <p className="text-xl font-body max-w-3xl mx-auto mb-12 leading-relaxed"
           style={{ color: "#4A6670" }}>
          Find skilled volunteers or discover skill-based opportunities for a lasting impact.
          Bridge the gap between talented individuals and organizations making a difference.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 mb-16">
          <div className="text-center">
            <div className="text-5xl font-heading font-bold mb-2" style={{ color: "#183B56" }}>
              2,500+
            </div>
            <div className="font-body text-lg" style={{ color: "#4A6670" }}>
              Active Volunteers
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-heading font-bold mb-2" style={{ color: "#183B56" }}>
              450+
            </div>
            <div className="font-body text-lg" style={{ color: "#4A6670" }}>
              Partner NGOs
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-heading font-bold mb-2" style={{ color: "#183B56" }}>
              1,200+
            </div>
            <div className="font-body text-lg" style={{ color: "#4A6670" }}>
              Successful Matches
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
          onClick={() => navigate("/login")}
            className="px-10 py-4 text-white font-body font-semibold rounded-lg text-lg shadow-md"
            style={{ backgroundColor: "#FF7A30" }}
          >
            Find Opportunities
          </button>

          <button
          onClick={() => navigate("/login")}
            className="px-10 py-4 font-body font-semibold rounded-lg text-lg border-2 shadow-md"
            style={{ borderColor: "#FF7A30", color: "#183B56", backgroundColor: "white" }}
          >
            Post an Opportunity
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
