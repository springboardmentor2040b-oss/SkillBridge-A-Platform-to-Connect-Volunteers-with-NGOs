import React from "react";
import {
  FaComments,
  FaTasks,
  FaUsers,
  FaShieldAlt,
  FaUserTie,
  FaBell,
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaComments className="text-blue-600" />,
      bg: "bg-blue-100",
      title: "Real-time Messaging",
      description:
        "Connect instantly with volunteers or NGOs through our built-in chat system.",
    },
    {
      icon: <FaTasks className="text-green-600" />,
      bg: "bg-green-100",
      title: "Application Management",
      description:
        "Track applications, manage volunteers, and streamline the onboarding process.",
    },
    {
      icon: <FaUsers className="text-purple-600" />,
      bg: "bg-purple-100",
      title: "Skill-based Matching",
      description:
        "Advanced filtering to find the perfect match based on skills, location, and availability.",
    },
    {
      icon: <FaShieldAlt className="text-red-600" />,
      bg: "bg-red-100",
      title: "Verified Organizations",
      description:
        "All NGOs are verified to ensure authentic and impactful volunteer opportunities.",
    },
    {
      icon: <FaUserTie className="text-orange-600" />,
      bg: "bg-orange-100",
      title: "Role-based Profiles",
      description:
        "Tailored experiences for both volunteers and organizations with dedicated dashboards.",
    },
    {
      icon: <FaBell className="text-teal-600" />,
      bg: "bg-teal-100",
      title: "Smart Notifications",
      description:
        "Get notified about new opportunities, application updates, and messages.",
    },
  ];

  return (
    <section
      id="features"
      className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-gray-800 mb-4">
            Platform Features Built for Seamless Connection
          </h2>
          <p className="text-lg font-body text-gray-700 max-w-3xl mx-auto">
            Everything you need to make meaningful connections and create lasting
            impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start">
                <div
                  className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center text-2xl mr-4`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
