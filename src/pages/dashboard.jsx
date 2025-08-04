// src/pages/Dashboard.jsx
import React from 'react';
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


export default function Dashboard() {
  const navigate = useNavigate();

  // Obtener el nombre desde el token JWT
  let userName = '';
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.nombre || 'Usuario';
    } catch (err) {
      console.error('Token inválido:', err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleModuleClick = (label) => {
    if (label === 'Contabilidad') {
      navigate('/contabilidad');
    } else if (label === 'Cocina') {
      navigate('/cocina');
    } else if (label === 'Platos'){
      navigate ('/Platos')
    }
     else {
      // Para otros módulos, mostrar mensaje de "próximamente"
      alert(`🚧 Módulo "${label}" en desarrollo`);
    }
  };

  const options = [

    { label: 'Administrador', icon: <FaUserCog size={50} /> },
    { label: 'Caja', icon: <FaCashRegister size={50} /> },
    { label: 'Mesero', icon: <FaUtensils size={50} /> },
    { label: 'Inventario', icon: <FaClipboardList size={50} /> },
    { label: 'Cocina', icon: <FaBoxOpen size={50} /> },
    { label: 'Reportes', icon: <FaChartBar size={50} /> },
    { label: 'Contabilidad', icon: <FaCalculator size={50} /> },
    { label: 'Platos', icon: <FaClipboardList size={50} /> }

  ];

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
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleModuleClick(option.label)}
              className="flex flex-col items-center bg-white border shadow-xl rounded-full w-40 h-40 justify-center hover:scale-105 transition-all cursor-pointer"
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