// src/pages/LibroDiario.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave,
  FaTimes,
  FaBook,
  FaSearch,
  FaFilter,
  FaFileExport,
  FaCalendarAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-megadelicias.png';
import axios from 'axios';

export default function LibroDiario() {
  const navigate = useNavigate();
  const API_URL = 'http://localhost:4000/api';
  
  // Estados para el manejo de datos
  const [asientos, setAsientos] = useState([]);
  const [cuentasContables, setCuentasContables] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [asientoEditando, setAsientoEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    concepto: '',
    cuenta: ''
  });

  // Estado para el formulario de nuevo asiento
  const [nuevoAsiento, setNuevoAsiento] = useState({
    tipoAsiento: 'Manual',
    concepto: '',
    fecha: new Date().toISOString().split('T')[0],
    detalles: [
      { cuentaID: '', debe: '', haber: '', descripcion: '' },
      { cuentaID: '', debe: '', haber: '', descripcion: '' }
    ]
  });

  // Cargar cuentas contables al inicializar
  useEffect(() => {
    cargarCuentasContables();
    cargarAsientos();
  }, []);

  // Cargar cuentas contables desde el backend
  const cargarCuentasContables = async () => {
    try {
      const response = await axios.get(`${API_URL}/contabilidad/cuentas`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCuentasContables(response.data.data);
    } catch (error) {
      console.error('Error al cargar cuentas:', error);
      setError('Error al cargar las cuentas contables');
    }
  };

  // Cargar asientos (libro diario)
  const cargarAsientos = async () => {
    setLoading(true);
    try {
      // Primero cargar el libro diario con fechas amplias
      const fechaInicio = filtros.fechaInicio || '2025-01-01';
      const fechaFin = filtros.fechaFin || new Date().toISOString().split('T')[0];
      
      const response = await axios.get(`${API_URL}/contabilidad/libro-diario`, {
        params: { fechaInicio, fechaFin },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }); 

      // Agrupar por asiento
      const asientosAgrupados = {};
      response.data.data.forEach(detalle => {
        if (!asientosAgrupados[detalle.AsientoID]) {
          asientosAgrupados[detalle.AsientoID] = {
            id: detalle.AsientoID,
            numero: detalle.NumeroAsiento,
            fecha: detalle.FechaAsiento.split('T')[0],
            concepto: detalle.DescripcionAsiento,
            tipo: detalle.TipoAsiento,
            estado: detalle.Estado,
            registradoPor: detalle.RegistradoPor,
            movimientos: []
          };
        }
        asientosAgrupados[detalle.AsientoID].movimientos.push({
          cuentaID: detalle.CuentaID,
          codigoCuenta: detalle.CodigoCuenta,
          nombreCuenta: detalle.NombreCuenta,
          debe: detalle.Debe,
          haber: detalle.Haber,
          descripcion: detalle.DetalleDescripcion || ''
        });
      });

      setAsientos(Object.values(asientosAgrupados));
    } catch (error) {
      console.error('Error al cargar asientos:', error);
      setError('Error al cargar los asientos contables');
    } finally {
      setLoading(false);
    }
  };

  const volverAContabilidad = () => {
    navigate('/contabilidad');
  };

  const abrirFormularioNuevo = () => {
    setAsientoEditando(null);
    setNuevoAsiento({
      tipoAsiento: 'Manual',
      concepto: '',
      fecha: new Date().toISOString().split('T')[0],
      detalles: [
        { cuentaID: '', debe: '', haber: '', descripcion: '' },
        { cuentaID: '', debe: '', haber: '', descripcion: '' }
      ]
    });
    setMostrarFormulario(true);
  };

  const editarAsiento = async (asiento) => {
  try {
    const response = await axios.get(`${API_URL}/contabilidad/asientos/${asiento.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const asientoCompleto = response.data.data;
    setAsientoEditando(asiento.id);
    setNuevoAsiento({
      tipoAsiento: asientoCompleto.TipoAsiento,
      concepto: asientoCompleto.Descripcion,
      fecha: asientoCompleto.FechaAsiento ? asientoCompleto.FechaAsiento.split('T')[0] : new Date().toISOString().split('T')[0],
      detalles: asientoCompleto.detalles.map(d => ({
        cuentaID: d.CuentaID.toString(), // Convertir a string
        debe: d.Debe.toString(), // Convertir a string
        haber: d.Haber.toString(), // Convertir a string
        descripcion: d.Descripcion || ''
      }))
    });
    setMostrarFormulario(true);
  } catch (error) {
    console.error('Error al cargar asiento:', error);
    alert('Error al cargar los detalles del asiento');
  }
};

  const eliminarAsiento = async (id) => {
    if (window.confirm('¿Estás seguro de anular este asiento?')) {
      try {
        await axios.delete(`${API_URL}/contabilidad/asientos/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        alert('Asiento anulado exitosamente');
        cargarAsientos();
      } catch (error) {
        console.error('Error al anular asiento:', error);
        alert(error.response?.data?.message || 'Error al anular el asiento');
      }
    }
  };

const agregarMovimiento = () => {
  setNuevoAsiento({
    ...nuevoAsiento,
    detalles: [...nuevoAsiento.detalles, { cuentaID: '', debe: '', haber: '', descripcion: '' }]
  });
};

  const eliminarMovimiento = (index) => {
    if (nuevoAsiento.detalles.length > 2) {
      const nuevosDetalles = nuevoAsiento.detalles.filter((_, i) => i !== index);
      setNuevoAsiento({ ...nuevoAsiento, detalles: nuevosDetalles });
    }
  };

  const actualizarMovimiento = (index, campo, valor) => {
    console.log('Actualizando:', index, campo, valor); // Debug
    const nuevosDetalles = [...nuevoAsiento.detalles];
    nuevosDetalles[index] = {
      ...nuevosDetalles[index],
      [campo]: valor
    };
    
    // Si se ingresa un valor en debe, limpiar haber y viceversa
    if (campo === 'debe' && valor && valor !== '0' && valor !== '0.') {
      nuevosDetalles[index].haber = '';
    } else if (campo === 'haber' && valor && valor !== '0' && valor !== '0.') {
      nuevosDetalles[index].debe = '';
    }
    
    setNuevoAsiento({
      ...nuevoAsiento,
      detalles: nuevosDetalles
    });
  };


  const validarAsiento = () => {
    const totalDebe = nuevoAsiento.detalles.reduce((sum, mov) => sum + parseFloat(mov.debe || 0), 0);
    const totalHaber = nuevoAsiento.detalles.reduce((sum, mov) => sum + parseFloat(mov.haber || 0), 0);
    
    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      alert('El asiento no está balanceado. La suma del Debe debe ser igual a la suma del Haber.');
      return false;
    }

    if (!nuevoAsiento.concepto.trim()) {
      alert('El concepto es obligatorio.');
      return false;
    }

    if (nuevoAsiento.detalles.some(mov => !mov.cuentaID)) {
      alert('Todas las cuentas deben estar seleccionadas.');
      return false;
    }

    return true;
  };

