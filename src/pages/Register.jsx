// src/pages/Register.jsx
import React, { useState } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-megadelicias.png';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [rol, setRol] = useState('mesero');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const evaluarFuerza = (pass) => {
    const longitud = pass.length >= 8;
    const mayuscula = /[A-Z]/.test(pass);
    const numero = /\d/.test(pass);
    const simbolo = /[^A-Za-z0-9]/.test(pass);

    const score = [longitud, mayuscula, numero, simbolo].filter(Boolean).length;

    if (score <= 1) return { texto: 'Débil', color: 'bg-red-500', nivel: 1 };
    if (score === 2 || score === 3) return { texto: 'Media', color: 'bg-yellow-400', nivel: 2 };
    if (score === 4) return { texto: 'Fuerte', color: 'bg-green-500', nivel: 3 };

    return { texto: '', color: '', nivel: 0 };
  };

  const fuerza = evaluarFuerza(contrasena);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !correo || !contrasena || !rol) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (fuerza.nivel < 2) {
      setError('La contraseña no es lo suficientemente segura.');
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
      {/* Lado izquierdo */}
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
            <FaUser className="absolute top-3.5 left-3 text-gray-400" />
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
            <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-1 relative">
            <FaLock className="absolute top-3.5 left-3 text-gray-400" />
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
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              tabIndex={-1}
            >
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Barra de seguridad solo si hay algo escrito */}
          {contrasena.length > 0 && (
            <>
              <div className="h-2 w-full bg-gray-200 rounded mb-1">
                <div
                  className={`h-2 rounded ${fuerza.color}`}
                  style={{ width: `${fuerza.nivel * 33.33}%` }}
                />
              </div>
              <p className="text-sm mb-3 text-gray-600">
                Seguridad: <span className="font-semibold">{fuerza.texto}</span>
              </p>
            </>
          )}

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

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded transition"
          >
            Registrarme
          </button>

          <p className="text-center text-sm mt-4">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-rose-500 hover:underline">
              Iniciar sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
