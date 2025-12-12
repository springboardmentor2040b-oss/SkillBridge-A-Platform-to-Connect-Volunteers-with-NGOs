import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Testimonials />
      <Footer />
    </div>
  );
}
