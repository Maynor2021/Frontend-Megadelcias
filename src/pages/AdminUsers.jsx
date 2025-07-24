// src/pages/AdminUsers.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    rol: '',
  });

  const obtenerUsuarios = async () => {
    const res = await axios.get('/api/usuarios');
    setUsuarios(res.data);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const abrirModal = (usuario = null) => {
    if (usuario) {
      setEditandoUsuario(usuario);
      setForm({
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      });
    } else {
      setEditandoUsuario(null);
      setForm({ nombre: '', correo: '', rol: '' });
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditandoUsuario(null);
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    if (editandoUsuario) {
      await axios.put(`/api/usuarios/${editandoUsuario.id}`, form);
    } else {
      await axios.post('/api/usuarios', form);
    }
    cerrarModal();
    obtenerUsuarios();
  };

  const eliminarUsuario = async (id) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      await axios.delete(`/api/usuarios/${id}`);
      obtenerUsuarios();
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    (u.nombre + u.correo).toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1">Gestión de Usuarios</h2>
      <p className="text-gray-600 mb-4">
        Visualiza, filtra y administra los usuarios registrados en el sistema.
      </p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          className="border px-3 py-2 rounded w-1/3"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <button
          onClick={() => abrirModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Agregar Usuario
        </button>
      </div>

      <div className="overflow-x-auto rounded shadow border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.nombre}</td>
                <td className="px-4 py-2">{u.correo}</td>
                <td className="px-4 py-2">{u.rol}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => abrirModal(u)}
                  >
                    Editar
                  </button>
                  <span>|</span>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => eliminarUsuario(u.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">
              {editandoUsuario ? 'Editar Usuario' : 'Agregar Usuario'}
            </h3>
            <form onSubmit={guardarUsuario} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Correo"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Seleccione un rol</option>
                <option value="admin">Admin</option>
                <option value="cajero">Cajero</option>
                <option value="caja">Caja</option>
                <option value="mesero">Mesero</option>
                <option value="cocinero">Cocinero</option>
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
