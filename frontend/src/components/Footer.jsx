import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-white bg-gradient-to-br from-[#1b2836] via-[#223343] to-[#2f465c]">
      <div className="container mx-auto px-6 py-14">
        
        {/* Footer Grid */}
        <div className="grid md:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <div>
            <div className="mb-6">
              <span className="text-3xl font-extrabold tracking-wide text-blue-300">
                SkillBridge
              </span>
            </div>

            <p className="opacity-90 leading-relaxed mb-6 text-gray-200">
              Connecting skilled volunteers with NGOs for meaningful impact.
            </p>

            <div className="flex space-x-5">
              <a href="#" className="text-blue-400 hover:text-blue-300 transition text-xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-sky-400 hover:text-sky-300 transition text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-400 transition text-xl">
                <FaLinkedin />
              </a>
              <a href="#" className="text-pink-400 hover:text-pink-300 transition text-xl">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-200">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#" className="opacity-90 hover:text-white transition">Find Opportunities</a></li>
              <li><a href="#" className="opacity-90 hover:text-white transition">Post Opportunities</a></li>
              <li><a href="#" className="opacity-90 hover:text-white transition">Browse Skills</a></li>
              <li><a href="#" className="opacity-90 hover:text-white transition">Success Stories</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-200">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="opacity-90 hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="opacity-90 hover:text-white transition">Blog</a></li>
              <li><a href="#" className="opacity-90 hover:text-white transition">NGO Resources</a></li>
              <li><a href="#" className="opacity-90 hover:text-white transition">Volunteer Guide</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-200">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="opacity-90 hover:text-white transition">About Us</a></li>
              <li><a href="#" className="opacity-90 hover:text-white transition">Contact</a></li>
              <li><a href="#" className="opacity-90 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="opacity-90 hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom line */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-gray-300">
          <p className="tracking-wide">© 2025 SkillBridge. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
