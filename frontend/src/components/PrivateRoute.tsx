import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 to-black text-white animate-pulse space-y-4">
  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  <p className="text-lg text-blue-100 tracking-wide">
    Authenticating your session...
  </p>
</div>
;

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
