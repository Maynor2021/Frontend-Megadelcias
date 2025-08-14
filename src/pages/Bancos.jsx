// src/pages/Bancos.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, FaPlus, FaEdit, FaUniversity, FaTimes, FaSave, 
  FaFileExcel, FaTrash, FaEye, FaDownload, FaUpload
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo-megadelicias.png";
import ImportarEstadoCuenta from '../components/ImportarEstadoCuenta';
import GestionarAsientos from '../components/GestionarAsientos';
import * as XLSX from 'xlsx';

export default function Bancos() {
  const navigate = useNavigate();
  
  // Estados principales
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  const [movimientos, setMovimientos] = useState([]);
  const [mostrarModalBanco, setMostrarModalBanco] = useState(false);
  const [mostrarModalImportar, setMostrarModalImportar] = useState(false);
  const [mostrarModalAsientos, setMostrarModalAsientos] = useState(false);
  const [editandoBanco, setEditandoBanco] = useState(null);
  const [nuevoBanco, setNuevoBanco] = useState({
    nombre: '',
    codigo: '',
    activo: true,
    saldoInicial: 0,
    cuentaContable: '1100' // Banco contra Caja General por defecto
  });

  // Bancos disponibles con información extendida
  const [bancosDisponibles, setBancosDisponibles] = useState([
    { 
      id: 1, 
      nombre: 'Banco Nacional', 
      codigo: 'BN', 
      activo: true, 
      saldoInicial: 50000,
      cuentaContable: '1100',
      saldoActual: 50000
    },
    { 
      id: 2, 
      nombre: 'Banco Popular', 
      codigo: 'BP', 
      activo: true, 
      saldoInicial: 30000,
      cuentaContable: '1100',
      saldoActual: 30000
    },
    { 
      id: 3, 
      nombre: 'Banco de Costa Rica', 
      codigo: 'BCR', 
      activo: true, 
      saldoInicial: 75000,
      cuentaContable: '1100',
      saldoActual: 75000
    }
  ]);

  // Datos de ejemplo con asientos contables
  const movimientosPorBanco = {
    1: [
      {
        id: 1,
        fecha: '2025-01-10',
        nombreAsiento: 'Depósito ventas del día',
        monto: 2500.00,
        tipo: 'deposito',
        asientoContable: {
          debe: [{ cuenta: '1100', concepto: 'Banco Nacional', monto: 2500.00 }],
          haber: [{ cuenta: '4000', concepto: 'Ventas', monto: 2500.00 }]
        }
      },
      {
        id: 2,
        fecha: '2025-01-09',
        nombreAsiento: 'Pago proveedor',
        monto: -1200.00,
        tipo: 'retiro',
        asientoContable: {
          debe: [{ cuenta: '2100', concepto: 'Cuentas por Pagar', monto: 1200.00 }],
          haber: [{ cuenta: '1100', concepto: 'Banco Nacional', monto: 1200.00 }]
        }
      }
    ],
    2: [
      {
        id: 3,
        fecha: '2025-01-07',
        nombreAsiento: 'Transferencia nómina',
        monto: -3200.00,
        tipo: 'retiro',
        asientoContable: {
          debe: [{ cuenta: '5000', concepto: 'Gastos de Personal', monto: 3200.00 }],
          haber: [{ cuenta: '1100', concepto: 'Banco Popular', monto: 3200.00 }]
        }
      }
    ]
  };

  // Estados para filtros
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [movimientosFiltrados, setMovimientosFiltrados] = useState([]);

  // Cargar movimientos cuando se selecciona banco
  useEffect(() => {
    if (bancoSeleccionado) {
      const movimientosBanco = movimientosPorBanco[bancoSeleccionado] || [];
      setMovimientos(movimientosBanco);
      setMovimientosFiltrados(movimientosBanco);
    } else {
      setMovimientos([]);
      setMovimientosFiltrados([]);
    }
  }, [bancoSeleccionado]);

  // Aplicar filtros de fecha
  useEffect(() => {
    if (movimientos.length > 0) {
      let movimientosFiltrados = movimientos;
      
      if (filtroFechaInicio) {
        movimientosFiltrados = movimientosFiltrados.filter(mov => 
          mov.fecha >= filtroFechaInicio
        );
      }
      
      if (filtroFechaFin) {
        movimientosFiltrados = movimientosFiltrados.filter(mov => 
          mov.fecha <= filtroFechaFin
        );
      }
      
      setMovimientosFiltrados(movimientosFiltrados);
    } else {
      setMovimientosFiltrados([]);
    }
  }, [movimientos, filtroFechaInicio, filtroFechaFin]);

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
  };

  const volverAContabilidad = () => {
    navigate('/contabilidad');
  };

  const abrirModalBanco = (banco = null) => {
    if (banco) {
      setEditandoBanco(banco.id);
      setNuevoBanco({
        nombre: banco.nombre,
        codigo: banco.codigo,
        activo: banco.activo,
        saldoInicial: banco.saldoInicial,
        cuentaContable: banco.cuentaContable
      });
    } else {
      setEditandoBanco(null);
      setNuevoBanco({
        nombre: '',
        codigo: '',
        activo: true,
        saldoInicial: 0,
        cuentaContable: '1100'
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
        b.id === editandoBanco ? { 
          ...b, 
          ...nuevoBanco, 
          id: editandoBanco,
          saldoActual: b.saldoActual // Mantener saldo actual
        } : b
      ));
    } else {
      // Agregar nuevo banco
      const nuevoId = Math.max(...bancosDisponibles.map(b => b.id), 0) + 1;
      setBancosDisponibles([...bancosDisponibles, { 
        ...nuevoBanco, 
        id: nuevoId,
        saldoActual: nuevoBanco.saldoInicial
      }]);
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

  const eliminarAsiento = (asientoId) => {
    if (window.confirm('¿Estás seguro de eliminar este asiento?')) {
      setMovimientos(movimientos.filter(m => m.id !== asientoId));
      alert('✅ Asiento eliminado exitosamente.');
    }
  };

  const calcularSaldoBanco = (bancoId) => {
    const banco = bancosDisponibles.find(b => b.id === bancoId);
    if (!banco) return 0;
    
    const movimientosBanco = movimientosPorBanco[bancoId] || [];
    const saldo = movimientosBanco.reduce((total, mov) => total + mov.monto, banco.saldoInicial);
    return saldo;
  };

  // Funciones de exportación
  const exportarAExcel = () => {
    const movimientosAExportar = movimientosFiltrados.length > 0 ? movimientosFiltrados : movimientos;
    
    if (movimientosAExportar.length === 0) {
      alert('❌ No hay movimientos para exportar.');
      return;
    }
    
    try {
      const workbook = XLSX.utils.book_new();
      const worksheetData = movimientosAExportar.map(mov => ({
        'Fecha': mov.fecha,
        'Concepto': mov.nombreAsiento,
        'Monto': mov.monto,
        'Tipo': mov.tipo,
        'Cuenta Debe': mov.asientoContable?.debe?.[0]?.cuenta || '',
        'Concepto Debe': mov.asientoContable?.debe?.[0]?.concepto || '',
        'Cuenta Haber': mov.asientoContable?.haber?.[0]?.cuenta || '',
        'Concepto Haber': mov.asientoContable?.haber?.[0]?.concepto || ''
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos Bancarios');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      const nombreArchivo = filtroFechaInicio || filtroFechaFin 
        ? `movimientos_banco_${bancoSeleccionado}_filtrado_${new Date().toISOString().split('T')[0]}.xlsx`
        : `movimientos_banco_${bancoSeleccionado}_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('✅ Archivo Excel exportado exitosamente.');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('❌ Error al exportar a Excel: ' + error.message);
    }
  };

  const exportarACSV = () => {
    const movimientosAExportar = movimientosFiltrados.length > 0 ? movimientosFiltrados : movimientos;
    
    if (movimientosAExportar.length === 0) {
      alert('❌ No hay movimientos para exportar.');
      return;
    }
    
    try {
      const csvContent = [
        ['Fecha', 'Concepto', 'Monto', 'Tipo', 'Cuenta Debe', 'Concepto Debe', 'Cuenta Haber', 'Concepto Haber'],
        ...movimientosAExportar.map(mov => [
          mov.fecha,
          mov.nombreAsiento,
          mov.monto,
          mov.tipo,
          mov.asientoContable?.debe?.[0]?.cuenta || '',
          mov.asientoContable?.debe?.[0]?.concepto || '',
          mov.asientoContable?.haber?.[0]?.cuenta || '',
          mov.asientoContable?.haber?.[0]?.concepto || ''
        ])
      ].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const nombreArchivo = filtroFechaInicio || filtroFechaFin 
        ? `movimientos_banco_${bancoSeleccionado}_filtrado_${new Date().toISOString().split('T')[0]}.csv`
        : `movimientos_banco_${bancoSeleccionado}_${new Date().toISOString().split('T')[0]}.csv`;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('✅ Archivo CSV exportado exitosamente.');
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
      alert('❌ Error al exportar a CSV: ' + error.message);
    }
  };

  const exportarAPDF = () => {
    const movimientosAExportar = movimientosFiltrados.length > 0 ? movimientosFiltrados : movimientos;
    
    if (movimientosAExportar.length === 0) {
      alert('❌ No hay movimientos para exportar.');
      return;
    }
    
    try {
      // Crear contenido HTML para el PDF
      const contenidoHTML = `
        <html>
          <head>
            <title>Movimientos Bancarios</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .banco-info { margin-bottom: 20px; }
              .filtros-info { margin-bottom: 20px; background-color: #f9f9f9; padding: 10px; border-radius: 5px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .monto-positivo { color: green; }
              .monto-negativo { color: red; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Movimientos Bancarios</h1>
              <h2>${bancosDisponibles.find(b => b.id === parseInt(bancoSeleccionado))?.nombre}</h2>
              <p>Fecha de exportación: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="banco-info">
              <p><strong>Banco:</strong> ${bancosDisponibles.find(b => b.id === parseInt(bancoSeleccionado))?.nombre}</p>
              <p><strong>Total Movimientos:</strong> ${movimientos.length}</p>
              <p><strong>Movimientos Filtrados:</strong> ${movimientosAExportar.length}</p>
              <p><strong>Saldo Actual:</strong> $${calcularSaldoBanco(parseInt(bancoSeleccionado)).toFixed(2)}</p>
            </div>
            
            ${filtroFechaInicio || filtroFechaFin ? `
            <div class="filtros-info">
              <p><strong>Filtros Aplicados:</strong></p>
              ${filtroFechaInicio ? `<p>Fecha Inicio: ${filtroFechaInicio}</p>` : ''}
              ${filtroFechaFin ? `<p>Fecha Fin: ${filtroFechaFin}</p>` : ''}
            </div>
            ` : ''}
            
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th>Monto</th>
                  <th>Tipo</th>
                  <th>Asiento Contable</th>
                </tr>
              </thead>
              <tbody>
                ${movimientosAExportar.map(mov => `
                  <tr>
                    <td>${mov.fecha}</td>
                    <td>${mov.nombreAsiento}</td>
                    <td class="${mov.monto >= 0 ? 'monto-positivo' : 'monto-negativo'}">
                      $${Math.abs(mov.monto).toFixed(2)}
                    </td>
                    <td>${mov.tipo}</td>
                    <td>
                      ${mov.asientoContable?.debe?.[0]?.cuenta || ''}:${mov.asientoContable?.debe?.[0]?.concepto || ''} 
                      → ${mov.asientoContable?.haber?.[0]?.cuenta || ''}:${mov.asientoContable?.haber?.[0]?.concepto || ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      // Crear ventana de impresión
      const ventanaImpresion = window.open('', '_blank');
      ventanaImpresion.document.write(contenidoHTML);
      ventanaImpresion.document.close();
      ventanaImpresion.focus();
      
      // Esperar a que se cargue el contenido y luego imprimir
      setTimeout(() => {
        ventanaImpresion.print();
        ventanaImpresion.close();
      }, 500);
      
      alert('✅ PDF generado exitosamente. Se abrirá la ventana de impresión.');
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      alert('❌ Error al exportar a PDF: ' + error.message);
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
              <>
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
                <button
                  onClick={() => setMostrarModalImportar(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  title="Importar estado de cuenta desde Excel"
                >
                  <FaUpload size={12} />
                  <span>Importar Excel</span>
                </button>
                <button
                  onClick={() => setMostrarModalAsientos(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  title="Gestionar asientos contables"
                >
                  <FaEye size={12} />
                  <span>Asientos</span>
                </button>
              </>
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
                  {banco.nombre} ({banco.codigo}) - Saldo: ${calcularSaldoBanco(banco.id).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          {bancoSeleccionado && (
            <div className="text-sm text-gray-600">
              📊 {movimientosFiltrados.length} movimientos
            </div>
          )}
        </div>
      </div>

      {/* Filtros de fecha */}
      {bancoSeleccionado && (
        <div className="bg-white mx-6 mt-4 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filtros de Fecha</h3>
            <button
              onClick={limpiarFiltros}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Limpiar filtros
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <div>Total: {movimientos.length} movimientos</div>
                <div>Filtrados: {movimientosFiltrados.length} movimientos</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar movimientos */}
      <div className="mx-6 mt-4 mb-6">
        {!bancoSeleccionado && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaUniversity className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">Selecciona un Banco</h3>
            <p className="text-gray-600">Elige un banco para ver sus movimientos.</p>
          </div>
        )}

        {bancoSeleccionado && movimientosFiltrados.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Movimientos Bancarios</h3>
                  <p className="text-gray-600">
                    {movimientosFiltrados.length} movimientos encontrados
                    {filtroFechaInicio || filtroFechaFin ? ` (filtrados por fecha)` : ''}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={exportarAExcel}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-2"
                    title="Exportar a Excel"
                  >
                    <FaFileExcel size={14} />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={exportarACSV}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-2"
                    title="Exportar a CSV"
                  >
                    <FaDownload size={14} />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={exportarAPDF}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-2"
                    title="Exportar a PDF"
                  >
                    <FaFileExcel size={14} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              {movimientosFiltrados.map((mov) => (
                <div key={mov.id} className="p-3 border rounded mb-2 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="font-medium">{mov.nombreAsiento}</span>
                      <span className="text-gray-500 ml-2">({mov.fecha})</span>
                      {mov.asientoContable && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Asiento:</span> 
                          {mov.asientoContable.debe.map(d => ` ${d.cuenta}:${d.concepto}`).join(', ')} 
                          → {mov.asientoContable.haber.map(h => ` ${h.cuenta}:${h.concepto}`).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${mov.monto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(mov.monto).toFixed(2)}
                      </span>
                      <button
                        onClick={() => eliminarAsiento(mov.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Eliminar asiento"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {bancoSeleccionado && movimientosFiltrados.length === 0 && movimientos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-bold text-gray-700 mb-2">No hay movimientos en el rango de fechas</h3>
            <p className="text-gray-600">Ajusta los filtros de fecha para ver los movimientos.</p>
            <div className="mt-4">
              <button
                onClick={limpiarFiltros}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}

        {bancoSeleccionado && movimientos.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-bold text-gray-700 mb-2">No hay movimientos</h3>
            <p className="text-gray-600">Este banco no tiene movimientos registrados.</p>
            <div className="mt-4">
              <button
                onClick={() => setMostrarModalImportar(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
              >
                <FaUpload />
                <span>Importar Estado de Cuenta</span>
              </button>
            </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saldo Inicial ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevoBanco.saldoInicial}
                    onChange={(e) => setNuevoBanco({ ...nuevoBanco, saldoInicial: parseFloat(e.target.value) || 0 })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cuenta Contable *
                  </label>
                  <select
                    value={nuevoBanco.cuentaContable}
                    onChange={(e) => setNuevoBanco({ ...nuevoBanco, cuentaContable: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1100">1100 - Banco</option>
                    <option value="1200">1200 - Caja General</option>
                    <option value="1300">1300 - Otros Bancos</option>
                  </select>
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

      {/* Modal para Importar Estado de Cuenta */}
      {mostrarModalImportar && (
        <ImportarEstadoCuenta
          bancoId={bancoSeleccionado}
          onClose={() => setMostrarModalImportar(false)}
          onImportSuccess={(nuevosMovimientos) => {
            setMovimientos([...movimientos, ...nuevosMovimientos]);
            setMostrarModalImportar(false);
          }}
        />
      )}

      {/* Modal para Gestionar Asientos */}
      {mostrarModalAsientos && (
        <GestionarAsientos
          bancoId={bancoSeleccionado}
          movimientos={movimientos}
          onClose={() => setMostrarModalAsientos(false)}
          onUpdateMovimientos={setMovimientos}
        />
      )}
    </div>
  );
}