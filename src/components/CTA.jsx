import React from "react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto bg-blue-600 text-white rounded-3xl p-12 text-center shadow-lg">

        <h2 className="text-4xl font-extrabold">Ready to Make an Impact?</h2>
        <p className="text-blue-100 mt-3 text-lg">
          Join SkillBridge today and be part of meaningful change.
        </p>

        <div className="flex justify-center gap-6 mt-8">
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            I Already Have an Account
          </Link>
        </div>

      </div>
    </section>
  );
}
