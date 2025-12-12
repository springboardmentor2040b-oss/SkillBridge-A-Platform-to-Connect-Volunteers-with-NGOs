import React from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Opportunities = () => {
  const opportunities = [
    {
      title: "Web Developer for Education Portal",
      organization: "Learn For All Foundation",
      description: "Help build an interactive learning platform for underprivileged students.",
      skills: ["React", "TypeScript", "UI/UX"],
      location: "Delhi",
      duration: "Short-term",
      type: "Part-time",
    },
    {
      title: "Marketing Strategist",
      organization: "Clean Ocean Project",
      description: "Develop campaigns to raise awareness about ocean conservation.",
      skills: ["Digital Marketing", "Social Media", "Content Creation"],
      location: "Chennai",
      duration: "Long-term",
      type: "Part-time",
    },
    {
      title: "Translator – English to Spanish",
      organization: "Global Health Initiative",
      description: "Translate health education materials for Spanish-speaking communities.",
      skills: ["Translation", "Medical Terminology", "Proofreading"],
      location: "Remote",
      duration: "Ongoing",
      type: "Part-time",
    },
    {
      title: "Data Analyst for Impact Assessment",
      organization: "Youth Empowerment Network",
      description: "Analyze program data to measure and report social impact.",
      skills: ["Data Analysis", "Python", "Visualization"],
      location: "Remote",
      duration: "Short-term",
      type: "Part-time",
    },
  ];

  return (
    <section
      id="opportunities"
      className="py-20 bg-gradient-to-br from-[#E3F5F9] via-[#D8F0F4] to-[#CBE7EF]"
    >
      <div className="container mx-auto px-6">

        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-[#183B56] mb-4">
            Opportunities for Your Skills
          </h2>
          <p className="text-lg font-body text-[#2D4A60] max-w-2xl mx-auto">
            Discover meaningful ways to contribute your expertise to organizations making a difference.
          </p>
        </div>

        {/* Opportunity Cards */}
        <div className="grid md:grid-cols-2 gap-10">
          {opportunities.map((opp, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 
                         hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">

                {/* Title & Organization */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#183B56] mb-1">
                    {opp.title}
                  </h3>
                  <p className="text-[#2D4A60] font-medium">
                    {opp.organization}
                  </p>
                </div>

                {/* Description */}
                <p className="text-[#2D4A60] mb-6 leading-relaxed">
                  {opp.description}
                </p>

                {/* Skills */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {opp.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-[#E3F5F9] text-[#183B56] font-medium 
                                   rounded-md text-sm border border-[#6EC0CE]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location, Duration, Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-6">

                    {/* Location */}
                    <div className="flex items-center text-[#2D4A60]">
                      <FaMapMarkerAlt className="mr-2 text-[#6EC0CE]" />
                      <span className="font-medium">{opp.location}</span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center text-[#2D4A60]">
                      <FaClock className="mr-2 text-[#6EC0CE]" />
                      <span className="font-medium">{opp.duration}</span>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    className="px-6 py-3 bg-[#FF7A30] text-white font-medium rounded-lg 
                               hover:bg-[#E86820] transition duration-300 shadow-md hover:shadow-xl"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-14 pt-8 border-t border-gray-300">
          <button
            className="px-10 py-3 bg-[#FF7A30] text-white font-semibold rounded-lg 
                       hover:bg-[#E86820] transition duration-300 shadow-md hover:shadow-xl"
          >
            View All Opportunities
          </button>
        </div>

      </div>
    </section>
  );
};

export default Opportunities;
