import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CajaPanel() {
  const [movimientos, setMovimientos] = useState([]);
  const [totalVenta, setTotalVenta] = useState('');
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:4000';

  const obtenerMovimientos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/caja/movimientos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovimientos(res.data);
    } catch (error) {
      console.error('Error al cargar movimientos:', error);
    }
  };

  const registrarVenta = async () => {
    if (!totalVenta || parseFloat(totalVenta) <= 0) {
      setMensaje('❌ Ingrese un monto válido');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).id;

      const detallesDummy = [
        {
          plato_id: 1,
          cantidad: 1,
          precio_unitario: parseFloat(totalVenta),
        },
      ];

      await axios.post(
        `${API_BASE}/api/caja/venta`,
        {
          total: parseFloat(totalVenta),
          metodo_pago: metodoPago,
          usuario_id: userId,
          descripcion, // ✅ ahora sí se envía al backend
          detalles: detallesDummy,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje('✅ Venta registrada correctamente');
      setTotalVenta('');
      setDescripcion('');
      obtenerMovimientos();
    } catch (error) {
      console.error('Error al registrar venta:', error);
      setMensaje('❌ Error al registrar venta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMovimientos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">💰 Módulo de Caja</h1>

      <div className="bg-white p-6 rounded shadow mb-8 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Registrar Venta</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Total:</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full p-2 border rounded"
            value={totalVenta}
            onChange={(e) => setTotalVenta(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Método de Pago:</label>
          <select
            className="w-full p-2 border rounded"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Descripción:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <button
          onClick={registrarVenta}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Registrando...' : 'Registrar Venta'}
        </button>

        {mensaje && (
          <div className={`mt-4 text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">📋 Movimientos de Caja</h2>
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Monto</th>
              <th className="p-2 border">Descripción</th>
              <th className="p-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No hay movimientos registrados.
                </td>
              </tr>
            ) : (
              movimientos.map((mov) => (
                <tr key={mov.id} className="border-b">
                  <td className="p-2 border">{mov.id}</td>
                  <td className="p-2 border">{mov.tipo}</td>
                  <td className="p-2 border">
  ${typeof mov.monto === 'number' ? mov.monto.toFixed(2) : parseFloat(mov.monto || 0).toFixed(2)}
</td>
                  <td className="p-2 border">{mov.descripcion}</td>
                  <td className="p-2 border">{new Date(mov.fecha).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
