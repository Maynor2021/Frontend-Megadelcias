import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; // cambia esto por tu URL real


// Mapeo actualizado de categorías
const categorias = {
  1: 'Desayunos',
  2: 'Almuerzos',
  3: 'Cenas',
  4: 'Bebidas',
  5: 'Postres',
  6: 'Snacks'

};

function VistaPlatos() {
  const [platos, setPlatos] = useState([]);

  useEffect(() => {
    const cargarPlatos = async () => {
      try {
        const response = await axios.get(`${API_URL}/Platos/getall`);
        setPlatos(response.data);
      } catch (error) {
        console.error('Error al cargar los platos:', error.message);
      }
    };

    cargarPlatos();
  }, []);


  const handleAgregar = () => {
    alert('Función Agregar aún no implementada');
  };

  const handleModificar = () => {
    alert('Función Modificar aún no implementada');
  };

  const handleEliminar = () => {
    alert('Función Eliminar aún no implementada');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">🍽️ Menú de Platos</h1>
        <div className="space-x-2">
          <button
            onClick={handleAgregar}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow"
          >
            Agregar
          </button>
          <button
            onClick={handleModificar}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow"
          >
            Modificar
          </button>
          <button
            onClick={handleEliminar}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platos.map((plato) => (
          <div
            key={plato.PlatoID}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-6 border"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{plato.NombrePlato}</h2>
            <p className="text-gray-600 mb-2">{plato.Descripcion}</p>
            <p className="text-lg font-bold text-indigo-600 mb-1">Lps {plato.Precio.toFixed(2)}</p>
            <p className="text-sm text-gray-700 mb-1">
              Categoría: <span className="font-medium">{categorias[plato.CategoriaID] || 'Sin categoría'}</span>
            </p>
            <p
              className={`text-sm font-semibold ${
                plato.Activo ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {plato.Activo ? '🟢 Disponible' : '🔴 No disponible'}

            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VistaPlatos;
