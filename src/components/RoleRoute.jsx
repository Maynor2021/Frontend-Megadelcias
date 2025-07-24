// src/components/RoleRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function RoleRoute({ children, rol }) {
  const { usuario, loading } = useContext(UserContext);

  if (loading) {
    return <p className="text-center mt-10">Verificando rol...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Permitir acceso si el rol coincide o si es admin
  if (usuario.rol !== rol && usuario.rol !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
