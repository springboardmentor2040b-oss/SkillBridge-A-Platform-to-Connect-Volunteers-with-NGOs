import { Outlet, Navigate } from "react-router-dom";
import NgoNavbar from "./NgoNavbar";
import { getUserFromToken } from "../../utils/auth";

const NgoLayout = () => {
  const user = getUserFromToken();

  if (!user || user.role !== "ngo") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NgoNavbar />
      <main className="pt-14">
        <Outlet />
      </main>
    </>
  );
};

export default NgoLayout;
