import React from "react";

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-extrabold text-gray-900">
          What Our Community Says
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700">
              “SkillBridge helped me find the perfect volunteering opportunity!”
            </p>
            <p className="mt-4 font-semibold text-blue-600">– Volunteer</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700">
              “We found passionate volunteers who matched our NGO needs perfectly.”
            </p>
            <p className="mt-4 font-semibold text-blue-600">– NGO Partner</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700">
              “A seamless way to create real-world social impact.”
            </p>
            <p className="mt-4 font-semibold text-blue-600">– Volunteer</p>
          </div>

        </div>

      </div>
    </section>
  );
}
