import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

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

  const cargarPlatos = async () => {
    try {
      const response = await axios.get(`${API_URL}/Platos/getall`);
      setPlatos(response.data);
    } catch (error) {
      console.error('Error al cargar los platos:', error.message);
    }
  };

  useEffect(() => {
    cargarPlatos();
  }, []);

  const AgregarPlato = async () => {
    const nombre = prompt('Nombre del plato:');
    const descripcion = prompt('Descripción del plato:');
    const precio = parseFloat(prompt('Precio del plato:'));
    const categoriaID = parseInt(prompt('ID de categoría (1-6):'));
    

    if (!nombre || !descripcion || isNaN(precio) || isNaN(categoriaID)) {
      alert('Datos inválidos');
      return;
    }

    try {
      await axios.post(`${API_URL}/Platos/create`, {
        NombrePlato: nombre,
        Descripcion: descripcion,
        Precio: precio,
        CategoriaID: categoriaID,
        
      });
      alert('Plato agregado con éxito');
      cargarPlatos();
    } catch (error) {
      console.error('Error al agregar plato:', error.message);
    }
  };

  const ModificarPlato = async () => {
    const id = parseInt(prompt('ID del plato a modificar:'));
    const plato = platos.find(p => p.PlatoID === id);
    if (!plato) {
      alert('Plato no encontrado');
      return;
    }

    const nombre = prompt('Nuevo nombre:', plato.NombrePlato);
    const descripcion = prompt('Nueva descripción:', plato.Descripcion);
    const precio = parseFloat(prompt('Nuevo precio:', plato.Precio));
    const categoriaID = parseInt(prompt('Nueva categoría (1-6):', plato.CategoriaID));
    

    try {
      await axios.put(`${API_URL}/Platos/actualizarplato/${id}`, {
        NombrePlato: nombre,
        Descripcion: descripcion,
        Precio: precio,
        CategoriaID: categoriaID,
        
      });
      alert('Plato modificado con éxito');
      cargarPlatos();
    } catch (error) {
      console.error('Error al modificar plato:', error.message);
    }
  };

  const EliminarPlato = async () => {
    const id = parseInt(prompt('ID del plato a eliminar:'));
    if (isNaN(id)) return;

    const confirmacion = window.confirm('¿Estás seguro de eliminar este plato?');
    if (!confirmacion) return;

    try {
      await axios.delete(`${API_URL}/Platos/eliminarplato/${id}`);
      alert('Plato eliminado con éxito');
      cargarPlatos();
    } catch (error) {
      console.error('Error al eliminar plato:', error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="sticky top-0 z-50 bg-white flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 py-3 shadow">
  <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">🍽️ Menú de Platos</h1>
  <div className="space-x-2">
    <button
      onClick={AgregarPlato}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow"
    >
      Agregar
    </button>
  </div>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platos.map((plato) => (
          <div
            key={plato.PlatoID}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-6 border"
          >
            <p className="text-sm text-gray-500 mb-1">ID: {plato.PlatoID}</p>
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
            <div className="flex space-x-4">
             <div>
              <img
                src="https://via.placeholder.com/300"
                alt="Descripción de la imagen"
                className="w-full h-auto rounded-md shadow"
  />
              
              </div> 
  <button
    onClick={ModificarPlato}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow"
  >
    Modificar
  </button>
  <button
    onClick={EliminarPlato}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
  >
    Eliminar
  </button>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VistaPlatos;
