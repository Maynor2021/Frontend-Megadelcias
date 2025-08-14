// src/pages/BalanceComprobacion.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, FaFileExcel, FaDownload, FaEye, FaSearch, 
  FaFilter, FaTimes, FaPrint, FaCalculator, FaBalanceScale,
  FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo-megadelcias.png";
import * as XLSX from 'xlsx';

export default function BalanceComprobacion() {
  const navigate = useNavigate();
  
  // Estados principales
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cuentas, setCuentas] = useState([]);
  const [cuentasFiltradas, setCuentasFiltradas] = useState([]);
  const [filtroCuenta, setFiltroCuenta] = useState('');
  const [mostrarSoloDesbalanceadas, setMostrarSoloDesbalanceadas] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState('codigo'); // codigo, nombre, debe, haber, saldo
  const [orden, setOrden] = useState('asc'); // asc, desc

  // Datos de ejemplo - Cuentas contables con movimientos
  const cuentasContables = [
    {
      codigo: '1000',
      nombre: 'Activos Corrientes',
      tipo: 'activo',
      nivel: 1,
      saldoAnterior: 150000,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Ventas del día', debe: 2500, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Pago proveedor', debe: 0, haber: 1200 },
        { fecha: '2025-01-08', concepto: 'Depósito banco', debe: 5000, haber: 0 }
      ]
    },
    {
      codigo: '1100',
      nombre: 'Banco',
      tipo: 'activo',
      nivel: 2,
      saldoAnterior: 50000,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Depósito ventas', debe: 2500, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Pago proveedor', debe: 0, haber: 1200 },
        { fecha: '2025-01-08', concepto: 'Transferencia', debe: 5000, haber: 0 }
      ]
    },
    {
      codigo: '1200',
      nombre: 'Caja General',
      tipo: 'activo',
      nivel: 2,
      saldoAnterior: 25000,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Ventas efectivo', debe: 1800, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Pago servicios', debe: 0, haber: 800 },
        { fecha: '2025-01-08', concepto: 'Retiro banco', debe: 0, haber: 2000 }
      ]
    },
    {
      codigo: '1300',
      nombre: 'Cuentas por Cobrar',
      tipo: 'activo',
      nivel: 2,
      saldoAnterior: 15000,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Venta a crédito', debe: 1200, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Cobro cliente', debe: 0, haber: 800 },
        { fecha: '2025-01-08', concepto: 'Venta fiado', debe: 500, haber: 0 }
      ]
    },
    {
      codigo: '2000',
      nombre: 'Pasivos Corrientes',
      tipo: 'pasivo',
      nivel: 1,
      saldoAnterior: 80000,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Compra mercancía', debe: 0, haber: 3000 },
        { fecha: '2025-01-09', concepto: 'Pago proveedor', debe: 1200, haber: 0 },
        { fecha: '2025-01-08', concepto: 'Servicios públicos', debe: 0, haber: 500 }
      ]
    },
    {
      codigo: '2100',
      nombre: 'Cuentas por Pagar',
      tipo: 'pasivo',
      nivel: 2,
      saldoAnterior: 45000,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Compra mercancía', debe: 0, haber: 3000 },
        { fecha: '2025-01-09', concepto: 'Pago proveedor', debe: 1200, haber: 0 },
        { fecha: '2025-01-08', concepto: 'Servicios públicos', debe: 0, haber: 500 }
      ]
    },
    {
      codigo: '2200',
      nombre: 'Impuestos por Pagar',
      tipo: 'pasivo',
      nivel: 2,
      saldoAnterior: 35000,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'IVA ventas', debe: 0, haber: 450 },
        { fecha: '2025-01-09', concepto: 'Retención', debe: 0, haber: 200 },
        { fecha: '2025-01-08', concepto: 'Pago IVA', debe: 1200, haber: 0 }
      ]
    },
    {
      codigo: '3000',
      nombre: 'Patrimonio',
      tipo: 'patrimonio',
      nivel: 1,
      saldoAnterior: 200000,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Aportación capital', debe: 0, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Utilidad ejercicio', debe: 0, haber: 0 },
        { fecha: '2025-01-08', concepto: 'Retiro socios', debe: 0, haber: 0 }
      ]
    },
    {
      codigo: '3100',
      nombre: 'Capital Social',
      tipo: 'patrimonio',
      nivel: 2,
      saldoAnterior: 150000,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Aportación capital', debe: 0, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Aumento capital', debe: 0, haber: 0 },
        { fecha: '2025-01-08', concepto: 'Sin movimientos', debe: 0, haber: 0 }
      ]
    },
    {
      codigo: '3200',
      nombre: 'Utilidades Retenidas',
      tipo: 'patrimonio',
      nivel: 2,
      saldoAnterior: 50000,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Utilidad ejercicio', debe: 0, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Distribución', debe: 0, haber: 0 },
        { fecha: '2025-01-08', concepto: 'Sin movimientos', debe: 0, haber: 0 }
      ]
    },
    {
      codigo: '4000',
      nombre: 'Ingresos',
      tipo: 'ingreso',
      nivel: 1,
      saldoAnterior: 0,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Ventas del día', debe: 0, haber: 4300 },
        { fecha: '2025-01-09', concepto: 'Ventas del día', debe: 0, haber: 3800 },
        { fecha: '2025-01-08', concepto: 'Ventas del día', debe: 0, haber: 4200 }
      ]
    },
    {
      codigo: '4100',
      nombre: 'Ventas de Mercancías',
      tipo: 'ingreso',
      nivel: 2,
      saldoAnterior: 0,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Ventas del día', debe: 0, haber: 4300 },
        { fecha: '2025-01-09', concepto: 'Ventas del día', debe: 0, haber: 3800 },
        { fecha: '2025-01-08', concepto: 'Ventas del día', debe: 0, haber: 4200 }
      ]
    },
    {
      codigo: '5000',
      nombre: 'Gastos',
      tipo: 'gasto',
      nivel: 1,
      saldoAnterior: 0,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Gastos operativos', debe: 2800, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Gastos administrativos', debe: 1500, haber: 0 },
        { fecha: '2025-01-08', concepto: 'Gastos de ventas', debe: 2200, haber: 0 }
      ]
    },
    {
      codigo: '5100',
      nombre: 'Gastos de Personal',
      tipo: 'gasto',
      nivel: 2,
      saldoAnterior: 0,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Salarios', debe: 1800, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Prestaciones', debe: 500, haber: 0 },
        { fecha: '2025-01-08', concepto: 'Salarios', debe: 1800, haber: 0 }
      ]
    },
    {
      codigo: '5200',
      nombre: 'Gastos Administrativos',
      tipo: 'gasto',
      nivel: 2,
      saldoAnterior: 0,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Servicios públicos', debe: 300, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Renta', debe: 800, haber: 0 },
        { fecha: '2025-01-08', concepto: 'Internet', debe: 200, haber: 0 }
      ]
    },
    {
      codigo: '5300',
      nombre: 'Gastos de Ventas',
      tipo: 'gasto',
      nivel: 2,
      saldoAnterior: 0,
      movimientos: [
        { fecha: '2025-01-10', concepto: 'Publicidad', debe: 400, haber: 0 },
        { fecha: '2025-01-09', concepto: 'Comisiones', debe: 200, haber: 0 },
        { fecha: '2025-01-08', concepto: 'Materiales', debe: 200, haber: 0 }
      ]
    }
  ];

  // Inicializar cuentas
  useEffect(() => {
    setCuentas(cuentasContables);
    setCuentasFiltradas(cuentasContables);
  }, []);

  // Calcular totales de cada cuenta
  const calcularTotalesCuenta = (cuenta) => {
    const totalDebe = cuenta.movimientos.reduce((sum, mov) => sum + mov.debe, 0);
    const totalHaber = cuenta.movimientos.reduce((sum, mov) => sum + mov.haber, 0);
    
    let saldoFinal = cuenta.saldoAnterior;
    
    // Aplicar reglas contables según el tipo de cuenta
    switch (cuenta.tipo) {
      case 'activo':
      case 'gasto':
        saldoFinal += totalDebe - totalHaber;
        break;
      case 'pasivo':
      case 'patrimonio':
      case 'ingreso':
        saldoFinal += totalHaber - totalDebe;
        break;
      default:
        saldoFinal += totalDebe - totalHaber;
    }
    
    return {
      totalDebe,
      totalHaber,
      saldoFinal,
      desbalanceada: Math.abs(totalDebe - totalHaber) > 0.01
    };
  };

  // Aplicar filtros
  useEffect(() => {
    let cuentasFiltradas = cuentas;
    
    // Filtro por texto
    if (filtroCuenta) {
      cuentasFiltradas = cuentasFiltradas.filter(cuenta =>
        cuenta.codigo.toLowerCase().includes(filtroCuenta.toLowerCase()) ||
        cuenta.nombre.toLowerCase().includes(filtroCuenta.toLowerCase())
      );
    }
    
    // Filtro por fechas
    if (fechaInicio || fechaFin) {
      cuentasFiltradas = cuentasFiltradas.map(cuenta => ({
        ...cuenta,
        movimientos: cuenta.movimientos.filter(mov => {
          if (fechaInicio && mov.fecha < fechaInicio) return false;
          if (fechaFin && mov.fecha > fechaFin) return false;
          return true;
        })
      }));
    }
    
    // Filtro por desbalanceadas
    if (mostrarSoloDesbalanceadas) {
      cuentasFiltradas = cuentasFiltradas.filter(cuenta => {
        const totales = calcularTotalesCuenta(cuenta);
        return totales.desbalanceada;
      });
    }
    
    // Ordenar
    cuentasFiltradas.sort((a, b) => {
      let valorA, valorB;
      
      switch (ordenarPor) {
        case 'codigo':
          valorA = a.codigo;
          valorB = b.codigo;
          break;
        case 'nombre':
          valorA = a.nombre.toLowerCase();
          valorB = b.nombre.toLowerCase();
          break;
        case 'debe':
          valorA = calcularTotalesCuenta(a).totalDebe;
          valorB = calcularTotalesCuenta(b).totalDebe;
          break;
        case 'haber':
          valorA = calcularTotalesCuenta(a).totalHaber;
          valorB = calcularTotalesCuenta(b).totalHaber;
          break;
        case 'saldo':
          valorA = calcularTotalesCuenta(a).saldoFinal;
          valorB = calcularTotalesCuenta(b).saldoFinal;
          break;
        default:
          valorA = a.codigo;
          valorB = b.codigo;
      }
      
      if (orden === 'asc') {
        return valorA > valorB ? 1 : -1;
      } else {
        return valorA < valorB ? 1 : -1;
      }
    });
    
    setCuentasFiltradas(cuentasFiltradas);
  }, [cuentas, filtroCuenta, fechaInicio, fechaFin, mostrarSoloDesbalanceadas, ordenarPor, orden]);

  // Calcular totales generales
  const calcularTotalesGenerales = () => {
    const totales = cuentasFiltradas.reduce((acc, cuenta) => {
      const totalesCuenta = calcularTotalesCuenta(cuenta);
      acc.totalDebe += totalesCuenta.totalDebe;
      acc.totalHaber += totalesCuenta.totalHaber;
      acc.totalSaldoAnterior += cuenta.saldoAnterior;
      acc.totalSaldoFinal += totalesCuenta.saldoFinal;
      return acc;
    }, {
      totalDebe: 0,
      totalHaber: 0,
      totalSaldoAnterior: 0,
      totalSaldoFinal: 0
    });
    
    return totales;
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroCuenta('');
    setFechaInicio('');
    setFechaFin('');
    setMostrarSoloDesbalanceadas(false);
    setOrdenarPor('codigo');
    setOrden('asc');
  };

  // Exportar a Excel
  const exportarAExcel = () => {
    if (cuentasFiltradas.length === 0) {
      alert('❌ No hay datos para exportar.');
      return;
    }
    
    try {
      const workbook = XLSX.utils.book_new();
      
      // Hoja principal del balance
      const balanceData = cuentasFiltradas.map(cuenta => {
        const totales = calcularTotalesCuenta(cuenta);
        return {
          'Código': cuenta.codigo,
          'Nombre': cuenta.nombre,
          'Tipo': cuenta.tipo,
          'Nivel': cuenta.nivel,
          'Saldo Anterior': cuenta.saldoAnterior,
          'Total Debe': totales.totalDebe,
          'Total Haber': totales.totalHaber,
          'Saldo Final': totales.saldoFinal,
          'Desbalanceada': totales.desbalanceada ? 'SÍ' : 'NO'
        };
      });
      
      const worksheet = XLSX.utils.json_to_sheet(balanceData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Balance Comprobación');
      
      // Hoja de totales
      const totales = calcularTotalesGenerales();
      const totalesData = [
        { 'Concepto': 'Total Debe', 'Monto': totales.totalDebe },
        { 'Concepto': 'Total Haber', 'Monto': totales.totalHaber },
        { 'Concepto': 'Diferencia', 'Monto': totales.totalDebe - totales.totalHaber },
        { 'Concepto': 'Total Saldo Anterior', 'Monto': totales.totalSaldoAnterior },
        { 'Concepto': 'Total Saldo Final', 'Monto': totales.totalSaldoFinal }
      ];
      
      const worksheetTotales = XLSX.utils.json_to_sheet(totalesData);
      XLSX.utils.book_append_sheet(workbook, worksheetTotales, 'Totales');
      
      // Generar archivo
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      const nombreArchivo = `balance_comprobacion_${fechaInicio || 'inicio'}_${fechaFin || 'fin'}_${new Date().toISOString().split('T')[0]}.xlsx`;
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

  // Exportar a CSV
  const exportarACSV = () => {
    if (cuentasFiltradas.length === 0) {
      alert('❌ No hay datos para exportar.');
      return;
    }
    
    try {
      const csvContent = [
        ['Código', 'Nombre', 'Tipo', 'Nivel', 'Saldo Anterior', 'Total Debe', 'Total Haber', 'Saldo Final', 'Desbalanceada'],
        ...cuentasFiltradas.map(cuenta => {
          const totales = calcularTotalesCuenta(cuenta);
          return [
            cuenta.codigo,
            cuenta.nombre,
            cuenta.tipo,
            cuenta.nivel,
            cuenta.saldoAnterior,
            totales.totalDebe,
            totales.totalHaber,
            totales.saldoFinal,
            totales.desbalanceada ? 'SÍ' : 'NO'
          ];
        })
      ].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const nombreArchivo = `balance_comprobacion_${fechaInicio || 'inicio'}_${fechaFin || 'fin'}_${new Date().toISOString().split('T')[0]}.csv`;
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

  // Exportar a PDF
  const exportarAPDF = () => {
    if (cuentasFiltradas.length === 0) {
      alert('❌ No hay datos para exportar.');
      return;
    }
    
    try {
      const totales = calcularTotalesGenerales();
      
      // Crear contenido HTML para el PDF
      const contenidoHTML = `
        <html>
          <head>
            <title>Balance de Comprobación</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .filtros-info { margin-bottom: 20px; background-color: #f9f9f9; padding: 10px; border-radius: 5px; }
              .totales { margin-bottom: 20px; background-color: #e8f4fd; padding: 15px; border-radius: 5px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .desbalanceada { background-color: #ffe6e6; }
              .tipo-activo { background-color: #e6f3ff; }
              .tipo-pasivo { background-color: #fff2e6; }
              .tipo-patrimonio { background-color: #f0f8e6; }
              .tipo-ingreso { background-color: #f8f0e6; }
              .tipo-gasto { background-color: #ffe6f0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Balance de Comprobación</h1>
              <h2>Mega Delicias</h2>
              <p>Fecha de exportación: ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${fechaInicio || fechaFin ? `
            <div class="filtros-info">
              <p><strong>Filtros Aplicados:</strong></p>
              ${fechaInicio ? `<p>Fecha Inicio: ${fechaInicio}</p>` : ''}
              ${fechaFin ? `<p>Fecha Fin: ${fechaFin}</p>` : ''}
            </div>
            ` : ''}
            
            <div class="totales">
              <h3>Totales Generales</h3>
              <p><strong>Total Debe:</strong> $${totales.totalDebe.toFixed(2)}</p>
              <p><strong>Total Haber:</strong> $${totales.totalHaber.toFixed(2)}</p>
              <p><strong>Diferencia:</strong> $${(totales.totalDebe - totales.totalHaber).toFixed(2)}</p>
              <p><strong>Total Saldo Anterior:</strong> $${totales.totalSaldoAnterior.toFixed(2)}</p>
              <p><strong>Total Saldo Final:</strong> $${totales.totalSaldoFinal.toFixed(2)}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Nivel</th>
                  <th>Saldo Anterior</th>
                  <th>Total Debe</th>
                  <th>Total Haber</th>
                  <th>Saldo Final</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${cuentasFiltradas.map(cuenta => {
                  const totales = calcularTotalesCuenta(cuenta);
                  const claseTipo = `tipo-${cuenta.tipo}`;
                  const claseDesbalanceada = totales.desbalanceada ? 'desbalanceada' : '';
                  return `
                    <tr class="${claseTipo} ${claseDesbalanceada}">
                      <td>${cuenta.codigo}</td>
                      <td>${cuenta.nombre}</td>
                      <td>${cuenta.tipo}</td>
                      <td>${cuenta.nivel}</td>
                      <td>$${cuenta.saldoAnterior.toFixed(2)}</td>
                      <td>$${totales.totalDebe.toFixed(2)}</td>
                      <td>$${totales.totalHaber.toFixed(2)}</td>
                      <td>$${totales.saldoFinal.toFixed(2)}</td>
                      <td>${totales.desbalanceada ? 'DESBALANCEADA' : 'BALANCEADA'}</td>
                    </tr>
                  `;
                }).join('')}
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

  const volverAContabilidad = () => {
    navigate('/contabilidad');
  };

  const totales = calcularTotalesGenerales();
  const diferencia = totales.totalDebe - totales.totalHaber;
  const balanceado = Math.abs(diferencia) < 0.01;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100">
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
            <FaBalanceScale className="inline mr-2 text-cyan-600" />
            Balance de Comprobación
          </h1>
        </div>
      </div>

      {/* Panel de Filtros */}
      <div className="bg-white mx-6 mt-6 p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Filtros y Configuración</h2>
          <div className="flex space-x-2">
            <button
              onClick={limpiarFiltros}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Cuenta
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={filtroCuenta}
                onChange={(e) => setFiltroCuenta(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="Código o nombre..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar Por
            </label>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="codigo">Código</option>
              <option value="nombre">Nombre</option>
              <option value="debe">Total Debe</option>
              <option value="haber">Total Haber</option>
              <option value="saldo">Saldo Final</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={mostrarSoloDesbalanceadas}
                onChange={(e) => setMostrarSoloDesbalanceadas(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Solo cuentas desbalanceadas</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden
            </label>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <div>Total cuentas: {cuentasFiltradas.length}</div>
              <div>Filtradas: {cuentasFiltradas.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Totales */}
      <div className="bg-white mx-6 mt-4 p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Totales Generales</h3>
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
              <FaPrint size={14} />
              <span>PDF</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Debe</div>
            <div className="text-xl font-bold text-blue-800">${totales.totalDebe.toFixed(2)}</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Total Haber</div>
            <div className="text-xl font-bold text-green-800">${totales.totalHaber.toFixed(2)}</div>
          </div>
          
          <div className={`p-3 rounded-lg ${balanceado ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`text-sm font-medium ${balanceado ? 'text-green-600' : 'text-red-600'}`}>
              Diferencia
            </div>
            <div className={`text-xl font-bold ${balanceado ? 'text-green-800' : 'text-red-800'}`}>
              ${diferencia.toFixed(2)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">Saldo Anterior</div>
            <div className="text-xl font-bold text-gray-800">${totales.totalSaldoAnterior.toFixed(2)}</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Saldo Final</div>
            <div className="text-xl font-bold text-purple-800">${totales.totalSaldoFinal.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            {balanceado ? (
              <FaCheckCircle className="text-green-600" size={20} />
            ) : (
              <FaExclamationTriangle className="text-red-600" size={20} />
            )}
            <span className={`font-medium ${balanceado ? 'text-green-800' : 'text-red-800'}`}>
              {balanceado ? '✅ Balance de Comprobación CORRECTO' : '❌ Balance de Comprobación DESBALANCEADO'}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {balanceado 
              ? 'Los totales de debe y haber están balanceados correctamente.'
              : `Hay una diferencia de $${Math.abs(diferencia).toFixed(2)} entre debe y haber.`
            }
          </div>
        </div>
      </div>

      {/* Tabla de Cuentas */}
      <div className="mx-6 mt-4 mb-6">
        {cuentasFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaBalanceScale className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No hay cuentas que coincidan</h3>
            <p className="text-gray-600">Ajusta los filtros para ver las cuentas contables.</p>
            <div className="mt-4">
              <button
                onClick={limpiarFiltros}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nivel
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo Anterior
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Debe
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Haber
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo Final
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cuentasFiltradas.map((cuenta) => {
                    const totales = calcularTotalesCuenta(cuenta);
                    const esDesbalanceada = totales.desbalanceada;
                    
                    return (
                      <tr 
                        key={cuenta.codigo}
                        className={`hover:bg-gray-50 ${
                          esDesbalanceada ? 'bg-red-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {cuenta.codigo}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {'　'.repeat(cuenta.nivel - 1)}{cuenta.nombre}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            cuenta.tipo === 'activo' ? 'bg-blue-100 text-blue-800' :
                            cuenta.tipo === 'pasivo' ? 'bg-orange-100 text-orange-800' :
                            cuenta.tipo === 'patrimonio' ? 'bg-green-100 text-green-800' :
                            cuenta.tipo === 'ingreso' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {cuenta.tipo.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {cuenta.nivel}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                          ${cuenta.saldoAnterior.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                          ${totales.totalDebe.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                          ${totales.totalHaber.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                          ${totales.saldoFinal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          {esDesbalanceada ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              <FaExclamationTriangle className="mr-1" size={10} />
                              DESBALANCEADA
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              <FaCheckCircle className="mr-1" size={10} />
                              BALANCEADA
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 