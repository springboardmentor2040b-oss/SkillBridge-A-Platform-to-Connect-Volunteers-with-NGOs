import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";
import HowWorks from "./HowWorks";
import About from "./About";

function Home() {
  const navigate = useNavigate();

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full h-[700px] lg:h-[800px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/home.jpeg')" }}
        >
          {/* Purple Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-800/85 to-fuchsia-700/90"></div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 text-center"
        >
          {/* CONTENT */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight text-white">
              Empowering NGOs.
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
              <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">Inspiring</span>{" "}
              <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]">Volunteers.</span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-violet-100 text-base md:text-xl max-w-2xl mx-auto mt-8 font-medium leading-relaxed"
          >
            SkillBridge connects volunteers with NGOs to create meaningful impact.
            Explore opportunities, share your skills, and support causes you care about.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="px-10 py-5 rounded-full bg-white text-purple-900 font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-2xl"
            >
              Join as Volunteer
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="px-10 py-5 rounded-full bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 transition-colors duration-300 shadow-2xl"
            >
              Register NGO
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>

        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
            >
              ✨ Our Features
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent mb-4">
              Why Choose SkillBridge?
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connecting passion with purpose through innovative solutions
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                img: "/connect.png",
                title: "Connect with NGOs",
                desc: "Find NGOs aligned with your passion.",
                gradient: "from-blue-500 to-cyan-500",
                icon: "🤝"
              },
              {
                img: "/skills.png",
                title: "Use Your Skills",
                desc: "Apply your skills to real causes.",
                gradient: "from-purple-500 to-pink-500",
                icon: "💡"
              },
              {
                img: "/opportunities.png",
                title: "Find Opportunities",
                desc: "Discover roles made for you.",
                gradient: "from-orange-500 to-red-500",
                icon: "🎯"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl text-center border border-gray-100
                           transition-all duration-500 relative overflow-hidden"
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>

                {/* Icon Badge */}
                <div className="relative mb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white text-3xl mb-4 shadow-lg`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Image */}
                <div className="relative mb-6 overflow-hidden rounded-2xl group-hover:shadow-xl transition-shadow duration-500">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    src={feature.img}
                    className="mx-auto w-full h-48 object-cover"
                    alt={feature.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="mt-4 flex items-center justify-center gap-2 text-purple-600 font-semibold text-sm"
                >
                  Learn more →
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <HowWorks />

      {/* ABOUT SECTION */}
      <div id="about">
        <About />
      </div>
      <Footer />
    </div>
  );
}

export default Home;