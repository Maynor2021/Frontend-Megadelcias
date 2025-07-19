// src/pages/Cocina.jsx
import React, { useState, useEffect } from 'react';
import {
  FaArrowLeft,
  FaClock,
  FaCheck,
  FaTimes,
  FaEye,
  FaUtensils,
  FaFire,
  FaListAlt,
  FaCheckDouble
} from 'react-icons/fa';
import logo from '../assets/logo-megadelicias.png';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Cocina() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pendientes');
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Obtener información del usuario
  let userName = '';
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.nombre || 'Chef';
    } catch (err) {
      console.error('Token inválido:', err);
    }
  }

  // Datos de ejemplo para pedidos
  useEffect(() => {
    const pedidosEjemplo = [
      {
        id: 1,
        mesa: 'Mesa 5',
        cliente: 'Juan Pérez',
        hora: '14:30',
        estado: 'pendiente',
        prioridad: 'alta',
        items: [
          { nombre: 'Pizza Margarita', cantidad: 2, notas: 'Sin oregano' },
          { nombre: 'Ensalada César', cantidad: 1, notas: '' },
          { nombre: 'Coca Cola', cantidad: 2, notas: 'Con hielo' }
        ],
        tiempoEstimado: 15,
        tiempoTranscurrido: 5
      },
      {
        id: 2,
        mesa: 'Mesa 3',
        cliente: 'María García',
        hora: '14:25',
        estado: 'en_preparacion',
        prioridad: 'media',
        items: [
          { nombre: 'Hamburguesa Deluxe', cantidad: 1, notas: 'Término medio' },
          { nombre: 'Papas Fritas', cantidad: 1, notas: 'Extra crujientes' }
        ],
        tiempoEstimado: 20,
        tiempoTranscurrido: 12
      },
      {
        id: 3,
        mesa: 'Mesa 8',
        cliente: 'Carlos López',
        hora: '14:15',
        estado: 'listo',
        prioridad: 'baja',
        items: [
          { nombre: 'Sopa del día', cantidad: 1, notas: '' },
          { nombre: 'Pan de ajo', cantidad: 2, notas: '' }
        ],
        tiempoEstimado: 10,
        tiempoTranscurrido: 10
      },
      {
        id: 4,
        mesa: 'Delivery #123',
        cliente: 'Ana Martínez',
        hora: '14:35',
        estado: 'pendiente',
        prioridad: 'alta',
        items: [
          { nombre: 'Pasta Alfredo', cantidad: 1, notas: 'Sin pollo' },
          { nombre: 'Tiramisu', cantidad: 1, notas: '' }
        ],
        tiempoEstimado: 18,
        tiempoTranscurrido: 2
      }
    ];
    setPedidos(pedidosEjemplo);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const cambiarEstadoPedido = (id, nuevoEstado) => {
    setPedidos(pedidos.map(pedido => 
      pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
    ));
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baja': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'text-orange-600 bg-orange-100';
      case 'en_preparacion': return 'text-blue-600 bg-blue-100';
      case 'listo': return 'text-green-600 bg-green-100';
      case 'entregado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filtrarPedidos = () => {
    let pedidosFiltrados = pedidos;
    
    if (activeTab === 'pendientes') {
      pedidosFiltrados = pedidos.filter(p => p.estado === 'pendiente');
    } else if (activeTab === 'en_proceso') {
      pedidosFiltrados = pedidos.filter(p => p.estado === 'en_preparacion');
    } else if (activeTab === 'listos') {
      pedidosFiltrados = pedidos.filter(p => p.estado === 'listo');
    }

    if (filtroEstado !== 'todos') {
      pedidosFiltrados = pedidosFiltrados.filter(p => p.prioridad === filtroEstado);
    }

    return pedidosFiltrados;
  };

  const contarPedidos = (estado) => {
    return pedidos.filter(p => p.estado === estado).length;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* TopBar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft size={24} />
          </button>
          <img src={logo} alt="Logo Mega Delicias" className="w-36" />
          <div className="text-2xl font-bold text-red-600">
            <FaUtensils className="inline mr-2" />
            Cocina
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-800 font-semibold">Chef {userName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="p-6">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="flex items-center">
              <FaClock className="text-orange-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{contarPedidos('pendiente')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <FaFire className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">En Preparación</p>
                <p className="text-2xl font-bold text-blue-600">{contarPedidos('en_preparacion')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <FaCheck className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Listos</p>
                <p className="text-2xl font-bold text-green-600">{contarPedidos('listo')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
            <div className="flex items-center">
              <FaCheckDouble className="text-gray-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Hoy</p>
                <p className="text-2xl font-bold text-gray-600">{pedidos.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex flex-wrap items-center justify-between p-4 border-b">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('todos')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'todos' 
                    ? 'bg-white text-red-600 shadow' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveTab('pendientes')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'pendientes' 
                    ? 'bg-white text-red-600 shadow' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setActiveTab('en_proceso')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'en_proceso' 
                    ? 'bg-white text-red-600 shadow' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                En Proceso
              </button>
              <button
                onClick={() => setActiveTab('listos')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'listos' 
                    ? 'bg-white text-red-600 shadow' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Listos
              </button>
            </div>

            {/* Filtro por prioridad */}
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="todos">Todas las prioridades</option>
              <option value="alta">Prioridad Alta</option>
              <option value="media">Prioridad Media</option>
              <option value="baja">Prioridad Baja</option>
            </select>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtrarPedidos().map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header del pedido */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{pedido.mesa}</h3>
                    <p className="text-red-100">{pedido.cliente}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-100">Hora: {pedido.hora}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getPrioridadColor(pedido.prioridad)}`}>
                      {pedido.prioridad.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido del pedido */}
              <div className="p-4">
                {/* Estado y tiempo */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(pedido.estado)}`}>
                    {pedido.estado.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="text-sm text-gray-600">
                    <FaClock className="inline mr-1" />
                    {pedido.tiempoTranscurrido}/{pedido.tiempoEstimado} min
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      pedido.tiempoTranscurrido > pedido.tiempoEstimado 
                        ? 'bg-red-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min((pedido.tiempoTranscurrido / pedido.tiempoEstimado) * 100, 100)}%` 
                    }}
                  />
                </div>

                {/* Items del pedido */}
                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <FaListAlt className="mr-2" />
                    Items del pedido:
                  </h4>
                  {pedido.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.cantidad}x {item.nombre}</span>
                      </div>
                      {item.notas && (
                        <p className="text-sm text-gray-600 italic mt-1">
                          Nota: {item.notas}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-2">
                  {pedido.estado === 'pendiente' && (
                    <button
                      onClick={() => cambiarEstadoPedido(pedido.id, 'en_preparacion')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <FaFire className="mr-2" />
                      Iniciar
                    </button>
                  )}
                  {pedido.estado === 'en_preparacion' && (
                    <button
                      onClick={() => cambiarEstadoPedido(pedido.id, 'listo')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <FaCheck className="mr-2" />
                      Marcar Listo
                    </button>
                  )}
                  {pedido.estado === 'listo' && (
                    <button
                      onClick={() => cambiarEstadoPedido(pedido.id, 'entregado')}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <FaCheckDouble className="mr-2" />
                      Entregado
                    </button>
                  )}
                  <button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors">
                    <FaEye />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay pedidos */}
        {filtrarPedidos().length === 0 && (
          <div className="text-center py-12">
            <FaUtensils className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay pedidos en esta categoría
            </h3>
            <p className="text-gray-500">
              Los nuevos pedidos aparecerán aquí automáticamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}