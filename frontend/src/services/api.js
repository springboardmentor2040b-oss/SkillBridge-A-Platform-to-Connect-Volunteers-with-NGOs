import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= AUTH ================= */
export const registerUser = (userData) =>
  API.post("/users/register", userData);

export const loginUser = (userData) =>
  API.post("/users/login", userData);

/* ============== OPPORTUNITIES ============== */
export const getAllOpportunities = () =>
  API.get("/opportunities");

/* ============== APPLICATIONS ============== */
export const applyForOpportunity = (opportunityId) =>
  API.post("/applications/apply", { opportunityId });

export const getMyApplications = () =>
  API.get("/applications/my");

export default API;
