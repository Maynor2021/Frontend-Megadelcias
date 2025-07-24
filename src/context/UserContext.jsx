// src/context/UserContext.jsx
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUsuario(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUsuario(decoded);
    } catch (err) {
      console.error("Token inválido:", err);
      localStorage.removeItem("token");
      setUsuario(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUsuario(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <UserContext.Provider value={{ usuario, setUsuario, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
