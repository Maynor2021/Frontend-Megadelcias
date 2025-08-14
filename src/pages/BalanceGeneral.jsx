// src/pages/BalanceGeneral.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, 
  FaFilePdf, 
  FaFilter, 
  FaPrint, 
  FaChartBar,
  FaBuilding,
  FaMoneyBillWave,
  FaReceipt,
  FaSpinner,
  FaBalanceScale,
  FaCalculator,
  FaFileExcel,
  FaFileCsv
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BalanceGeneralPDF from '../components/BalanceGeneralPDF';
import logo from '../assets/logo-megadelicias.jpg';
import axios from 'axios';
import { exportToCSV, exportToExcelBasic } from '../utils/exportUtilsSimple';

const API_BASE_URL = 'http://localhost:4000/api';

export default function BalanceGeneral() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState('mensual');
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balanceGeneral, setBalanceGeneral] = useState({
    activos: {
      circulantes: {
        efectivo: 0,
        cuentasPorCobrar: 0,
        inventarios: 0,
        otrosActivosCirculantes: 0,
        totalCirculantes: 0
      },
      noCirculantes: {
        equipos: 0,
        mobiliario: 0,
        edificios: 0,
        otrosActivosFijos: 0,
        totalNoCirculantes: 0
      },
      totalActivos: 0
    },
    pasivos: {
      circulantes: {
        cuentasPorPagar: 0,
        prestamosCortoPlazo: 0,
        impuestosPorPagar: 0,
        otrosPasivosCirculantes: 0,
        totalCirculantes: 0
      },
      noCirculantes: {
        prestamosLargoPlazo: 0,
        hipotecas: 0,
        otrosPasivosLargoPlazo: 0,
        totalNoCirculantes: 0
      },
      totalPasivos: 0
    },
    patrimonio: {
      capitalSocial: 0,
      utilidadesRetenidas: 0,
      utilidadDelEjercicio: 0,
      totalPatrimonio: 0
    },
    periodo: '',
    fechaGeneracion: new Date().toISOString()
  });

  // Función para procesar los datos de la API
  const procesarDatosAPI = (dataArray) => {
    console.log('Datos recibidos del backend para Balance General:', dataArray);
    
    const resultado = {
      activos: {
        circulantes: {
          efectivo: 0,
          cuentasPorCobrar: 0,
          inventarios: 0,
          otrosActivosCirculantes: 0,
          totalCirculantes: 0
        },
        noCirculantes: {
          equipos: 0,
          mobiliario: 0,
          edificios: 0,
          otrosActivosFijos: 0,
          totalNoCirculantes: 0
        },
        totalActivos: 0
      },
      pasivos: {
        circulantes: {
          cuentasPorPagar: 0,
          prestamosCortoPlazo: 0,
          impuestosPorPagar: 0,
          otrosPasivosCirculantes: 0,
          totalCirculantes: 0
        },
        noCirculantes: {
          prestamosLargoPlazo: 0,
          hipotecas: 0,
          otrosPasivosLargoPlazo: 0,
          totalNoCirculantes: 0
        },
        totalPasivos: 0
      },
      patrimonio: {
        capitalSocial: 0,
        utilidadesRetenidas: 0,
        utilidadDelEjercicio: 0,
        totalPatrimonio: 0
      },
      periodo: periodo,
      fechaGeneracion: new Date().toISOString(),
      detalles: [],
      datosOriginales: dataArray
    };

    // Organizar los datos por sección y ordenar
    const datosPorSeccion = {};
    
    dataArray.forEach(cuenta => {
      const { Seccion, CodigoCuenta, NombreCuenta, Monto, Orden, Fecha, Tipo } = cuenta;
      
      const montoNumerico = Number(Monto) || 0;
      
      if (!datosPorSeccion[Seccion]) {
        datosPorSeccion[Seccion] = [];
      }
      
      datosPorSeccion[Seccion].push({
        codigo: CodigoCuenta,
        nombre: NombreCuenta,
        monto: montoNumerico,
        orden: Orden,
        fecha: Fecha,
        tipo: Tipo
      });
      
      // Clasificar montos por sección y tipo de cuenta
      switch (Seccion.toUpperCase()) {
        case 'ACTIVOS':
        case 'ACTIVO':
          if (Tipo === 'CIRCULANTE' || CodigoCuenta.startsWith('1')) {
            if (CodigoCuenta.startsWith('11') || NombreCuenta.toLowerCase().includes('efectivo')) {
              resultado.activos.circulantes.efectivo += montoNumerico;
            } else if (CodigoCuenta.startsWith('12') || NombreCuenta.toLowerCase().includes('cobrar')) {
              resultado.activos.circulantes.cuentasPorCobrar += montoNumerico;
            } else if (CodigoCuenta.startsWith('13') || NombreCuenta.toLowerCase().includes('inventario')) {
              resultado.activos.circulantes.inventarios += montoNumerico;
            } else {
              resultado.activos.circulantes.otrosActivosCirculantes += montoNumerico;
            }
          } else {
            if (CodigoCuenta.startsWith('15') || NombreCuenta.toLowerCase().includes('equipo')) {
              resultado.activos.noCirculantes.equipos += montoNumerico;
            } else if (CodigoCuenta.startsWith('16') || NombreCuenta.toLowerCase().includes('mobiliario')) {
              resultado.activos.noCirculantes.mobiliario += montoNumerico;
            } else if (CodigoCuenta.startsWith('17') || NombreCuenta.toLowerCase().includes('edificio')) {
              resultado.activos.noCirculantes.edificios += montoNumerico;
            } else {
              resultado.activos.noCirculantes.otrosActivosFijos += montoNumerico;
            }
          }
          break;
          
        case 'PASIVOS':
        case 'PASIVO':
          if (Tipo === 'CIRCULANTE' || CodigoCuenta.startsWith('2')) {
            if (CodigoCuenta.startsWith('21') || NombreCuenta.toLowerCase().includes('pagar')) {
              resultado.pasivos.circulantes.cuentasPorPagar += montoNumerico;
            } else if (CodigoCuenta.startsWith('22') || NombreCuenta.toLowerCase().includes('prestamo')) {
              resultado.pasivos.circulantes.prestamosCortoPlazo += montoNumerico;
            } else if (CodigoCuenta.startsWith('23') || NombreCuenta.toLowerCase().includes('impuesto')) {
              resultado.pasivos.circulantes.impuestosPorPagar += montoNumerico;
            } else {
              resultado.pasivos.circulantes.otrosPasivosCirculantes += montoNumerico;
            }
          } else {
            if (CodigoCuenta.startsWith('25') || NombreCuenta.toLowerCase().includes('prestamo')) {
              resultado.pasivos.noCirculantes.prestamosLargoPlazo += montoNumerico;
            } else if (CodigoCuenta.startsWith('26') || NombreCuenta.toLowerCase().includes('hipoteca')) {
              resultado.pasivos.noCirculantes.hipotecas += montoNumerico;
            } else {
              resultado.pasivos.noCirculantes.otrosPasivosLargoPlazo += montoNumerico;
            }
          }
          break;
          
        case 'PATRIMONIO':
        case 'CAPITAL':
          if (CodigoCuenta.startsWith('31') || NombreCuenta.toLowerCase().includes('capital')) {
            resultado.patrimonio.capitalSocial += montoNumerico;
          } else if (CodigoCuenta.startsWith('32') || NombreCuenta.toLowerCase().includes('utilidad')) {
            resultado.patrimonio.utilidadesRetenidas += montoNumerico;
          } else if (CodigoCuenta.startsWith('33') || NombreCuenta.toLowerCase().includes('ejercicio')) {
            resultado.patrimonio.utilidadDelEjercicio += montoNumerico;
          }
          break;
          
        default:
          console.warn(`Sección no reconocida: ${Seccion}`);
      }
    });

    // Ordenar los datos de cada sección por el campo Orden
    Object.keys(datosPorSeccion).forEach(seccion => {
      datosPorSeccion[seccion].sort((a, b) => a.orden - b.orden);
    });
    
    resultado.detalles = datosPorSeccion;

    // Calcular totales
    resultado.activos.circulantes.totalCirculantes = 
      resultado.activos.circulantes.efectivo + 
      resultado.activos.circulantes.cuentasPorCobrar + 
      resultado.activos.circulantes.inventarios + 
      resultado.activos.circulantes.otrosActivosCirculantes;
    
    resultado.activos.noCirculantes.totalNoCirculantes = 
      resultado.activos.noCirculantes.equipos + 
      resultado.activos.noCirculantes.mobiliario + 
      resultado.activos.noCirculantes.edificios + 
      resultado.activos.noCirculantes.otrosActivosFijos;
    
    resultado.activos.totalActivos = 
      resultado.activos.circulantes.totalCirculantes + 
      resultado.activos.noCirculantes.totalNoCirculantes;
    
    resultado.pasivos.circulantes.totalCirculantes = 
      resultado.pasivos.circulantes.cuentasPorPagar + 
      resultado.pasivos.circulantes.prestamosCortoPlazo + 
      resultado.pasivos.circulantes.impuestosPorPagar + 
      resultado.pasivos.circulantes.otrosPasivosCirculantes;
    
    resultado.pasivos.noCirculantes.totalNoCirculantes = 
      resultado.pasivos.noCirculantes.prestamosLargoPlazo + 
      resultado.pasivos.noCirculantes.hipotecas + 
      resultado.pasivos.noCirculantes.otrosPasivosLargoPlazo;
    
    resultado.pasivos.totalPasivos = 
      resultado.pasivos.circulantes.totalCirculantes + 
      resultado.pasivos.noCirculantes.totalNoCirculantes;
    
    resultado.patrimonio.totalPatrimonio = 
      resultado.patrimonio.capitalSocial + 
      resultado.patrimonio.utilidadesRetenidas + 
      resultado.patrimonio.utilidadDelEjercicio;

    console.log('Balance General procesado:', resultado);
    return resultado;
  };

  // Función principal para cargar datos
  const cargarBalanceGeneral = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let fechaInicio, fechaFin;
      
      if (periodo === 'personalizado' || filtros.fechaInicio || filtros.fechaFin) {
        fechaInicio = filtros.fechaInicio || '2024-01-01';
        fechaFin = filtros.fechaFin || new Date().toISOString().split('T')[0];
      } else {
        const hoy = new Date();
        let primerDia;
        
        switch (periodo) {
          case 'diario':
            primerDia = new Date(hoy);
            break;
          case 'semanal': {
            const diasSemana = hoy.getDay();
            const diasDesdeLunes = diasSemana === 0 ? 6 : diasSemana - 1;
            primerDia = new Date(hoy);
            primerDia.setDate(hoy.getDate() - diasDesdeLunes);
            break;
          }
          case 'mensual':
            primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            break;
          case 'anual':
            primerDia = new Date(hoy.getFullYear(), 0, 1);
            break;
          default:
            primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        }
        
        fechaInicio = primerDia.toISOString().split('T')[0];
        fechaFin = hoy.toISOString().split('T')[0];
      }
      
      console.log('Solicitando Balance General con fechas:', { fechaInicio, fechaFin });
      
      const resp = await axios.get(`${API_BASE_URL}/contabilidad/balance-general`, {
        params: { fechaInicio, fechaFin },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 10000
      });

      if (resp.data && resp.data.success && Array.isArray(resp.data.data)) {
        if (resp.data.data.length === 0) {
          setError('No se encontraron datos para el período seleccionado');
          const datosEjemplo = crearDatosEjemplo();
          setBalanceGeneral(procesarDatosAPI(datosEjemplo));
        } else {
          setBalanceGeneral(procesarDatosAPI(resp.data.data));
        }
      } else {
        throw new Error(resp.data?.message || 'Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al cargar Balance General:', error);
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError('No se puede conectar con el servidor. Verificar que el backend esté ejecutándose.');
      } else if (error.code === 'ECONNABORTED') {
        setError('Tiempo de espera agotado. El servidor no responde.');
      } else if (error.response?.status === 404) {
        setError('Endpoint no encontrado. Verificar que la ruta del backend sea correcta.');
      } else if (error.response?.status === 401) {
        setError('No autorizado. Verificar el token de autenticación.');
      } else {
        setError(error.response?.data?.message || error.message || 'Error al cargar el Balance General');
      }
      
      const datosEjemplo = crearDatosEjemplo();
      setBalanceGeneral(procesarDatosAPI(datosEjemplo));
    } finally {
      setLoading(false);
    }
  };
  
  // Función para crear datos de ejemplo
  const crearDatosEjemplo = () => {
    return [
      {
        "Seccion": "ACTIVOS",
        "Orden": 1,
        "CodigoCuenta": "1000",
        "NombreCuenta": "ACTIVOS",
        "Fecha": "2025-01-20T00:00:00.000Z",
        "Monto": 0,
        "Tipo": "CIRCULANTE"
      },
      {
        "Seccion": "ACTIVOS",
        "Orden": 2,
        "CodigoCuenta": "1100",
        "NombreCuenta": "Efectivo y Equivalentes",
        "Fecha": "2025-01-20T00:00:00.000Z",
        "Monto": 5000,
        "Tipo": "CIRCULANTE"
      },
      {
        "Seccion": "ACTIVOS",
        "Orden": 3,
        "CodigoCuenta": "1200",
        "NombreCuenta": "Cuentas por Cobrar",
        "Fecha": "2025-01-20T00:00:00.000Z",
        "Monto": 2500,
        "Tipo": "CIRCULANTE"
      },
      {
        "Seccion": "ACTIVOS",
        "Orden": 4,
        "CodigoCuenta": "1300",
        "NombreCuenta": "Inventarios",
        "Fecha": "2025-01-20T00:00:00.000Z",
        "Monto": 8000,
        "Tipo": "CIRCULANTE"
      },
      {
        "Seccion": "ACTIVOS",
        "Orden": 5,
        "CodigoCuenta": "1500",
        "NombreCuenta": "Equipos y Maquinaria",
        "Fecha": "2025-01-20T00:00:00.000Z",
        "Monto": 15000,
        "Tipo": "NO_CIRCULANTE"
      },
      {
        "Seccion": "PASIVOS",
        "Orden": 1,
        "CodigoCuenta": "2000",
        "NombreCuenta": "PASIVOS",
        "Fecha": "2025-01-20T00:00:00.000Z",
        "Monto": 0,
        "Tipo": "CIRCULANTE"
      },
      {
        "Seccion": "PASIVOS",
        "Orden": 2,
        "CodigoCuenta": "2100",
        "NombreCuenta": "Cuentas por Pagar",
        "Fecha": "2025-01-20T00:00:00.000Z",
        "Monto": 3000,
        "Tipo": "CIRCULANTE"
      },
      {
        "Seccion": "PATRIMONIO",
        "Orden": 1,
        "CodigoCuenta": "3000",
        "NombreCuenta": "PATRIMONIO",
        "Fecha": "2025-01-20T00:00:00.000Z",
        "Monto": 0,
        "Tipo": "CAPITAL"
      },
      {
        "Seccion": "PATRIMONIO",
        "Orden": 2,
        "CodigoCuenta": "3100",
        "NombreCuenta": "Capital Social",
        "Fecha": "2025-01-20T00:00:00.000Z",
        "Monto": 20000,
        "Tipo": "CAPITAL"
      }
    ];
  };

  useEffect(() => {
    cargarBalanceGeneral();
  }, [filtros.fechaInicio, filtros.fechaFin]);

  useEffect(() => {
    const hoy = new Date();
    const primerDiaDelAño = new Date(hoy.getFullYear(), 0, 1);
    
    if (!filtros.fechaInicio && !filtros.fechaFin) {
      setFiltros({
        fechaInicio: '2024-01-01',
        fechaFin: hoy.toISOString().split('T')[0]
      });
    }
  }, []);

  const volverAContabilidad = () => {
    navigate('/contabilidad');
  };

  const aplicarFiltros = () => {
    cargarBalanceGeneral();
  };

  const imprimirReporte = () => {
    window.print();
  };

  const exportarExcel = () => {
    const fileName = `balance_general_${new Date().toISOString().split('T')[0]}`;
    const success = exportToExcelBasic(balanceGeneral, fileName);
    
    if (success) {
      alert('✅ Balance General exportado a Excel exitosamente');
    } else {
      alert('❌ Error al exportar a Excel');
    }
  };

  const exportarCSV = () => {
    const fileName = `balance_general_${new Date().toISOString().split('T')[0]}`;
    const success = exportToCSV(balanceGeneral, fileName);
    
    if (success) {
      alert('✅ Balance General exportado a CSV exitosamente');
    } else {
      alert('❌ Error al exportar a CSV');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
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
              <FaBalanceScale className="inline mr-2 text-blue-600" />
              Balance General
            </h1>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaFilter className="mr-2 text-blue-500" />
            Filtros del Reporte
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
                <option value="anual">Anual</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Seleccionar fecha inicio"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Seleccionar fecha fin"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={aplicarFiltros}
                disabled={loading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <FaFilter className="mr-2" />
                    Aplicar Filtros
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error} - Mostrando datos de ejemplo para desarrollo
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Balance General */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Balance General
              </h2>
              <p className="text-gray-600">
                Período: {balanceGeneral.periodo || 'No especificado'} | 
                Generado: {new Date(balanceGeneral.fechaGeneracion).toLocaleDateString()}
              </p>
            </div>
            
            {/* Botones de exportación */}
            <div className="flex space-x-3">
              <PDFDownloadLink
                document={<BalanceGeneralPDF data={balanceGeneral} />}
                fileName={`balance_general_${new Date().toISOString().split('T')[0]}.pdf`}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaFilePdf className="mr-2" />
                Exportar PDF
              </PDFDownloadLink>
              
              <button
                onClick={exportarExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaFileExcel className="mr-2" />
                Exportar Excel
              </button>
              
              <button
                onClick={exportarCSV}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaFileCsv className="mr-2" />
                Exportar CSV
              </button>
              
              <button
                onClick={imprimirReporte}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaPrint className="mr-2" />
                Imprimir
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna Izquierda - Activos */}
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                  <FaBuilding className="mr-2" />
                  ACTIVOS
                </h3>
                
                {/* Activos Circulantes */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-blue-700 mb-3">Activos Circulantes</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Efectivo y Equivalentes</span>
                      <span className="text-sm font-bold">${balanceGeneral.activos.circulantes.efectivo.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">Cuentas por Cobrar</span>
                      <span className="text-sm">${balanceGeneral.activos.circulantes.cuentasPorCobrar.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Inventarios</span>
                      <span className="text-sm">${balanceGeneral.activos.circulantes.inventarios.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">Otros Activos Circulantes</span>
                      <span className="text-sm">${balanceGeneral.activos.circulantes.otrosActivosCirculantes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-100 rounded border-t-2 border-blue-300">
                      <span className="font-bold text-blue-800">Total Activos Circulantes</span>
                      <span className="font-bold text-blue-800">${balanceGeneral.activos.circulantes.totalCirculantes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Activos No Circulantes */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-blue-700 mb-3">Activos No Circulantes</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Equipos y Maquinaria</span>
                      <span className="text-sm">${balanceGeneral.activos.noCirculantes.equipos.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">Mobiliario y Enseres</span>
                      <span className="text-sm">${balanceGeneral.activos.noCirculantes.mobiliario.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Edificios</span>
                      <span className="text-sm">${balanceGeneral.activos.noCirculantes.edificios.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">Otros Activos Fijos</span>
                      <span className="text-sm">${balanceGeneral.activos.noCirculantes.otrosActivosFijos.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-100 rounded border-t-2 border-blue-300">
                      <span className="font-bold text-blue-800">Total Activos No Circulantes</span>
                      <span className="font-bold text-blue-800">${balanceGeneral.activos.noCirculantes.totalNoCirculantes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Total Activos */}
                <div className="p-4 bg-blue-200 rounded border-2 border-blue-400">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-900">TOTAL ACTIVOS</span>
                    <span className="text-xl font-bold text-blue-900">${balanceGeneral.activos.totalActivos.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Pasivos y Patrimonio */}
              <div>
                {/* Pasivos */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                    <FaReceipt className="mr-2" />
                    PASIVOS
                  </h3>
                  
                  {/* Pasivos Circulantes */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-red-700 mb-3">Pasivos Circulantes</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm">Cuentas por Pagar</span>
                        <span className="text-sm">${balanceGeneral.pasivos.circulantes.cuentasPorPagar.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Préstamos a Corto Plazo</span>
                        <span className="text-sm">${balanceGeneral.pasivos.circulantes.prestamosCortoPlazo.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm">Impuestos por Pagar</span>
                        <span className="text-sm">${balanceGeneral.pasivos.circulantes.impuestosPorPagar.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Otros Pasivos Circulantes</span>
                        <span className="text-sm">${balanceGeneral.pasivos.circulantes.otrosPasivosCirculantes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-100 rounded border-t-2 border-red-300">
                        <span className="font-bold text-red-800">Total Pasivos Circulantes</span>
                        <span className="font-bold text-red-800">${balanceGeneral.pasivos.circulantes.totalCirculantes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pasivos No Circulantes */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-red-700 mb-3">Pasivos No Circulantes</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm">Préstamos a Largo Plazo</span>
                        <span className="text-sm">${balanceGeneral.pasivos.noCirculantes.prestamosLargoPlazo.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Hipotecas</span>
                        <span className="text-sm">${balanceGeneral.pasivos.noCirculantes.hipotecas.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm">Otros Pasivos Largo Plazo</span>
                        <span className="text-sm">${balanceGeneral.pasivos.noCirculantes.otrosPasivosLargoPlazo.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-100 rounded border-t-2 border-red-300">
                        <span className="font-bold text-red-800">Total Pasivos No Circulantes</span>
                        <span className="font-bold text-red-800">${balanceGeneral.pasivos.noCirculantes.totalNoCirculantes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Pasivos */}
                  <div className="p-3 bg-red-200 rounded border-2 border-red-400 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-red-900">TOTAL PASIVOS</span>
                      <span className="text-lg font-bold text-red-900">${balanceGeneral.pasivos.totalPasivos.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Patrimonio */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <FaMoneyBillWave className="mr-2" />
                    PATRIMONIO
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Capital Social</span>
                      <span className="text-sm">${balanceGeneral.patrimonio.capitalSocial.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">Utilidades Retenidas</span>
                      <span className="text-sm">${balanceGeneral.patrimonio.utilidadesRetenidas.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Utilidad del Ejercicio</span>
                      <span className="text-sm">${balanceGeneral.patrimonio.utilidadDelEjercicio.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-100 rounded border-t-2 border-green-300">
                      <span className="font-bold text-green-800">TOTAL PATRIMONIO</span>
                      <span className="font-bold text-green-800">${balanceGeneral.patrimonio.totalPatrimonio.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Ecuación Contable */}
                <div className="p-4 bg-yellow-100 rounded border-2 border-yellow-400">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-yellow-800 mb-2">Ecuación Contable</h4>
                    <div className="text-sm text-yellow-700">
                      <p>ACTIVOS = PASIVOS + PATRIMONIO</p>
                      <p className="font-bold mt-1">
                        ${balanceGeneral.activos.totalActivos.toLocaleString()} = ${balanceGeneral.pasivos.totalPasivos.toLocaleString()} + ${balanceGeneral.patrimonio.totalPatrimonio.toLocaleString()}
                      </p>
                      <p className={`mt-2 font-bold ${Math.abs(balanceGeneral.activos.totalActivos - (balanceGeneral.pasivos.totalPasivos + balanceGeneral.patrimonio.totalPatrimonio)) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(balanceGeneral.activos.totalActivos - (balanceGeneral.pasivos.totalPasivos + balanceGeneral.patrimonio.totalPatrimonio)) < 0.01 ? '✓ BALANCEADO' : '✗ NO BALANCEADO'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detalle de Cuentas */}
        {balanceGeneral.datosOriginales && balanceGeneral.datosOriginales.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Detalle de Cuentas
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sección
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre de Cuenta
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto ($)
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {balanceGeneral.datosOriginales
                    .sort((a, b) => a.Orden - b.Orden)
                    .map((cuenta, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cuenta.Seccion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cuenta.CodigoCuenta}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {cuenta.NombreCuenta}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                          ${Number(cuenta.Monto).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                          {cuenta.Tipo || 'N/A'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notas adicionales */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Nota:</strong> Los datos mostrados son con fines ilustrativos. Para reportes oficiales, verifique con su contador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 