import React from "react";

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-br from-[#E3F5F9] via-[#D8F0F4] to-[#CBE7EF]"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Testimonial Quote */}
          <p className="text-2xl md:text-3xl text-[#183B56] font-light leading-relaxed italic mb-12">
            "SkillBridge helped us find a volunteer with the exact UI/UX design
            skills we desperately needed. Within a week, we had a complete
            redesign of our donation platform. Fantastic platform!"
          </p>

          {/* Profile Image Placeholder */}
          <div className="w-20 h-20 bg-[#6EC0CE]/30 border-2 border-[#6EC0CE] rounded-full 
                          flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-[#183B56] text-2xl font-bold">MR</span>
          </div>

          {/* Name + Role */}
          <h4 className="text-xl font-semibold text-[#183B56] mb-1">
            Maria Rodriguez
          </h4>
          <p className="text-[#2D4A60] mb-8">
            Director, Community Health Network
          </p>

          {/* CTA Button */}
          <a
            href="#register"
            className="inline-flex items-center justify-center px-8 py-4 
                       bg-[#FF7A30] text-white font-semibold rounded-lg
                       hover:bg-[#E86820] transition duration-300 
                       shadow-md hover:shadow-xl"
          >
            Register Your Organization →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
