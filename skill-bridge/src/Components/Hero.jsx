import React from "react";
import "./Hero.css";
import img from "../assets/s.jpg";
import { FaUsers, FaBuilding, FaClock, FaHeart } from "react-icons/fa";

const Hero = ({ goSignup, goLogin }) => {
  return (
    <>
      <section className="hero">
        <div className="floating-circle circle1"></div>
        <div className="floating-circle circle2"></div>

        <div className="hero-container">
          <div className="hero-content glass-card animate-fade">
            <h1 className="animate-slide">
              Upgrade Your Skills With <span>SkillBridge</span>
            </h1>

            <p className="animate-slide-delay">
              Learn job-ready skills, connect with mentors, and grow your career.
            </p>

            <div className="hero-buttons animate-slide-delay2">
              <button type="button" className="btn-primary" onClick={goSignup}>
                Get Started 🚀
              </button>
              <button type="button" className="btn-secondary" onClick={goLogin}>
                Login
              </button>
            </div>
          </div>

          <div className="hero-image animate-fade">
            <img src={img} alt="Learning" className="image-3d" />
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <FaUsers size={28} />
          <h3>5,000+</h3>
          <p>Active Volunteers</p>
        </div>
        <div className="stat-card">
          <FaBuilding size={28} />
          <h3>200+</h3>
          <p>Partner NGOs</p>
        </div>
        <div className="stat-card">
          <FaClock size={28} />
          <h3>50K+</h3>
          <p>Hours Contributed</p>
        </div>
        <div className="stat-card">
          <FaHeart size={28} />
          <h3>1,000+</h3>
          <p>Projects Completed</p>
        </div>
      </section>
    </>
  );
};

export default Hero;