const guardarAsiento = async () => {
  if (!validarAsiento()) return;

  try {
    const datosAsiento = {
      ...(asientoEditando ? {} : { tipoAsiento: nuevoAsiento.tipoAsiento }),
      ...(asientoEditando ? { descripcion: nuevoAsiento.concepto } : { concepto: nuevoAsiento.concepto }),
      fecha: nuevoAsiento.fecha,
      detalles: nuevoAsiento.detalles.map(d => ({
        cuentaID: parseInt(d.cuentaID) || 0,
        debe: parseFloat(d.debe || '0') || 0,
        haber: parseFloat(d.haber || '0') || 0,
        descripcion: d.descripcion || ''
      }))
    };

    if (asientoEditando) {
      await axios.put(`${API_URL}/contabilidad/asientos/${asientoEditando}`, 
        datosAsiento,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert('Asiento actualizado exitosamente');
    } else {
      await axios.post(`${API_URL}/contabilidad/asientos`, 
        datosAsiento,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert('Asiento creado exitosamente');
    }
    
    cerrarFormulario();
    cargarAsientos();
  } catch (error) {
    console.error('Error al guardar asiento:', error);
    alert(error.response?.data?.message || 'Error al guardar el asiento');
  }
};

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setAsientoEditando(null);
  };

const calcularTotales = (movimientos) => {
  const totalDebe = movimientos.reduce((sum, mov) => sum + (parseFloat(mov.debe || '0') || 0), 0);
  const totalHaber = movimientos.reduce((sum, mov) => sum + (parseFloat(mov.haber || '0') || 0), 0);
  return { totalDebe, totalHaber };
};

  // Filtrar asientos localmente
  const asientosFiltrados = asientos.filter(asiento => {
    const cumpleFecha = (!filtros.fechaInicio || asiento.fecha >= filtros.fechaInicio) &&
                       (!filtros.fechaFin || asiento.fecha <= filtros.fechaFin);
    const cumpleConcepto = !filtros.concepto || 
                          asiento.concepto.toLowerCase().includes(filtros.concepto.toLowerCase());
    const cumpleCuenta = !filtros.cuenta || 
                        asiento.movimientos.some(mov => 
                          mov.nombreCuenta.toLowerCase().includes(filtros.cuenta.toLowerCase()) ||
                          mov.codigoCuenta.includes(filtros.cuenta));
    
    return cumpleFecha && cumpleConcepto && cumpleCuenta;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando asientos contables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={volverAContabilidad}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
            >
              <FaArrowLeft />
              <span>Volver a Contabilidad</span>
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <img src={logo} alt="Logo Mega Delicias" className="w-32" />
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              <FaBook className="inline mr-2 text-blue-600" />
              Libro Diario
            </h1>
            <button
              onClick={abrirFormularioNuevo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
            >
              <FaPlus />
              <span>Nuevo Asiento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mostrar errores */}
      {error && (
        <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white mx-6 mt-6 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <FaFilter className="mr-2" />
          Filtros de Búsqueda
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
            <input
              type="text"
              placeholder="Buscar por concepto..."
              value={filtros.concepto}
              onChange={(e) => setFiltros({ ...filtros, concepto: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta</label>
            <input
              type="text"
              placeholder="Buscar por cuenta..."
              value={filtros.cuenta}
              onChange={(e) => setFiltros({ ...filtros, cuenta: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={cargarAsientos}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FaSearch />
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {/* Lista de Asientos */}
      <div className="mx-6 mt-6 space-y-4">
        {asientosFiltrados.map((asiento) => {
          const { totalDebe, totalHaber } = calcularTotales(asiento.movimientos);
          
          return (
            <div key={asiento.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Encabezado del asiento */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                     <span className="font-bold text-blue-600">{asiento.AsientoID}</span>
                    <span className="font-bold text-blue-600">{asiento.numero}</span>
                    <span className="text-gray-600">{asiento.fecha}</span>
                    <span className="font-medium">{asiento.concepto}</span>
                    {asiento.estado === 'Anulado' && (
                      <span className="text-red-600 font-bold">(ANULADO)</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Total: ${totalDebe.toFixed(2)}
                    </span>
                    {asiento.estado !== 'Anulado' && (
                      <>
                        <button
                          onClick={() => editarAsiento(asiento)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => eliminarAsiento(asiento.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Anular"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Movimientos del asiento */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm font-medium text-gray-500 border-b">
                        <th className="pb-2">Cuenta</th>
                        <th className="pb-2 text-right">Debe</th>
                        <th className="pb-2 text-right">Haber</th>
                        <th className="pb-2">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asiento.movimientos.map((mov, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="py-2 font-medium">
                            {mov.codigoCuenta} - {mov.nombreCuenta}
                          </td>
                          <td className="py-2 text-right text-green-600 font-medium">
                            {mov.debe > 0 && `$${parseFloat(mov.debe).toFixed(2)}`}
                          </td>
                          <td className="py-2 text-right text-red-600 font-medium">
                            {mov.haber > 0 && `$${parseFloat(mov.haber).toFixed(2)}`}
                          </td>
                          <td className="py-2 text-gray-600">{mov.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold text-gray-800 border-t-2">
                        <td className="pt-2">TOTALES:</td>
                        <td className="pt-2 text-right text-green-600">
                          ${totalDebe.toFixed(2)}
                        </td>
                        <td className="pt-2 text-right text-red-600">
                          ${totalHaber.toFixed(2)}
                        </td>
                        <td className="pt-2"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          );
        })}

        {asientosFiltrados.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaBook className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600">No se encontraron asientos contables.</p>
            <button
              onClick={abrirFormularioNuevo}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Crear primer asiento
            </button>
          </div>
        )}
      </div>

      {/* Modal del formulario */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Header del modal */}
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {asientoEditando ? 'Editar Asiento' : 'Nuevo Asiento Contable'}
                </h2>
                <button
                  onClick={cerrarFormulario}
                  className="text-white hover:text-gray-300"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Asiento
                  </label>
                  <select
                    value={nuevoAsiento.tipoAsiento}
                    onChange={(e) => setNuevoAsiento({ ...nuevoAsiento, tipoAsiento: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    disabled={asientoEditando}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Ajuste">Ajuste</option>
                    <option value="Cierre">Cierre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha del Asiento *
                  </label>
                  <input
                    type="date"
                    value={nuevoAsiento.fecha}
                    onChange={(e) => setNuevoAsiento({ ...nuevoAsiento, fecha: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <input
                    type="text"
                    value={`${calcularTotales(nuevoAsiento.detalles).totalDebe.toFixed(2)}`}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Concepto / Descripción *
                </label>
                <textarea
                  value={nuevoAsiento.concepto}
                  onChange={(e) => setNuevoAsiento({ ...nuevoAsiento, concepto: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Descripción del asiento contable..."
                />
              </div>

              {/* Tabla de movimientos */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Movimientos Contables</h3>
                  <button
                    onClick={agregarMovimiento}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Agregar Línea</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Cuenta</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">Debe</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">Haber</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Descripción</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nuevoAsiento.detalles.map((mov, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-3">
                            <select
                              value={mov.cuentaID}
                              onChange={(e) => actualizarMovimiento(index, 'cuentaID', e.target.value)}
                              className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Seleccionar cuenta...</option>
                              {cuentasContables.map((cuenta) => (
                                <option key={cuenta.CuentaID} value={cuenta.CuentaID}>
                                  {cuenta.CodigoCuenta} - {cuenta.NombreCuenta}
                                </option>
                              ))}
                              </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={mov.debe}
                              onChange={(e) => actualizarMovimiento(index, 'debe', e.target.value)}
                              className="w-full border rounded px-2 py-1 text-right focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={mov.haber}
                              onChange={(e) => actualizarMovimiento(index, 'haber', e.target.value)}
                              className="w-full border rounded px-2 py-1 text-right focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={mov.descripcion}
                              onChange={(e) => actualizarMovimiento(index, 'descripcion', e.target.value)}
                              className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                              placeholder="Detalle del movimiento"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {nuevoAsiento.detalles.length > 2 && (
                              <button
                                onClick={() => eliminarMovimiento(index)}
                                className="text-red-600 hover:text-red-800"
                                title="Eliminar línea"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr className="font-bold">
                        <td className="px-4 py-3">TOTALES:</td>
                        <td className="px-4 py-3 text-right text-green-600">
                          ${calcularTotales(nuevoAsiento.detalles).totalDebe.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-red-600">
                          ${calcularTotales(nuevoAsiento.detalles).totalHaber.toFixed(2)}
                        </td>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              {/* Validación del balance */}
             {(() => {
               const { totalDebe, totalHaber } = calcularTotales(nuevoAsiento.detalles);
               const diferencia = Math.abs(totalDebe - totalHaber);
               const balanceado = diferencia < 0.01;
               
               return (
                 <div className={`p-4 rounded-lg mb-6 ${balanceado ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                   <div className="flex items-center space-x-2">
                     <span className={`font-medium ${balanceado ? 'text-green-800' : 'text-red-800'}`}>
                       {balanceado ? '✅ Asiento Balanceado' : '❌ Asiento Desbalanceado'}
                     </span>
                     {!balanceado && (
                       <span className="text-red-600">
                         (Diferencia: ${diferencia.toFixed(2)})
                       </span>
                     )}
                   </div>
                 </div>
               );
             })()}

             {/* Botones de acción */}
             <div className="flex justify-end space-x-4">
               <button
                 onClick={cerrarFormulario}
                 className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
               >
                 Cancelar
               </button>
               <button
                 onClick={guardarAsiento}
                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition"

               >
                 <FaSave />
                 <span>{asientoEditando ? 'Actualizar' : 'Guardar'} Asiento</span>
               </button>
             </div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
}