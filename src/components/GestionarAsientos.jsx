// src/components/GestionarAsientos.jsx
import React, { useState } from 'react';
import { FaTimes, FaPlus, FaEdit, FaTrash, FaSave, FaEye } from 'react-icons/fa';

export default function GestionarAsientos({ bancoId, movimientos, onClose, onUpdateMovimientos }) {
  const [editandoAsiento, setEditandoAsiento] = useState(null);
  const [nuevoAsiento, setNuevoAsiento] = useState({
    fecha: new Date().toISOString().split('T')[0],
    nombreAsiento: '',
    monto: 0,
    tipo: 'deposito',
    asientoContable: {
      debe: [{ cuenta: '1100', concepto: 'Banco', monto: 0 }],
      haber: [{ cuenta: '4000', concepto: 'Ventas', monto: 0 }]
    }
  });

  const cuentasDisponibles = [
    { codigo: '1100', nombre: 'Banco' },
    { codigo: '1200', nombre: 'Caja General' },
    { codigo: '1300', nombre: 'Otros Bancos' },
    { codigo: '2100', nombre: 'Cuentas por Pagar' },
    { codigo: '2200', nombre: 'Préstamos' },
    { codigo: '4000', nombre: 'Ventas' },
    { codigo: '5000', nombre: 'Gastos' },
    { codigo: '5100', nombre: 'Gastos de Personal' },
    { codigo: '5200', nombre: 'Gastos Administrativos' },
    { codigo: '5300', nombre: 'Gastos de Operación' }
  ];

  const abrirModalAsiento = (asiento = null) => {
    if (asiento) {
      setEditandoAsiento(asiento.id);
      setNuevoAsiento({
        fecha: asiento.fecha,
        nombreAsiento: asiento.nombreAsiento,
        monto: asiento.monto,
        tipo: asiento.tipo,
        asientoContable: { ...asiento.asientoContable }
      });
    } else {
      setEditandoAsiento(null);
      setNuevoAsiento({
        fecha: new Date().toISOString().split('T')[0],
        nombreAsiento: '',
        monto: 0,
        tipo: 'deposito',
        asientoContable: {
          debe: [{ cuenta: '1100', concepto: 'Banco', monto: 0 }],
          haber: [{ cuenta: '4000', concepto: 'Ventas', monto: 0 }]
        }
      });
    }
  };

  const agregarFilaDebe = () => {
    setNuevoAsiento({
      ...nuevoAsiento,
      asientoContable: {
        ...nuevoAsiento.asientoContable,
        debe: [...nuevoAsiento.asientoContable.debe, { cuenta: '1100', concepto: '', monto: 0 }]
      }
    });
  };

  const agregarFilaHaber = () => {
    setNuevoAsiento({
      ...nuevoAsiento,
      asientoContable: {
        ...nuevoAsiento.asientoContable,
        haber: [...nuevoAsiento.asientoContable.haber, { cuenta: '4000', concepto: '', monto: 0 }]
      }
    });
  };

  const actualizarFilaDebe = (index, campo, valor) => {
    const nuevasFilas = [...nuevoAsiento.asientoContable.debe];
    nuevasFilas[index] = { ...nuevasFilas[index], [campo]: valor };
    setNuevoAsiento({
      ...nuevoAsiento,
      asientoContable: { ...nuevoAsiento.asientoContable, debe: nuevasFilas }
    });
  };

  const actualizarFilaHaber = (index, campo, valor) => {
    const nuevasFilas = [...nuevoAsiento.asientoContable.haber];
    nuevasFilas[index] = { ...nuevasFilas[index], [campo]: valor };
    setNuevoAsiento({
      ...nuevoAsiento,
      asientoContable: { ...nuevoAsiento.asientoContable, haber: nuevasFilas }
    });
  };

  const eliminarFilaDebe = (index) => {
    if (nuevoAsiento.asientoContable.debe.length > 1) {
      const nuevasFilas = nuevoAsiento.asientoContable.debe.filter((_, i) => i !== index);
      setNuevoAsiento({
        ...nuevoAsiento,
        asientoContable: { ...nuevoAsiento.asientoContable, debe: nuevasFilas }
      });
    }
  };

  const eliminarFilaHaber = (index) => {
    if (nuevoAsiento.asientoContable.haber.length > 1) {
      const nuevasFilas = nuevoAsiento.asientoContable.haber.filter((_, i) => i !== index);
      setNuevoAsiento({
        ...nuevoAsiento,
        asientoContable: { ...nuevoAsiento.asientoContable, haber: nuevasFilas }
      });
    }
  };

  const validarAsiento = () => {
    const totalDebe = nuevoAsiento.asientoContable.debe.reduce((sum, fila) => sum + (parseFloat(fila.monto) || 0), 0);
    const totalHaber = nuevoAsiento.asientoContable.haber.reduce((sum, fila) => sum + (parseFloat(fila.monto) || 0), 0);
    
    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      alert('❌ El asiento debe estar balanceado. Total Debe: $' + totalDebe.toFixed(2) + ', Total Haber: $' + totalHaber.toFixed(2));
      return false;
    }
    
    if (!nuevoAsiento.nombreAsiento) {
      alert('❌ El nombre del asiento es obligatorio.');
      return false;
    }
    
    return true;
  };

  const guardarAsiento = () => {
    if (!validarAsiento()) return;

    const totalDebe = nuevoAsiento.asientoContable.debe.reduce((sum, fila) => sum + (parseFloat(fila.monto) || 0), 0);
    const totalHaber = nuevoAsiento.asientoContable.haber.reduce((sum, fila) => sum + (parseFloat(fila.monto) || 0), 0);
    
    // Determinar el monto del banco (diferencia entre debe y haber)
    const montoBanco = totalDebe - totalHaber;
    
    if (editandoAsiento) {
      // Editar asiento existente
      const asientosActualizados = movimientos.map(m => 
        m.id === editandoAsiento ? {
          ...m,
          fecha: nuevoAsiento.fecha,
          nombreAsiento: nuevoAsiento.nombreAsiento,
          monto: montoBanco,
          tipo: montoBanco >= 0 ? 'deposito' : 'retiro',
          asientoContable: { ...nuevoAsiento.asientoContable }
        } : m
      );
      onUpdateMovimientos(asientosActualizados);
    } else {
      // Agregar nuevo asiento
      const nuevoId = Math.max(...movimientos.map(m => m.id), 0) + 1;
      const nuevoMovimiento = {
        id: nuevoId,
        fecha: nuevoAsiento.fecha,
        nombreAsiento: nuevoAsiento.nombreAsiento,
        monto: montoBanco,
        tipo: montoBanco >= 0 ? 'deposito' : 'retiro',
        asientoContable: { ...nuevoAsiento.asientoContable }
      };
      onUpdateMovimientos([...movimientos, nuevoMovimiento]);
    }
    setEditandoAsiento(null);
    alert('✅ Asiento guardado exitosamente.');
  };

  const eliminarAsiento = () => {
    if (window.confirm('¿Estás seguro de eliminar este asiento?')) {
      onUpdateMovimientos(movimientos.filter(m => m.id !== editandoAsiento));
      setEditandoAsiento(null);
      alert('✅ Asiento eliminado exitosamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <FaEdit className="mr-2" />
              Gestionar Asientos
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Asiento a Editar</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha del Asiento
                  </label>
                  <input
                    type="date"
                    value={nuevoAsiento.fecha}
                    onChange={(e) => setNuevoAsiento({ ...nuevoAsiento, fecha: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Asiento
                  </label>
                  <input
                    type="text"
                    value={nuevoAsiento.nombreAsiento}
                    onChange={(e) => setNuevoAsiento({ ...nuevoAsiento, nombreAsiento: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Ej: Depósito ventas del día"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto del Asiento
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevoAsiento.monto}
                    onChange={(e) => setNuevoAsiento({ ...nuevoAsiento, monto: parseFloat(e.target.value) || 0 })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Movimiento
                </label>
                <select
                  value={nuevoAsiento.tipo}
                  onChange={(e) => setNuevoAsiento({ ...nuevoAsiento, tipo: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="deposito">Depósito</option>
                  <option value="retiro">Retiro</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuenta de Debe
                </label>
                <select
                  value={nuevoAsiento.asientoContable.debe[0]?.cuenta}
                  onChange={(e) => actualizarFilaDebe(0, 'cuenta', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {cuentasDisponibles.map(cuenta => (
                    <option key={cuenta.codigo} value={cuenta.codigo}>{cuenta.codigo} - {cuenta.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuenta de Haber
                </label>
                <select
                  value={nuevoAsiento.asientoContable.haber[0]?.cuenta}
                  onChange={(e) => actualizarFilaHaber(0, 'cuenta', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {cuentasDisponibles.map(cuenta => (
                    <option key={cuenta.codigo} value={cuenta.codigo}>{cuenta.codigo} - {cuenta.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concepto de Debe
                  </label>
                  <input
                    type="text"
                    value={nuevoAsiento.asientoContable.debe[0]?.concepto}
                    onChange={(e) => actualizarFilaDebe(0, 'concepto', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Ej: Ventas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concepto de Haber
                  </label>
                  <input
                    type="text"
                    value={nuevoAsiento.asientoContable.haber[0]?.concepto}
                    onChange={(e) => actualizarFilaHaber(0, 'concepto', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Ej: Banco"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto de Debe
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevoAsiento.asientoContable.debe[0]?.monto}
                    onChange={(e) => actualizarFilaDebe(0, 'monto', parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto de Haber
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevoAsiento.asientoContable.haber[0]?.monto}
                    onChange={(e) => actualizarFilaHaber(0, 'monto', parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                {editandoAsiento && (
                  <button
                    onClick={eliminarAsiento}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Eliminar
                  </button>
                )}
                <button
                  onClick={guardarAsiento}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <FaSave />
                  <span>{editandoAsiento ? 'Actualizar' : 'Guardar'} Asiento</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Movimientos Asociados</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 font-semibold text-sm">
                <div>Fecha</div>
                <div>Concepto</div>
                <div>Monto</div>
                <div>Acciones</div>
              </div>
              {movimientos.map((mov) => (
                <div key={mov.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 py-2 border-b border-gray-200">
                  <div className="text-sm">{mov.fecha}</div>
                  <div className="text-sm">{mov.nombreAsiento}</div>
                  <div className={`text-sm font-medium ${mov.monto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(mov.monto).toFixed(2)}
                  </div>
                  <div>
                    <button
                      onClick={() => abrirModalAsiento(mov)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Editar"
                    >
                      <FaEdit size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 