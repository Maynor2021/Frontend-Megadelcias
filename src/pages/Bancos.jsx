// src/pages/Bancos.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, FaPlus, FaEdit, FaUniversity, FaTimes, FaSave
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-megadelicias.png';

export default function Bancos() {
  const navigate = useNavigate();
  
  // Estados básicos
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  const [movimientos, setMovimientos] = useState([]);
  const [mostrarModalBanco, setMostrarModalBanco] = useState(false);
  const [editandoBanco, setEditandoBanco] = useState(null);
  const [nuevoBanco, setNuevoBanco] = useState({
    nombre: '',
    codigo: '',
    activo: true
  });

  // Bancos disponibles (ahora con estado para poder modificarlos)
  const [bancosDisponibles, setBancosDisponibles] = useState([
    { id: 1, nombre: 'Banco Nacional', codigo: 'BN', activo: true },
    { id: 2, nombre: 'Banco Popular', codigo: 'BP', activo: true },
    { id: 3, nombre: 'Banco de Costa Rica', codigo: 'BCR', activo: true }
  ]);

  // Datos de ejemplo
  const movimientosPorBanco = {
    1: [
      {
        id: 1,
        fecha: '2025-01-10',
        nombreAsiento: 'Depósito ventas del día',
        monto: 2500.00,
        tipo: 'deposito'
      },
      {
        id: 2,
        fecha: '2025-01-09',
        nombreAsiento: 'Pago proveedor',
        monto: -1200.00,
        tipo: 'retiro'
      }
    ],
    2: [
      {
        id: 3,
        fecha: '2025-01-07',
        nombreAsiento: 'Transferencia nómina',
        monto: -3200.00,
        tipo: 'retiro'
      }
    ]
  };

  // Cargar movimientos cuando se selecciona banco
  useEffect(() => {
    if (bancoSeleccionado) {
      const movimientosBanco = movimientosPorBanco[bancoSeleccionado] || [];
      setMovimientos(movimientosBanco);
    } else {
      setMovimientos([]);
    }
  }, [bancoSeleccionado]);

  const volverAContabilidad = () => {
    navigate('/contabilidad');
  };

  const abrirModalBanco = (banco = null) => {
    if (banco) {
      setEditandoBanco(banco.id);
      setNuevoBanco({
        nombre: banco.nombre,
        codigo: banco.codigo,
        activo: banco.activo
      });
    } else {
      setEditandoBanco(null);
      setNuevoBanco({
        nombre: '',
        codigo: '',
        activo: true
      });
    }
    setMostrarModalBanco(true);
  };

  const guardarBanco = () => {
    if (!nuevoBanco.nombre || !nuevoBanco.codigo) {
      alert('Nombre y código son obligatorios.');
      return;
    }

    if (editandoBanco) {
      // Editar banco existente
      setBancosDisponibles(bancosDisponibles.map(b => 
        b.id === editandoBanco ? { ...nuevoBanco, id: editandoBanco } : b
      ));
    } else {
      // Agregar nuevo banco
      const nuevoId = Math.max(...bancosDisponibles.map(b => b.id), 0) + 1;
      setBancosDisponibles([...bancosDisponibles, { ...nuevoBanco, id: nuevoId }]);
    }
    
    setMostrarModalBanco(false);
    alert('✅ Banco guardado exitosamente.');
  };

  const eliminarBanco = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este banco?')) {
      setBancosDisponibles(bancosDisponibles.filter(b => b.id !== id));
      if (bancoSeleccionado === id.toString()) {
        setBancoSeleccionado('');
        setMovimientos([]);
      }
      setMostrarModalBanco(false);
      alert('✅ Banco eliminado exitosamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={volverAContabilidad} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <FaArrowLeft />
              <span>Volver a Contabilidad</span>
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <img src={logo} alt="Logo Mega Delicias" className="w-32" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800">
            <FaUniversity className="inline mr-2 text-blue-600" />
            Gestión Bancaria
          </h1>
        </div>
      </div>

      {/* Selección de Banco con botones de gestión */}
      <div className="bg-white mx-6 mt-6 p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Seleccionar Banco</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => abrirModalBanco()}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
              title="Agregar nuevo banco"
            >
              <FaPlus size={12} />
              <span>Nuevo</span>
            </button>
            {bancoSeleccionado && (
              <button
                onClick={() => {
                  const banco = bancosDisponibles.find(b => b.id === parseInt(bancoSeleccionado));
                  abrirModalBanco(banco);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                title="Editar banco seleccionado"
              >
                <FaEdit size={12} />
                <span>Editar</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <select
              value={bancoSeleccionado}
              onChange={(e) => setBancoSeleccionado(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un banco...</option>
              {bancosDisponibles.filter(b => b.activo).map((banco) => (
                <option key={banco.id} value={banco.id}>
                  {banco.nombre} ({banco.codigo})
                </option>
              ))}
            </select>
          </div>
          {bancoSeleccionado && (
            <div className="text-sm text-gray-600">
              📊 {movimientos.length} movimientos
            </div>
          )}
        </div>
      </div>

      {/* Mostrar movimientos */}
      <div className="mx-6 mt-4 mb-6">
        {!bancoSeleccionado && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaUniversity className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">Selecciona un Banco</h3>
            <p className="text-gray-600">Elige un banco para ver sus movimientos.</p>
          </div>
        )}

        {bancoSeleccionado && movimientos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-bold">Movimientos Bancarios</h3>
              <p className="text-gray-600">{movimientos.length} movimientos encontrados</p>
            </div>
            <div className="p-4">
              {movimientos.map((mov) => (
                <div key={mov.id} className="p-3 border rounded mb-2 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{mov.nombreAsiento}</span>
                      <span className="text-gray-500 ml-2">({mov.fecha})</span>
                    </div>
                    <span className={`font-bold ${mov.monto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(mov.monto).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {bancoSeleccionado && movimientos.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-bold text-gray-700 mb-2">No hay movimientos</h3>
            <p className="text-gray-600">Este banco no tiene movimientos registrados.</p>
          </div>
        )}
      </div>

      {/* Modal para Gestión de Bancos */}
      {mostrarModalBanco && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editandoBanco ? 'Editar Banco' : 'Nuevo Banco'}
                </h2>
                <button
                  onClick={() => setMostrarModalBanco(false)}
                  className="text-white hover:text-gray-300"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Banco *
                  </label>
                  <input
                    type="text"
                    value={nuevoBanco.nombre}
                    onChange={(e) => setNuevoBanco({ ...nuevoBanco, nombre: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Banco Nacional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código del Banco *
                  </label>
                  <input
                    type="text"
                    value={nuevoBanco.codigo}
                    onChange={(e) => setNuevoBanco({ ...nuevoBanco, codigo: e.target.value.toUpperCase() })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: BN"
                    maxLength="5"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={nuevoBanco.activo}
                      onChange={(e) => setNuevoBanco({ ...nuevoBanco, activo: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Banco activo</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setMostrarModalBanco(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                {editandoBanco && (
                  <button
                    onClick={() => eliminarBanco(editandoBanco)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Eliminar
                  </button>
                )}
                <button
                  onClick={guardarBanco}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <FaSave />
                  <span>{editandoBanco ? 'Actualizar' : 'Guardar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}