import React from "react";
import { FaCheck } from "react-icons/fa";
import { TbPointFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const About = () => {
  const navigate = useNavigate();

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
    <div className="w-full overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white px-6 py-24 md:py-28">

        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Bridging <span className="text-green-400">Skills</span> with{" "}
            <span className="text-blue-400">Social Impact</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-purple-100 max-w-3xl mx-auto">
            SkillBridge is a platform where passionate volunteers and verified NGOs
            come together to create real-world impact through meaningful collaboration.
          </p>
        </div>

        {/* CARDS */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative z-10 mt-24 px-6"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Card 1 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white/15 backdrop-blur-xl border border-white/20 
                            rounded-3xl p-8 md:p-10 text-white shadow-xl
                            transition duration-300"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Why We Built SkillBridge
              </h2>

              <p className="flex items-center gap-3 text-purple-100 leading-relaxed mb-4">
                <span className="text-xl text-green-400 " ><TbPointFilled />
                </span>
                NGOs struggle to find skilled volunteers. Volunteers struggle to
                find genuine opportunities.
              </p>

              <p className="flex items-center gap-3 text-purple-100 leading-relaxed">
                <span className="text-xl text-green-400 " ><TbPointFilled />
                </span>
                SkillBridge bridges this gap by connecting the right people with
                the right causes — transparently, securely, and impactfully.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white/15 backdrop-blur-xl border border-white/20 
                            rounded-3xl p-8 md:p-10 text-white shadow-xl
                            transition duration-300"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                What Makes Us Different
              </h3>

              <ul className="space-y-4 text-purple-100">
                <li className="flex items-center gap-3">
                  <span className="text-green-400"><FaCheck /></span> Verified & trusted NGOs
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400"><FaCheck /></span> Skill-based opportunity matching
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400"><FaCheck /></span> Transparent collaboration
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400"><FaCheck /></span> Real impact, measurable outcomes
                </li>
              </ul>
            </motion.div>

          </div>
        </motion.div>

        {/* BACKGROUND BLURS */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Be Part of the Change
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Whether you're a volunteer ready to give back or an NGO looking for
          skilled support — SkillBridge is built for you.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          <button onClick={() => navigate("/signup")} className="px-8 py-4 bg-purple-700 text-white rounded-full 
                             hover:bg-purple-800 transition shadow-lg">
            Join as Volunteer
          </button>

          <button onClick={() => { navigate("/signup") }} className="px-8 py-4 bg-blue-600 text-white rounded-full 
                             hover:bg-blue-700 transition shadow-lg">
            Register NGO
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;


