import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ApplicationProvider } from "./context/ApplicationContext.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ApplicationProvider>
        <App />
      </ApplicationProvider>
    </AuthProvider>
  </React.StrictMode>
);