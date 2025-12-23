import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import "./Footer.css";
import img from "../assets/s.jpg";
import {
  FaUsers,
  FaBuilding,
  FaClock,
  FaHeart,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO SECTION */}
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
              <button
                className="btn-primary"
                onClick={() => navigate("/signup")}
              >
                Get Started 🚀
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>

          <div className="hero-image animate-fade">
            <img src={img} alt="Learning" className="image-3d" />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
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

      {/* FOOTER SECTION */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-box glass">
            <h2>
              Skill<span>Bridge</span>
            </h2>
            <p>
              Bridging skills with opportunities. Learn smarter, grow faster,
              and build a better future.
            </p>

            <div className="social-icons">
              <FaFacebookF />
              <FaTwitter />
              <FaLinkedinIn />
              <FaInstagram />
            </div>
          </div>

          <div className="footer-box">
            <h3>Quick Links</h3>
            <ul>
              <li>Home</li>
              <li>Courses</li>
              <li>Mentors</li>
              <li>About Us</li>
            </ul>
          </div>

          <div className="footer-box">
            <h3>Resources</h3>
            <ul>
              <li>Blog</li>
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          <div className="footer-box">
            <h3>Contact</h3>
            <p><FaEnvelope /> support@skillbridge.com</p>
            <p><FaPhoneAlt /> +91 98765 43210</p>
            <p><FaMapMarkerAlt /> India</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2025 SkillBridge. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Hero;
