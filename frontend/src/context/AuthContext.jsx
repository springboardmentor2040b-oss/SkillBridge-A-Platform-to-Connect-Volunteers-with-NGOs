import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  // Load data from localStorage on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedEmail = localStorage.getItem("email");

    if (savedToken && savedEmail) {
      setToken(savedToken);
      setEmail(savedEmail);
    }
  }, []);

  // LOGIN FUNCTION
  const loginUser = (email, token) => {
    setEmail(email);
    setToken(token);

    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
  };

  // LOGOUT FUNCTION
  const logoutUser = () => {
    setEmail("");
    setToken("");

    localStorage.removeItem("email");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ email, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
