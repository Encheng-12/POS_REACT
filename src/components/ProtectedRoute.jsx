import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute({ allowedRoles }) {
  const userRole = (localStorage.getItem("userRole") || "cashier").toLowerCase();

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
}