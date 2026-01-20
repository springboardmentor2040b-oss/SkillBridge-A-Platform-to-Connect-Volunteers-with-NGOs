// import { Outlet, Navigate } from "react-router-dom";
// import VolunteerNavbar from "./VolunteerNavbar";
// import { getUserFromToken } from "../../utils/auth";

// const VolunteerLayout = () => {
//   const user = getUserFromToken();

//   if (!user || user.role !== "volunteer") {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <>
//       <VolunteerNavbar />
//       <main className="pt-14">
//         <Outlet />
//       </main>
//     </>
//   );
// };

// export default VolunteerLayout;


import { Outlet, Navigate } from "react-router-dom";
import VolunteerNavbar from "./VolunteerNavbar";
import { useAuth } from "../../hooks/useAuth";

const VolunteerLayout = () => {
  const { user, isInitializing } = useAuth();

  // ⏳ Wait until auth state is ready
  if (isInitializing) {
    return null; // you can replace this with a loader later
  }

  // ❌ Not logged in or wrong role
  if (!user || user.role !== "volunteer") {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authorized volunteer
return (
  <div className="min-h-screen flex flex-col">
    <VolunteerNavbar />

    <main className="flex-1 pt-14 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

}

export default VolunteerLayout;
