import howImg from "/images/how-it-works.jpg";

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 md:px-16 bg-[#F8F9FD]">
      <h2 className="text-4xl font-bold text-center mb-12">How SkillBridge Works</h2>

      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE CONTENT */}
        <div className="space-y-10">
          
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="bg-blue-600 text-white h-14 w-14 flex items-center justify-center rounded-xl text-xl font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold">Create Your Account</h3>
              <p className="text-gray-600">
                Create your volunteer or NGO account — quick, free & easy.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="bg-blue-600 text-white h-14 w-14 flex items-center justify-center rounded-xl text-xl font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold">Discover Opportunities</h3>
              <p className="text-gray-600">
                Find positions or volunteers matching your skills and needs.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="bg-blue-600 text-white h-14 w-14 flex items-center justify-center rounded-xl text-xl font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold">Connect & Collaborate</h3>
              <p className="text-gray-600">
                Start working together and create meaningful change.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center">
          <img
            src={howImg}
            className="w-[90%] rounded-2xl shadow-lg"
            alt="How It Works"
          />
        </div>
      </div>
    </section>
  );
}
