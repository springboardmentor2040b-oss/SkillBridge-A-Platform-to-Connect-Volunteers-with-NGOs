import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ABOUT */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">SkillBridge</h2>
          <p className="text-gray-400 text-sm">
            Connecting NGOs and volunteers to create meaningful social impact.
            <br />
            Fall in love with service.
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
            <FaFacebook className="w-6 h-6 hover:text-white cursor-pointer" />
            <FaInstagram className="w-6 h-6 hover:text-white cursor-pointer" />
            <FaLinkedin className="w-6 h-6 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-500 text-sm mt-10">
        © {new Date().getFullYear()} SkillBridge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
