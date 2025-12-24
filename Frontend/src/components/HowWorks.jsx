import React from "react";

const HowWorks = () => {
  return (
    <section className="w-full mt-6 py-20 px-6 bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          How It Works
        </h1>
        <p className="text-lg md:text-xl text-purple-100 mt-4">
          Get started in three simple steps and begin your volunteering journey today
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* Step 1 */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 
                        rounded-3xl p-8 text-white shadow-xl text-center
                        hover:scale-[1.03] transition duration-300">
          <h2 className="text-5xl font-extrabold text-orange-400 mb-4">1</h2>
          <h3 className="text-xl font-bold mb-3">Create Profile</h3>
          <p className="text-purple-100">
            Sign up and tell us about your skills, interests, and availability.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 
                        rounded-3xl p-8 text-white shadow-xl text-center
                        hover:scale-[1.03] transition duration-300">
          <h2 className="text-5xl font-extrabold text-orange-400 mb-4">2</h2>
          <h3 className="text-xl font-bold mb-3">Explore Opportunities</h3>
          <p className="text-purple-100">
            Browse verified NGO opportunities tailored to your profile.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 
                        rounded-3xl p-8 text-white shadow-xl text-center
                        hover:scale-[1.03] transition duration-300">
          <h2 className="text-5xl font-extrabold text-orange-400 mb-4">3</h2>
          <h3 className="text-xl font-bold mb-3">Start Volunteering</h3>
          <p className="text-purple-100">
            Connect with NGOs and begin making a meaningful impact.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowWorks;
