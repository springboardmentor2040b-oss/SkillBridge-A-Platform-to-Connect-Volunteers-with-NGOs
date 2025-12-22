import { Outlet, Navigate } from "react-router-dom";
import VolunteerNavbar from "./VolunteerNavbar";
import { getUserFromToken } from "../../utils/auth";

const VolunteerLayout = () => {
  const user = getUserFromToken();

  if (!user || user.role !== "volunteer") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <VolunteerNavbar />
      <main className="pt-14">
        <Outlet />
      </main>
    </>
  );
};

export default VolunteerLayout;
