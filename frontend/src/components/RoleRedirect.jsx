import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
const RoleRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" />;
  }

  return <Dashboard />;
};

export default RoleRedirect;
