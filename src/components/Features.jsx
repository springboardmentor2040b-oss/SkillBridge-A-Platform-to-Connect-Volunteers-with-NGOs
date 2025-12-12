import React from "react";

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        <h2 className="text-4xl font-extrabold text-gray-900">
          Why Choose SkillBridge?
        </h2>

        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          We make volunteering and NGO collaboration smooth, meaningful, and impactful.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">

          {/* Card 1 */}
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600">Find Your Cause</h3>
            <p className="text-gray-600 mt-2">
              Discover volunteer opportunities that match your passion.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600">Build Networks</h3>
            <p className="text-gray-600 mt-2">
              Connect with passionate changemakers and leaders.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600">Track Impact</h3>
            <p className="text-gray-600 mt-2">
              Measure the impact you’re creating with every contribution.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600">Empower NGOs</h3>
            <p className="text-gray-600 mt-2">
              Help NGOs grow with your skills and time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
