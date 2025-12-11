import React from 'react';
import { FaUserPlus, FaHandshake, FaComments, FaArrowRight } from 'react-icons/fa';

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
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-[#183B56] mb-4">
            How It Works
          </h2>
          <p className="text-lg font-body text-[#2D4A60] max-w-2xl mx-auto">
            Getting started is simple. Three easy steps to connect your skills with meaningful causes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="flex flex-col md:flex-row justify-center items-start gap-10 lg:gap-16">
            {steps.map((step, index) => (
              <div key={index} className="relative">

                {/* Step Card */}
                <div
                  className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm mx-auto border border-gray-200
                             hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative z-10"
                >
                  {/* Step Number */}
                  <div
                    className="absolute -top-5 left-1/2 transform -translate-x-1/2
                               w-14 h-14 bg-[#6EC0CE] text-white font-bold text-xl rounded-full
                               flex items-center justify-center shadow-lg"
                  >
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center pt-6 mb-6">
                    <div className="text-5xl">{step.icon}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-heading font-semibold text-[#183B56] text-center mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-[#2D4A60] leading-relaxed text-center">
                    {step.description}
                  </p>
                </div>

                {/* Arrow Icons (between steps) */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:flex items-center justify-center absolute top-1/2 
                               right-0 transform translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <div className="bg-[#6EC0CE]/20 p-3 rounded-full">
                      <FaArrowRight className="text-[#183B56] text-xl" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#6EC0CE]/30 z-0"></div>
        </div>

        {/* Mobile Vertical Line */}
        <div className="md:hidden flex flex-col items-center mt-8">
          {steps.slice(0, -1).map((_, index) => (
            <div key={index} className="h-8 w-0.5 bg-[#6EC0CE]/40 my-2"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
