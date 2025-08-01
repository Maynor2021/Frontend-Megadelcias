import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; // cambia esto por tu URL real

const categorias = {
  1: 'Entradas',
  2: 'Platos Fuertes',
  3: 'Bebidas',
  4: 'Postres'
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Menú de Platos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platos.map(plato => (
          <div key={plato.PlatoID} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{plato.NombrePlato}</h2>
            <p className="text-gray-600">{plato.Descripcion}</p>
            <p className="mt-2 font-bold">Lps {plato.Precio}</p>
            <p className="text-sm text-gray-700">Categoría: {categorias[plato.CategoriaID] || 'Sin categoría'}</p>
            <p className={`text-sm mt-1 ${plato.Activo ? 'text-green-600' : 'text-red-600'}`}>
              {plato.Activo ? 'Disponible' : 'No disponible'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VistaPlatos;
