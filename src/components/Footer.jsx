export default function Footer() {
  return (
    <footer className="bg-[#0D1628] text-white pt-16 pb-10 px-6 md:px-20">
      <div className="grid md:grid-cols-3 gap-10">

        {/* LEFT SECTION */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💙</span>
            <h2 className="text-2xl font-bold">SkillBridge</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Empowering volunteers and NGOs to create lasting change.
          </p>
        </div>

        {/* CENTER SECTION */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Explore</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="hover:text-white cursor-pointer">Features</li>
            <li className="hover:text-white cursor-pointer">How It Works</li>
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <p className="text-gray-300 mb-2">Email: support@skillbridge.org</p>
          <p className="text-gray-300">Phone: +91 98765 43210</p>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="text-center text-gray-400 mt-12 border-t border-gray-700 pt-6">
        © 2025 SkillBridge — All Rights Reserved
      </div>
    </footer>
  );
}
