import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

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
import MsgLayout from "./components/layout/MsgLayout";
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
/* Messages */
import Messages from "./pages/Messages";

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
      <ScrollToTop />
      <Routes>
        {/* 🌍 PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 📨 MESSAGES */}
          <Route element={<MsgLayout />}>
            <Route path="/ngo/messages" element={<Messages />} />
            <Route path="/volunteer/messages" element={<Messages />} />
          </Route>

        {/* 🧑‍🤝‍🧑 VOLUNTEER */}
        <Route element={<VolunteerLayout />}>
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
          <Route path="/volunteer/opportunities" element={<VolunteerOpportunities />} />
          <Route path="/profile/volunteer" element={<VolunteerProfile />} />
          <Route path="/volunteer/applications" element={<VolunteerApplications />} />
          {/* <Route path="/volunteer/messages" element={<Messages />} /> */}
        </Route>

        {/* 🏢 NGO */}
        <Route element={<NgoLayout />}>
          <Route path="/ngo/dashboard" element={<NgoDashboard />} />
          <Route path="/ngo/opportunities" element={<OpportunitiesPage />} />
          <Route path="/ngo/opportunities/create" element={<CreateOpportunity />} />        
          <Route path="/ngo/opportunities/edit/:id" element={<EditOpportunity />} />
          <Route path="/profile/ngo" element={<NgoProfile />} />
          <Route path="/ngo/applications" element={<NgoApplications />} />{" "}
          
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
