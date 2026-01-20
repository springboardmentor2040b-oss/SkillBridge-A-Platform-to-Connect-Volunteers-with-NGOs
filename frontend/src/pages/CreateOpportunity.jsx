import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";
import SkillSelector from "../components/SkillSelector";
import OpportunityForm from "../components/OpportunityForm";
import API from "../services/api";


export default function CreateOpportunity() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("User");
  const [successMessage, setSuccessMessage] = useState("");
  const [userRole, setUserRole] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: [],
    duration: "",
    location: "",
    status: "open",
  });

  // ✅ Load username from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setUserName(profile.name || "User");
      setUserRole(profile.role);
    }
  }, []);

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const  handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole !== "ngo") {
    setSuccessMessage("Only NGOs can create opportunities");
    return;
    }

  try {
  await API.post("/opportunities", {
    title: form.title,
    description: form.description,
    required_skills: form.skills,   // backend expects this name
    duration: form.duration,
    location: form.location,
    status: form.status,
  });

  setSuccessMessage("Opportunity created successfully");

  setTimeout(() => {
    setSuccessMessage("");
    navigate("/dashboard");
  }, 2500);
} catch (error) {
  setSuccessMessage(
    error.response?.data?.message || "Error creating opportunity"
  );
}


    

    setSuccessMessage("Opportunity created successfully");

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/dashboard");
    }, 2500);
  };
  // 🔐 STEP 3: Allow ONLY NGO to access Create Opportunity
  if (userRole === "volunteer") {
   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-lg text-gray-600">
        Only NGOs can create new opportunities.
      </p>
    </div>
   );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV */}
      <header className="bg-blue-600 text-white">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Logo size={34} textColor="white" />
            <span
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </span>
            <span className="font-semibold">Opportunities</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center">
              {userName.charAt(0)}
            </div>
            <span>{userName}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* ✅ INLINE SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-100 text-green-700 flex items-center gap-2">
            ✅ {successMessage}
          </div>
        )}

        <OpportunityForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          submitLabel="Create Opportunity"
        />

      </main>
    </div>
  );
}
