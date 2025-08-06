import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (adminOnly) {
      const token = localStorage.getItem("adminToken");
      setIsAdminAuthenticated(!!token);
      setCheckingAdmin(false);
    }
  }, [adminOnly]);

  if (adminOnly) {
    if (checkingAdmin)
      return <div className="loading-text">Checking admin authentication...</div>;

    return isAdminAuthenticated ? (
      <>{children}</>
    ) : (
      <Navigate to="/admin/login" replace />
    );
  }

  if (loading) return <div className="loading-text">Loading user...</div>;

  return user ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
