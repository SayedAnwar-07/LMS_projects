import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "@/components/LoadingScreen";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Still loading or user not fetched yet
  if (loading || (isAuthenticated && !user)) {
    return <LoadingScreen />;
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but doesn't have required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log("Role check failed:", user?.role, "not in", allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
