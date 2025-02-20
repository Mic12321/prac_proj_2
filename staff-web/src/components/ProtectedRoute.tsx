import React from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  element: React.JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  element,
}) => {
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
