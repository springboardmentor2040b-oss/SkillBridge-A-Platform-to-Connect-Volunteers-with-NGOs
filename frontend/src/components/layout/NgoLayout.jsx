import { Outlet, Navigate } from "react-router-dom";
import NgoNavbar from "./NgoNavbar";
import { useAuth } from "../../hooks/useAuth";

const NgoLayout = () => {
  const { user, isInitializing } = useAuth();

  // ⏳ Wait until auth state is ready
  if (isInitializing) {
    return null; // replace with loader if needed
  }

  //  ❌ Not logged in or not an NGO
  if (!user || user.role !== "ngo") {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authorized NGO
 return (
  <div className="min-h-screen flex flex-col">
    <NgoNavbar />

    <main className="flex-1 pt-14 overflow-auto">
      <Outlet />
    </main>
  </div>
);

}

export default NgoLayout;
