import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, 
  FaFilePdf, 
  FaFilter, 
  FaPrint, 
  FaFileExport,
  FaChartBar,
  FaMoneyBillWave,
  FaReceipt,
  FaSpinner
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// import { PDFDownloadLink } from '@react-pdf/renderer';
import EstadoResultadosPDF from '../components/EstadoResultadosPDF';
import logo from '../assets/logo-megadelicias.png';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function EstadoResultados() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState('mensual');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado inicial vacío
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

  // Función para cargar datos del backend
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Construir parámetros según los filtros
      const params = new URLSearchParams();
      if (periodo !== 'personalizado') {
        params.append('periodo', periodo);
      } else {
        params.append('fechaInicio', fechaInicio);
        params.append('fechaFin', fechaFin);
      }

      const response = await fetch(`${API_BASE_URL}/estado-resultados?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos');
      }

      const data = await response.json();
      setEstadoResultados(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
      
      // Datos de ejemplo si hay error (solo para desarrollo)
      if (import.meta.env.DEV) {
        setEstadoResultados({
          ingresos: {
            ventas: 125000,
            otrosIngresos: 2500,
            totalIngresos: 127500
          },
          costos: {
            costoVentas: 75000,
            totalCostos: 75000
          },
          gastos: {
            operativos: 15000,
            administrativos: 8000,
            ventas: 12000,
            financieros: 3000,
            totalGastos: 38000
          },
          utilidad: {
            bruta: 52500,
            operativa: 14500,
            neta: 11500
          },
          periodo: 'Ejemplo',
          fechaGeneracion: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const volverAContabilidad = () => {
    navigate('/contabilidad');
  };

  const aplicarFiltros = () => {
    cargarDatos();
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            
            {periodo === 'personalizado' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={aplicarFiltros}
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              <button
                onClick={() => alert('Instala @react-pdf/renderer para habilitar esta función')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaFilePdf className="mr-2" />
                Exportar PDF
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
                    
                    {/* Impuestos y Utilidad Neta */}
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