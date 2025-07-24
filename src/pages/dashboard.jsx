import React, { useEffect, useState, useContext } from 'react';
import {
  FaUserCog,
  FaCashRegister,
  FaUtensils,
  FaClipboardList,
  FaBoxOpen,
  FaChartBar,
  FaCalculator,
} from 'react-icons/fa';
import logo from '../assets/logo-megadelicias.png';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../context/UserContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);

  const [userName, setUserName] = useState('Usuario');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.nombre || 'Usuario');
        setUserRole(decoded.rol || null);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        logout();
        navigate('/login');
      }
    } else {
      logout();
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  const getOptions = () => {
    const baseOptions = [];

    if (userRole === 'admin') {
      baseOptions.push(
        { label: 'Administrador', icon: <FaUserCog size={50} />, path: '/admin' },
        { label: 'Caja', icon: <FaCashRegister size={50} />, path: '/caja' },
        { label: 'Mesero', icon: <FaUtensils size={50} />, path: '/mesero' },
        { label: 'Inventario', icon: <FaClipboardList size={50} /> },
        { label: 'Cocina', icon: <FaBoxOpen size={50} /> },
        { label: 'Reportes', icon: <FaChartBar size={50} /> },
        { label: 'Contabilidad', icon: <FaCalculator size={50} />, path: '/contabilidad' }
      );
    } else if (userRole === 'mesero') {
      baseOptions.push(
        { label: 'Mesero', icon: <FaUtensils size={50} />, path: '/mesero' },
        { label: 'Caja', icon: <FaCashRegister size={50} />, path: '/caja' }
      );
    } else if (userRole === 'caja') {
      baseOptions.push({ label: 'Caja', icon: <FaCashRegister size={50} />, path: '/caja' });
    }

    return baseOptions;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100 flex flex-col">
      {/* TopBar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <img src={logo} alt="Logo Mega Delicias" className="w-36" />
        <div className="flex items-center space-x-4">
          <span className="text-gray-800 font-semibold">Hola, {userName}</span>
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col items-center mt-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Menú Principal</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-5xl w-full justify-items-center">
          {getOptions().map((option, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white border shadow-xl rounded-full w-40 h-40 justify-center hover:scale-105 transition-all cursor-pointer"
              onClick={() => option.path && navigate(option.path)}
            >
              <div className="text-red-600 mb-2">{option.icon}</div>
              <span className="text-center text-sm font-semibold text-gray-700">
                {option.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
