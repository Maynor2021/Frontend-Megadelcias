// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyToken } from "../utils/auth";

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const check = async () => {
      const isValid = await verifyToken();
      setAuth(isValid);
    };
    check();
  }, []);

  if (auth === null) return <p className="text-center p-4">Verificando sesión...</p>;

  return auth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;