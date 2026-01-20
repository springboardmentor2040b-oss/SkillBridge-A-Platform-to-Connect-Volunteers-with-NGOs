import { Outlet, Navigate } from "react-router-dom";
import NgoNavbar from "./NgoNavbar";
import VolunteerNavbar from "./VolunteerNavbar";
import { useAuth } from "../../hooks/useAuth";

export default function MsgLayout() {
  const { user, isInitializing, isAuthenticated } = useAuth();

  if (isInitializing) return null;

  // 🔐 Only check authentication, NOT role-path
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const Navbar =
    user.role === "ngo" ? NgoNavbar : VolunteerNavbar;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 flex min-h-0 overflow-hidden pt-14">
        <Outlet />
      </main>
    </div>
  );
}
