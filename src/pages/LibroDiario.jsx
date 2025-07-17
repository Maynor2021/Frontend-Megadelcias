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

export default function LibroDiario() {
  const navigate = useNavigate();
  
  // Estados para el manejo de datos
  const [asientos, setAsientos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [asientoEditando, setAsientoEditando] = useState(null);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    concepto: '',
    cuenta: ''
  });

  // Estado para el formulario de nuevo asiento
  const [nuevoAsiento, setNuevoAsiento] = useState({
    fecha: new Date().toISOString().split('T')[0],
    numero: '',
    concepto: '',
    movimientos: [
      { cuenta: '', debe: '', haber: '', referencia: '' },
      { cuenta: '', debe: '', haber: '', referencia: '' }
    ]
  });

  // Catálogo de cuentas (en una app real vendría del backend)
  const cuentas = [
    { codigo: '1101', nombre: 'Caja General' },
    { codigo: '1102', nombre: 'Bancos' },
    { codigo: '1201', nombre: 'Cuentas por Cobrar' },
    { codigo: '1301', nombre: 'Inventario' },
    { codigo: '1401', nombre: 'Mobiliario y Equipo' },
    { codigo: '2101', nombre: 'Cuentas por Pagar' },
    { codigo: '2201', nombre: 'Préstamos por Pagar' },
    { codigo: '3101', nombre: 'Capital Social' },
    { codigo: '4101', nombre: 'Ventas' },
    { codigo: '5101', nombre: 'Costo de Ventas' },
    { codigo: '6101', nombre: 'Gastos Administrativos' },
    { codigo: '6102', nombre: 'Gastos de Ventas' }
  ];

  // Cargar datos de ejemplo al inicializar
  useEffect(() => {
    const asientosEjemplo = [
      {
        id: 1,
        fecha: '2025-01-10',
        numero: 'A-001',
        concepto: 'Venta del día',
        movimientos: [
          { cuenta: '1101 - Caja General', debe: '2500.00', haber: '', referencia: 'Factura 001' },
          { cuenta: '4101 - Ventas', debe: '', haber: '2500.00', referencia: 'Factura 001' }
        ]
      },
      {
        id: 2,
        fecha: '2025-01-10',
        numero: 'A-002',
        concepto: 'Compra de ingredientes',
        movimientos: [
          { cuenta: '1301 - Inventario', debe: '800.00', haber: '', referencia: 'Factura C-123' },
          { cuenta: '1101 - Caja General', debe: '', haber: '800.00', referencia: 'Factura C-123' }
        ]
      }
    ];
    setAsientos(asientosEjemplo);
  }, []);

  const volverAContabilidad = () => {
    navigate('/contabilidad');
  };

  const abrirFormularioNuevo = () => {
    setAsientoEditando(null);
    setNuevoAsiento({
      fecha: new Date().toISOString().split('T')[0],
      numero: `A-${String(asientos.length + 1).padStart(3, '0')}`,
      concepto: '',
      movimientos: [
        { cuenta: '', debe: '', haber: '', referencia: '' },
        { cuenta: '', debe: '', haber: '', referencia: '' }
      ]
    });
    setMostrarFormulario(true);
  };

  const editarAsiento = (asiento) => {
    setAsientoEditando(asiento.id);
    setNuevoAsiento(asiento);
    setMostrarFormulario(true);
  };

  const eliminarAsiento = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este asiento?')) {
      setAsientos(asientos.filter(a => a.id !== id));
    }
  };

  const agregarMovimiento = () => {
    setNuevoAsiento({
      ...nuevoAsiento,
      movimientos: [...nuevoAsiento.movimientos, { cuenta: '', debe: '', haber: '', referencia: '' }]
    });
  };

  const eliminarMovimiento = (index) => {
    if (nuevoAsiento.movimientos.length > 2) {
      const nuevosMovimientos = nuevoAsiento.movimientos.filter((_, i) => i !== index);
      setNuevoAsiento({ ...nuevoAsiento, movimientos: nuevosMovimientos });
    }
  };

  const actualizarMovimiento = (index, campo, valor) => {
    const nuevosMovimientos = [...nuevoAsiento.movimientos];
    nuevosMovimientos[index] = { ...nuevosMovimientos[index], [campo]: valor };
    setNuevoAsiento({ ...nuevoAsiento, movimientos: nuevosMovimientos });
  };

  const validarAsiento = () => {
    const totalDebe = nuevoAsiento.movimientos.reduce((sum, mov) => sum + (parseFloat(mov.debe) || 0), 0);
    const totalHaber = nuevoAsiento.movimientos.reduce((sum, mov) => sum + (parseFloat(mov.haber) || 0), 0);
    
    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      alert('El asiento no está balanceado. La suma del Debe debe ser igual a la suma del Haber.');
      return false;
    }

    if (!nuevoAsiento.concepto.trim()) {
      alert('El concepto es obligatorio.');
      return false;
    }

    if (nuevoAsiento.movimientos.some(mov => !mov.cuenta)) {
      alert('Todas las cuentas deben estar seleccionadas.');
      return false;
    }

    return true;
  };

  const guardarAsiento = () => {
    if (!validarAsiento()) return;

    if (asientoEditando) {
      // Editar asiento existente
      setAsientos(asientos.map(a => 
        a.id === asientoEditando ? { ...nuevoAsiento, id: asientoEditando } : a
      ));
    } else {
      // Crear nuevo asiento
      const nuevoId = Math.max(...asientos.map(a => a.id), 0) + 1;
      setAsientos([...asientos, { ...nuevoAsiento, id: nuevoId }]);
    }
    
    cerrarFormulario();
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setAsientoEditando(null);
  };

  const calcularTotales = (movimientos) => {
    const totalDebe = movimientos.reduce((sum, mov) => sum + (parseFloat(mov.debe) || 0), 0);
    const totalHaber = movimientos.reduce((sum, mov) => sum + (parseFloat(mov.haber) || 0), 0);
    return { totalDebe, totalHaber };
  };

  // Filtrar asientos
  const asientosFiltrados = asientos.filter(asiento => {
    const cumpleFecha = (!filtros.fechaInicio || asiento.fecha >= filtros.fechaInicio) &&
                       (!filtros.fechaFin || asiento.fecha <= filtros.fechaFin);
    const cumpleConcepto = !filtros.concepto || 
                          asiento.concepto.toLowerCase().includes(filtros.concepto.toLowerCase());
    const cumpleCuenta = !filtros.cuenta || 
                        asiento.movimientos.some(mov => 
                          mov.cuenta.toLowerCase().includes(filtros.cuenta.toLowerCase()));
    
    return cumpleFecha && cumpleConcepto && cumpleCuenta;
  });

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
                    <span className="font-bold text-blue-600">{asiento.numero}</span>
                    <span className="text-gray-600">{asiento.fecha}</span>
                    <span className="font-medium">{asiento.concepto}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Total: ${totalDebe.toFixed(2)}
                    </span>
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
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
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
                        <th className="pb-2">Referencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asiento.movimientos.map((mov, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="py-2 font-medium">{mov.cuenta}</td>
                          <td className="py-2 text-right text-green-600 font-medium">
                            {mov.debe && `$${parseFloat(mov.debe).toFixed(2)}`}
                          </td>
                          <td className="py-2 text-right text-red-600 font-medium">
                            {mov.haber && `$${parseFloat(mov.haber).toFixed(2)}`}
                          </td>
                          <td className="py-2 text-gray-600">{mov.referencia}</td>
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
                    Número de Asiento
                  </label>
                  <input
                    type="text"
                    value={nuevoAsiento.numero}
                    onChange={(e) => setNuevoAsiento({ ...nuevoAsiento, numero: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="A-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={nuevoAsiento.fecha}
                    onChange={(e) => setNuevoAsiento({ ...nuevoAsiento, fecha: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <input
                    type="text"
                    value={`$${calcularTotales(nuevoAsiento.movimientos).totalDebe.toFixed(2)}`}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Concepto *
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
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Referencia</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nuevoAsiento.movimientos.map((mov, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-3">
                            <select
                              value={mov.cuenta}
                              onChange={(e) => actualizarMovimiento(index, 'cuenta', e.target.value)}
                              className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Seleccionar cuenta...</option>
                              {cuentas.map((cuenta) => (
                                <option key={cuenta.codigo} value={`${cuenta.codigo} - ${cuenta.nombre}`}>
                                  {cuenta.codigo} - {cuenta.nombre}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              value={mov.debe}
                              onChange={(e) => {
                                actualizarMovimiento(index, 'debe', e.target.value);
                                if (e.target.value) actualizarMovimiento(index, 'haber', '');
                              }}
                              className="w-full border rounded px-2 py-1 text-right focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              value={mov.haber}
                              onChange={(e) => {
                                actualizarMovimiento(index, 'haber', e.target.value);
                                if (e.target.value) actualizarMovimiento(index, 'debe', '');
                              }}
                              className="w-full border rounded px-2 py-1 text-right focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={mov.referencia}
                              onChange={(e) => actualizarMovimiento(index, 'referencia', e.target.value)}
                              className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                              placeholder="Factura, cheque, etc."
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {nuevoAsiento.movimientos.length > 2 && (
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
                          ${calcularTotales(nuevoAsiento.movimientos).totalDebe.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-red-600">
                          ${calcularTotales(nuevoAsiento.movimientos).totalHaber.toFixed(2)}
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
                const { totalDebe, totalHaber } = calcularTotales(nuevoAsiento.movimientos);
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