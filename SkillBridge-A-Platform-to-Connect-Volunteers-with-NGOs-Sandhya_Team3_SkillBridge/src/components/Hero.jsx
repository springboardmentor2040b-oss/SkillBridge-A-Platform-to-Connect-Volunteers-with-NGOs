import React from "react";
import heroBg from "/images/hero-bg.jpg";          // Background image


export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-[90vh] flex items-center justify-center text-white px-8 pt-28"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      ></div>

      {/* Dark Overlay for Dull Background */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE TEXT */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-xl">
            Connect Skills with Purpose
          </h1>

          <p className="text-lg text-gray-200 max-w-xl">
            SkillBridge is the platform that brings together skilled volunteers
            and NGOs to create meaningful impact. Whether you're looking to
            contribute your expertise or find talented volunteers for your
            cause, we make connections that matter.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="bg-blue-600 px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700">
              I'm a Volunteer
            </button>

            <button className="border border-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-gray-200 hover:text-black transition">
              I'm an NGO
            </button>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE CARD */}
        <div className="hidden md:block">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition">
            
          </div>
        </div>
      </div>
    </section>
  );
}
