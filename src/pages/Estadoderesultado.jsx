import { useState, useEffect } from 'react';
import { 
  FaArrowLeft, 
  FaFilePdf, 
  FaFilter, 
  FaPrint, 
  FaChartBar,
  FaMoneyBillWave,
  FaReceipt,
  FaSpinner
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import EstadoResultadosPDF from '../components/EstadoResultadosPDF';
import logo from '../assets/logo-megadelicias.jpg';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export default function EstadoResultados() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState('mensual');
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estadoResultados, setEstadoResultados] = useState({
    ingresos: {
      ventas: 0,
      otrosIngresos: 0,
      totalIngresos: 0
    },
    costos: {
      costoVentas: 0,
      totalCostos: 0
    },
    gastos: {
      operativos: 0,
      administrativos: 0,
      ventas: 0,
      financieros: 0,
      totalGastos: 0
    },
    utilidad: {
      bruta: 0,
      operativa: 0,
      neta: 0
    },
    periodo: '',
    fechaGeneracion: new Date().toISOString()
  });

  // Función para procesar los datos de la API
  const procesarDatosAPI = (dataArray) => {
    console.log('Datos recibidos del backend:', dataArray);
    
    const resultado = {
      ingresos: {
        ventas: 0,
        otrosIngresos: 0,
        totalIngresos: 0
      },
      costos: {
        costoVentas: 0,
        totalCostos: 0
      },
      gastos: {
        operativos: 0,
        administrativos: 0,
        ventas: 0,
        financieros: 0,
        totalGastos: 0
      },
      utilidad: {
        bruta: 0,
        operativa: 0,
        neta: 0
      },
      periodo: periodo,
      fechaGeneracion: new Date().toISOString(),
      detalles: [], // Agregar array para mostrar los detalles
      datosOriginales: dataArray // Guardar los datos originales del backend
    };

    // Organizar los datos por sección y ordenar
    const datosPorSeccion = {};
    
    dataArray.forEach(cuenta => {
      const { Seccion, CodigoCuenta, NombreCuenta, Monto, Orden, Fecha } = cuenta;
      
      // Asegurar que el monto sea un número
      const montoNumerico = Number(Monto) || 0;
      
      if (!datosPorSeccion[Seccion]) {
        datosPorSeccion[Seccion] = [];
      }
      
      datosPorSeccion[Seccion].push({
        codigo: CodigoCuenta,
        nombre: NombreCuenta,
        monto: montoNumerico,
        orden: Orden,
        fecha: Fecha
      });
      
      // Clasificar montos por sección
      switch (Seccion.toUpperCase()) {
        case 'INGRESOS':
          if (CodigoCuenta.startsWith('41') || 
              NombreCuenta.toLowerCase().includes('ventas') ||
              NombreCuenta.toLowerCase().includes('bebidas') ||
              CodigoCuenta === '4102') {
            resultado.ingresos.ventas += montoNumerico;
          } else {
            resultado.ingresos.otrosIngresos += montoNumerico;
          }
          break;
          
        case 'COSTOS':
        case 'COSTO':
          resultado.costos.costoVentas += montoNumerico;
          break;
          
        case 'GASTOS':
        case 'GASTO':
          // Clasificar gastos por código de cuenta
          if (CodigoCuenta.startsWith('51') || NombreCuenta.toLowerCase().includes('operativo')) {
            resultado.gastos.operativos += montoNumerico;
          } else if (CodigoCuenta.startsWith('52') || NombreCuenta.toLowerCase().includes('administrativo')) {
            resultado.gastos.administrativos += montoNumerico;
          } else if (CodigoCuenta.startsWith('53') || NombreCuenta.toLowerCase().includes('ventas')) {
            resultado.gastos.ventas += montoNumerico;
          } else if (CodigoCuenta.startsWith('54') || NombreCuenta.toLowerCase().includes('financiero')) {
            resultado.gastos.financieros += montoNumerico;
          } else {
            // Si no se puede clasificar específicamente, agregarlo a gastos operativos
            resultado.gastos.operativos += montoNumerico;
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
    resultado.ingresos.totalIngresos = resultado.ingresos.ventas + resultado.ingresos.otrosIngresos;
    resultado.costos.totalCostos = resultado.costos.costoVentas;
    resultado.gastos.totalGastos = resultado.gastos.operativos + resultado.gastos.administrativos + 
                                   resultado.gastos.ventas + resultado.gastos.financieros;
    resultado.utilidad.bruta = resultado.ingresos.totalIngresos - resultado.costos.totalCostos;
    resultado.utilidad.operativa = resultado.utilidad.bruta - resultado.gastos.totalGastos;
    resultado.utilidad.neta = resultado.utilidad.operativa;

    console.log('Resultado procesado:', resultado);
    return resultado;
  };

  // Función principal para cargar datos
  const CargarEstadoDeResultado = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let fechaInicio, fechaFin;
      
      // Configurar fechas según el período seleccionado o usar las fechas personalizadas
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
      
      console.log('Solicitando datos con fechas:', { fechaInicio, fechaFin });
      console.log('URL completa:', `${API_BASE_URL}/contabilidad/estado-resultados`);
      
      const resp = await axios.get(`${API_BASE_URL}/contabilidad/estado-resultados`, {
        params: { fechaInicio, fechaFin },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 10000 // 10 segundos de timeout
      });

      console.log('Respuesta completa del servidor:', resp);
      console.log('Datos de la respuesta:', resp.data);
      console.log('¿resp.data existe?', !!resp.data);
      console.log('¿resp.data.success existe?', !!resp.data?.success);
      console.log('¿resp.data.data es array?', Array.isArray(resp.data?.data));
      console.log('Longitud de resp.data.data:', resp.data?.data?.length);

      if (resp.data && resp.data.success && Array.isArray(resp.data.data)) {
        if (resp.data.data.length === 0) {
          console.log('No se encontraron datos, usando datos de ejemplo');
          setError('No se encontraron datos para el período seleccionado');
          // Usar datos de ejemplo cuando no hay datos
          const datosEjemplo = crearDatosEjemplo();
          setEstadoResultados(procesarDatosAPI(datosEjemplo));
        } else {
          console.log('Datos encontrados, procesando datos reales del backend');
          console.log('Primer elemento de datos:', resp.data.data[0]);
          setEstadoResultados(procesarDatosAPI(resp.data.data));
        }
      } else {
        console.error('Respuesta inesperada del servidor:', resp.data);
        console.error('Estructura esperada vs recibida:', {
          esperado: { success: true, data: [] },
          recibido: { success: resp.data?.success, data: resp.data?.data }
        });
        throw new Error(resp.data?.message || 'Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error completo al cargar estado de resultados:', error);
      console.error('Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError('No se puede conectar con el servidor. Verificar que el backend esté ejecutándose.');
      } else if (error.code === 'ECONNABORTED') {
        setError('Tiempo de espera agotado. El servidor no responde.');
      } else if (error.response?.status === 404) {
        setError('Endpoint no encontrado. Verificar que la ruta del backend sea correcta.');
      } else if (error.response?.status === 401) {
        setError('No autorizado. Verificar el token de autenticación.');
      } else {
        setError(error.response?.data?.message || error.message || 'Error al cargar el estado de resultados');
      }
      
      // Siempre mostrar datos de ejemplo en caso de error para poder probar la interfaz
      console.log('Mostrando datos de ejemplo debido al error');
      const datosEjemplo = crearDatosEjemplo();
      setEstadoResultados(procesarDatosAPI(datosEjemplo));
    } finally {
      setLoading(false);
    }
  };
  
  // Función para crear datos de ejemplo que coincidan con la estructura del backend
  const crearDatosEjemplo = () => {
    return [
      {
        "Seccion": "INGRESOS",
        "Orden": 1,
        "CodigoCuenta": "4000",
        "NombreCuenta": "INGRESOS",
        "Fecha": "2025-07-20T00:00:00.000Z",
        "Monto": 300
      },
      {
        "Seccion": "INGRESOS",
        "Orden": 2,
        "CodigoCuenta": "4102",
        "NombreCuenta": "Ventas de Bebidas",
        "Fecha": "2025-07-20T00:00:00.000Z",
        "Monto": 50
      },
      {
        "Seccion": "INGRESOS",
        "Orden": 3,
        "CodigoCuenta": "4101",
        "NombreCuenta": "Ventas de Comida",
        "Fecha": "2025-07-20T00:00:00.000Z",
        "Monto": 250
      },
      {
        "Seccion": "GASTOS",
        "Orden": 1,
        "CodigoCuenta": "5000",
        "NombreCuenta": "GASTOS",
        "Fecha": "2025-07-20T00:00:00.000Z",
        "Monto": 0
      },
      {
        "Seccion": "GASTOS",
        "Orden": 2,
        "CodigoCuenta": "5100",
        "NombreCuenta": "Gastos Operativos",
        "Fecha": "2025-07-20T00:00:00.000Z",
        "Monto": 150
      },
      {
        "Seccion": "GASTOS",
        "Orden": 3,
        "CodigoCuenta": "5200",
        "NombreCuenta": "Gastos Administrativos",
        "Fecha": "2025-07-20T00:00:00.000Z",
        "Monto": 75
      }
    ];
  };

  // Efecto para cargar datos al inicio y cuando cambien los filtros
  useEffect(() => {
    CargarEstadoDeResultado();
  }, [filtros.fechaInicio, filtros.fechaFin]);

  // Efecto para establecer fechas por defecto al cargar el componente
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
    console.log("Aplicando filtros..."); 
    console.log("Filtros actuales:", filtros);
    CargarEstadoDeResultado();
  };

  const imprimirReporte = () => {
    window.print();
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
              <FaChartBar className="inline mr-2 text-blue-600" />
              Estado de Resultados
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
          
          {/* Información adicional sobre los filtros */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> 
              {periodo === 'personalizado' 
                ? ' Use las fechas personalizadas para definir el período específico del reporte.'
                : ' Las fechas se ajustarán automáticamente según el período seleccionado. Puede modificar las fechas manualmente si lo desea.'
              }
            </p>
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

        {/* Estado de Resultados */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Estado de Resultados
              </h2>
              <p className="text-gray-600">
                Período: {estadoResultados.periodo || 'No especificado'} | 
                Generado: {new Date(estadoResultados.fechaGeneracion).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <PDFDownloadLink
                document={<EstadoResultadosPDF data={estadoResultados} />}
                fileName={`estado_resultados_${new Date().toISOString().split('T')[0]}.pdf`}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaFilePdf className="mr-2" />
                Exportar PDF
              </PDFDownloadLink>
              
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
            <>
              {/* Tabla de Estado de Resultados */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concepto
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Ingresos */}
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                        Ingresos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                        ${estadoResultados.ingresos.totalIngresos.toLocaleString()}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-10 text-gray-700 flex items-center">
                        <FaMoneyBillWave className="mr-2 text-green-500" />
                        Ventas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                        ${estadoResultados.ingresos.ventas.toLocaleString()}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-10 text-gray-700">
                        Otros Ingresos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                        ${estadoResultados.ingresos.otrosIngresos.toLocaleString()}
                      </td>
                    </tr>
                    
                    {/* Costos */}
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                        Costos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                        ${estadoResultados.costos.totalCostos.toLocaleString()}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-10 text-gray-700">
                        Costo de Ventas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                        ${estadoResultados.costos.costoVentas.toLocaleString()}
                      </td>
                    </tr>
                    
                    {/* Utilidad Bruta */}
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-green-800">
                        Utilidad Bruta
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-800">
                        ${estadoResultados.utilidad.bruta.toLocaleString()}
                      </td>
                    </tr>
                    
                    {/* Gastos */}
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                        Gastos Operativos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                        ${estadoResultados.gastos.totalGastos.toLocaleString()}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-10 text-gray-700 flex items-center">
                        <FaReceipt className="mr-2 text-red-500" />
                        Gastos Operativos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                        ${estadoResultados.gastos.operativos.toLocaleString()}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-10 text-gray-700">
                        Gastos Administrativos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                        ${estadoResultados.gastos.administrativos.toLocaleString()}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-10 text-gray-700">
                        Gastos de Ventas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                        ${estadoResultados.gastos.ventas.toLocaleString()}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-10 text-gray-700">
                        Gastos Financieros
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                        ${estadoResultados.gastos.financieros.toLocaleString()}
                      </td>
                    </tr>
                    
                    {/* Utilidad Operativa */}
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-green-800">
                        Utilidad Operativa
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-800">
                        ${estadoResultados.utilidad.operativa.toLocaleString()}
                      </td>
                    </tr>
                    
                    {/* Utilidad Neta */}
                    <tr className="bg-green-100">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-green-900">
                        Utilidad Neta
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-900">
                        ${estadoResultados.utilidad.neta.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Detalle de Cuentas del Backend */}
              {estadoResultados.datosOriginales && estadoResultados.datosOriginales.length > 0 && (
                <div className="mt-8">
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
                            Fecha
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {estadoResultados.datosOriginales
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
                                {new Date(cuenta.Fecha).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

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