import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MeseroPanel() {
  const [platos, setPlatos] = useState([]);
  const [orden, setOrden] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState([]);

  const API = 'http://localhost:4000';

  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchPlatos = async () => {
    try {
      const res = await axios.get(`${API}/api/mesero/platos`, { headers });
      setPlatos(res.data);
    } catch (err) {
      console.error('Error al cargar platos', err);
    }
  };

  const fetchHistorial = async () => {
    try {
      const res = await axios.get(`${API}/api/mesero/ordenes`, { headers });
      setHistorial(res.data);
    } catch (err) {
      console.error('Error al cargar historial', err);
    }
  };

  const agregarAOrden = (plato) => {
    const existente = orden.find((item) => item.plato_id === plato.id);
    if (existente) {
      setOrden(
        orden.map((item) =>
          item.plato_id === plato.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setOrden([...orden, { plato_id: plato.id, cantidad: 1 }]);
    }
  };

  const enviarOrden = async () => {
    if (orden.length === 0) {
      setMensaje('❌ La orden está vacía.');
      return;
    }

    try {
      await axios.post(
        `${API}/api/mesero/ordenes`,
        { detalles: orden },
        { headers }
      );
      setMensaje('✅ Orden enviada correctamente');
      setOrden([]);
      fetchHistorial();
    } catch (err) {
      console.error('Error al enviar orden', err);
      setMensaje('❌ Error al enviar la orden');
    }
  };

  useEffect(() => {
    fetchPlatos();
    fetchHistorial();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🧾 Panel de Mesero</h1>

      {mensaje && (
        <div className={`mb-4 text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">🍽️ Platos Disponibles</h2>
          <ul className="space-y-2">
            {platos.map((plato) => (
              <li key={plato.id} className="flex justify-between bg-white shadow p-3 rounded">
                <span>{plato.nombre}</span>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => agregarAOrden(plato)}
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">🧾 Orden Actual</h2>
          {orden.length === 0 ? (
            <p className="text-gray-500">Aún no has agregado platos.</p>
          ) : (
            <ul className="space-y-2">
              {orden.map((item) => {
                const plato = platos.find((p) => p.id === item.plato_id);
                return (
                  <li key={item.plato_id} className="bg-white shadow p-3 rounded">
                    {plato?.nombre} x {item.cantidad}
                  </li>
                );
              })}
            </ul>
          )}
          <button
            onClick={enviarOrden}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Enviar Orden
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">📋 Historial de Órdenes</h2>
        {historial.length === 0 ? (
          <p className="text-gray-500">No hay órdenes registradas.</p>
        ) : (
          <ul className="space-y-3">
            {historial.map((orden) => (
              <li key={orden.id} className="border p-3 rounded">
                <p className="font-medium">🕐 {new Date(orden.fecha).toLocaleString()}</p>
                <p>📦 Estado: {orden.estado}</p>
                <p>🍽️ Platos: {orden.platos}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
