import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Public */
import Login from "./pages/login";
import Signup from "./pages/signup";

/* Dashboards */
import VolunteerDashboard from "./pages/VolunteerDashboard";
import NgoDashboard from "./pages/NgoDashboard";

/* Volunteer */
import VolunteerProfile from "./pages/VolunteerProfile";
import VolunteerOpportunities from "./pages/VolunteerOpportunities";
import VolunteerApplications from "./pages/VolunteerApplications"; // ADD THIS IMPORT

/* NGO */
import NgoProfile from "./pages/NgoProfile";
import CreateOpportunity from "./pages/createOpportunity";
import EditOpportunity from "./pages/EditOpportunity";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import NgoApplications from "./pages/NgoApplications"; // ADD THIS IMPORT

/* Layouts */
import VolunteerLayout from "./components/layout/VolunteerLayout";
import NgoLayout from "./components/layout/NgoLayout";

/* Landing */
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Opportunities from "./components/Opportunities";
import Testimonials from "./components/Testimonials";
import Features from "./components/Features";
import Footer from "./components/Footer";

const LandingPage = () => (
  <>
    <Header />
    <Hero />
    <HowItWorks />
    <Opportunities />
    <Testimonials />
    <Features />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Routes>

        {/* 🌍 PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🧑‍🤝‍🧑 VOLUNTEER */}
        <Route element={<VolunteerLayout />}>
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
          <Route path="/volunteer/opportunities" element={<VolunteerOpportunities />} />
          <Route path="/profile/volunteer" element={<VolunteerProfile />} />
          <Route path="/volunteer/applications" element={<VolunteerApplications />} /> {/* UPDATE THIS LINE */}
          <Route path="/volunteer/messages" element={<div className="p-8">Messages coming soon</div>} />
        </Route>

        {/* 🏢 NGO */}
        <Route element={<NgoLayout />}>
          <Route path="/ngo/dashboard" element={<NgoDashboard />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/opportunities/create" element={<CreateOpportunity />} />
          <Route path="/opportunities/edit/:id" element={<EditOpportunity />} />
          <Route path="/profile/ngo" element={<NgoProfile />} />
          <Route path="/ngo/applications" element={<NgoApplications />} /> {/* UPDATE THIS LINE */}
          <Route path="/messages" element={<div className="p-8">Messages coming soon</div>} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;