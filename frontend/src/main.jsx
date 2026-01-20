import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ApplicationProvider } from "./context/ApplicationContext.jsx";
import ChatProvider from "./context/ChatProvider.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ApplicationProvider>
        <ChatProvider>
        <App />
        </ChatProvider>
      </ApplicationProvider>
    </AuthProvider>
  </React.StrictMode>
);