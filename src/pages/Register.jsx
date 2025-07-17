// src/pages/Register.jsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-megadelicias.png';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('mesero'); // Puedes cambiar los roles disponibles
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !correo || !contrasena || !rol) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contraseña: contrasena, rol }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en registro');

      alert('Usuario registrado con éxito');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Lado Izquierdo */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-tr from-rose-300 via-pink-400 to-purple-700 text-white p-10">
        <img src={logo} alt="Logo" className="w-40 mb-8 drop-shadow-lg" />
        <h1 className="text-3xl font-bold mb-4">Regístrate en MegaDelicias</h1>
        <p className="text-center max-w-sm">
          Crea una cuenta para acceder al panel de control del restaurante.
        </p>
      </div>

      {/* Formulario */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-md p-8 shadow-md rounded"
        >
          <h2 className="text-2xl font-bold text-center text-rose-700 mb-6">
            Crear cuenta
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          {/* Nombre */}
          <div className="mb-4 relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Correo */}
          <div className="mb-4 relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-4 relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Rol */}
          <div className="mb-4">
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="mesero">Mesero</option>
              <option value="admin">Administrador</option>
              <option value="cocinero">Cocinero</option>
              <option value="caja">Caja</option>
            </select>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded transition"
          >
            Registrarme
          </button>

          <p className="text-center text-sm mt-4">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="text-rose-500 hover:underline">
              Iniciar sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}