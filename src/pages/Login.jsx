import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-megadelicias.png';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña: contrasena }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en login');

      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Lado izquierdo con fondo y logo */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-tr from-rose-300 via-pink-400 to-purple-700 text-white p-10">
        <img src={logo} alt="Logo" className="w-40 mb-8 drop-shadow-lg" />
        <h1 className="text-3xl font-bold mb-4">Bienvenido a MegaDelicias</h1>
        <p className="text-center max-w-sm">
          Disfruta una experiencia llena de felicidad. Inicia sesión para acceder al panel de administración.
        </p>
      </div>

      {/* Formulario de login */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white">
        <form onSubmit={handleSubmit} className="bg-white w-full max-w-md p-8 shadow-md rounded">
          <h2 className="text-2xl font-bold text-center text-rose-700 mb-6">Iniciar Sesión</h2>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {/* Correo */}
          <div className="mb-4 relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
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
              type={mostrarContrasena ? 'text' : 'password'}
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="pl-10 pr-10 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {mostrarContrasena ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* Recordarme y olvidé contraseña */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Recordarme
            </label>
            <a href="#" className="text-rose-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón de entrar */}
          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded transition"
          >
            Entrar
          </button>

          {/* Link de registro */}
          <p className="text-center text-sm mt-4">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-rose-500 hover:underline">
              Regístrate
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
