import React from "react";

const HowWorks = () => {
  return (
    <section className="w-full py-20 px-6 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          How It <span className="text-orange-500">Works</span>
        </h2>
        <p className="text-slate-400 mt-4 text-lg">
          Get started in three simple steps and begin your volunteering journey today
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Step 1 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 text-white text-center group hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-500/25">
            1
          </div>
          <h3 className="text-xl font-bold mb-3">Create Profile</h3>
          <p className="text-slate-400 leading-relaxed">
            Sign up and tell us about your skills, interests, and availability.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 text-white text-center group hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-500/25">
            2
          </div>
          <h3 className="text-xl font-bold mb-3">Explore Opportunities</h3>
          <p className="text-slate-400 leading-relaxed">
            Browse verified NGO opportunities tailored to your skills and interests.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 text-white text-center group hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-500/25">
            3
          </div>
          <h3 className="text-xl font-bold mb-3">Start Volunteering</h3>
          <p className="text-slate-400 leading-relaxed">
            Connect with NGOs and begin making a meaningful impact in your community.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowWorks;
