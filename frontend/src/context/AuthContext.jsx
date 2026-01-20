import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  // Initialize all state at once from localStorage to prevent cascading updates
  const [authState, setAuthState] = useState(() => {
    const savedToken = localStorage.getItem("token");
    const savedEmail = localStorage.getItem("email");
    const savedUser = localStorage.getItem("user");
    
    let parsedUser = null;
    if (savedUser) {
      try {
        parsedUser = JSON.parse(savedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
      }
    }
    
    return {
      email: savedEmail || "",
      token: savedToken || "",
      user: parsedUser,
      isInitialized: false
    };
  });

  // ✅ CRITICAL: Set axios default headers when token changes
  useEffect(() => {
    if (authState.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authState.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authState.token]);

  // ✅ Mark initialization as complete after mount
  useEffect(() => {
    // Use setTimeout to defer this state update and avoid cascading renders
    const timer = setTimeout(() => {
      setAuthState(prev => ({
        ...prev,
        isInitialized: true
      }));
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // ✅ LOGIN FUNCTION - IMPROVED
  const loginUser = useCallback((email, token, userData = null) => {
    // Update all state at once
setAuthState(prev => ({
  ...prev,
  email,
  token,
  user: userData,
  isInitialized: true
}));


    // Save to localStorage
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
   
    // ✅ Set axios header immediately
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  // ✅ LOGOUT FUNCTION
  const logoutUser = useCallback(() => {
    // Clear all state at once
    setAuthState({
      email: "",
      token: "",
      user: null,
      isInitialized: true
    });

    // Clear localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // ✅ Remove axios header
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  // ✅ Add function to get current token (useful for manual requests)
  const getToken = useCallback(() => {
    return authState.token || localStorage.getItem("token");
  }, [authState.token]);

  const contextValue = React.useMemo(() => ({
    email: authState.email,
    token: authState.token,
    user: authState.user,
    isInitializing: !authState.isInitialized,
    loginUser,
    logoutUser,
    getToken,
    isAuthenticated: !!authState.token
  }), [authState.email, authState.token, authState.user, authState.isInitialized, loginUser, logoutUser, getToken]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export ONLY the context, NOT useAuth
export { AuthContext };