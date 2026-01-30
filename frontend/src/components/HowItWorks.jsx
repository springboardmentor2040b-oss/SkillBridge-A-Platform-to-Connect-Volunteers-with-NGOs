import React from "react";
import { FaUserPlus, FaHandshake, FaComments } from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUserPlus className="text-blue-600" />,
      title: "Register",
      description:
        "Sign up as a Volunteer or NGO. Create your profile and showcase your skills or organizational needs.",
    },
    {
      icon: <FaHandshake className="text-orange-500" />,
      title: "Connect & Post",
      description:
        "Volunteers create skill profiles. NGOs post skill-categorized opportunities with detailed requirements.",
    },
    {
      icon: <FaComments className="text-green-600" />,
      title: "Match & Act",
      description:
        "Browse opportunities, apply with one click, and communicate directly via our built-in chat system.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-[#E3F5F9] via-[#D8F0F4] to-[#CBE7EF]"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-[#183B56] mb-4">
            How It Works
          </h2>
          <p className="text-lg font-body text-[#2D4A60] max-w-2xl mx-auto">
            Getting started is simple. Three easy steps to connect your skills with meaningful causes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200
                         hover:shadow-2xl hover:-translate-y-2 transition-all duration-300
                         flex flex-col"
            >
              {/* Step Number */}
              <div
                className="w-14 h-14 bg-[#6EC0CE] text-white font-bold text-xl rounded-full
                           flex items-center justify-center shadow-lg mx-auto -mt-14 mb-6"
              >
                {index + 1}
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6 text-5xl">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-heading font-semibold text-[#183B56] text-center mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-body text-[#2D4A60] leading-relaxed text-center flex-grow">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
