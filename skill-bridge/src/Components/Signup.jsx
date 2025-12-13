import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", gender: "",
    dob: "", phone: "", city: "", place: "", pinCode: ""
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) navigate("/dashboard");
    else alert("Signup failed");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <input key={key} name={key} value={formData[key]}
              placeholder={key} onChange={handleChange} required />
          ))}
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
