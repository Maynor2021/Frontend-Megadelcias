// src/pages/Contabilidad.jsx
import React, { useState } from 'react';
import { 
  FaCalculator, 
  FaChartLine, 
  FaFileInvoiceDollar, 
  FaMoneyBillWave,
  FaPiggyBank,
  FaReceipt,
  FaArrowLeft,
  FaPlus,
  FaBook,
  FaBalanceScale,
  FaColumns,
  FaUniversity,
  FaBuilding
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-megadelicias.png';

export default function Contabilidad() {
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState('principal');

  const volverAlDashboard = () => {
    navigate('/dashboard');
  };

  const opciones = [
    {
      id: 'libro-diario',
      titulo: 'Libro Diario',
      descripcion: 'Registro cronológico de todas las transacciones contables',
      icono: <FaBook size={40} />,
      color: 'from-emerald-400 to-emerald-600',
      categoria: 'contable'
    },
    {
      id: 'mayores-contables',
      titulo: 'Mayores Contables',
      descripcion: 'Cuentas T y saldos por cuenta contable',
      icono: <FaColumns size={40} />,
      color: 'from-teal-400 to-teal-600',
      categoria: 'contable'
    },
    {
      id: 'balanza-comprobacion',
      titulo: 'Balanza de Comprobación',
      descripcion: 'Verificación de sumas y saldos contables',
      icono: <FaBalanceScale size={40} />,
      color: 'from-cyan-400 to-cyan-600',
      categoria: 'contable'
    },
    {
      id: 'balance-general',
      titulo: 'Balance General',
      descripcion: 'Estado de situación financiera de la empresa',
      icono: <FaBuilding size={40} />,
      color: 'from-blue-400 to-blue-600',
      categoria: 'contable'
    },
    {
      id: 'bancos',
      titulo: 'Bancos',
      descripcion: 'Gestión de cuentas bancarias y conciliación',
      icono: <FaUniversity size={40} />,
      color: 'from-slate-400 to-slate-600',
      categoria: 'contable'
    },
    {
      id: 'ingresos',
      titulo: 'Ingresos',
      descripcion: 'Registrar y consultar ingresos del restaurante',
      icono: <FaMoneyBillWave size={40} />,
      color: 'from-green-400 to-green-600',
      categoria: 'operativo'
    },
    {
      id: 'gastos',
      titulo: 'Gastos',
      descripcion: 'Gestionar gastos operativos y compras',
      icono: <FaReceipt size={40} />,
      color: 'from-red-400 to-red-600',
      categoria: 'operativo'
    },
    {
      id: 'facturas',
      titulo: 'Facturación',
      descripcion: 'Generar y administrar facturas',
      icono: <FaFileInvoiceDollar size={40} />,
      color: 'from-blue-400 to-blue-600',
      categoria: 'operativo'
    },
    {
      id: 'reportes',
      titulo: 'Reportes Financieros',
      descripcion: 'Estados financieros y análisis',
      icono: <FaChartLine size={40} />,
      color: 'from-purple-400 to-purple-600',
      categoria: 'reportes'
    },
    {
      id: 'caja',
      titulo: 'Control de Caja',
      descripcion: 'Arqueo de caja y movimientos diarios',
      icono: <FaPiggyBank size={40} />,
      color: 'from-yellow-400 to-yellow-600',
      categoria: 'operativo'
    },
    {
      id: 'calculadora',
      titulo: 'Calculadora',
      descripcion: 'Herramientas de cálculo financiero',
      icono: <FaCalculator size={40} />,
      color: 'from-indigo-400 to-indigo-600',
      categoria: 'herramientas'
    }
  ];

  const manejarClickOpcion = (opcionId) => {
    if (opcionId === 'libro-diario') {
      navigate('/libro-diario');
    } else if (opcionId === 'bancos') {
      navigate('/bancos');
    } else if (opcionId === 'reportes') {
      navigate('/EstadodeResultado');
    } else if (opcionId === 'balance-general') {
      navigate('/balance-general');
    } else {
      setVistaActual(opcionId);
      // Aquí puedes agregar navegación a sub-vistas específicas más tarde
      alert(`🚀 Próximamente: Vista de ${opciones.find(o => o.id === opcionId)?.titulo}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={volverAlDashboard}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
            >
              <FaArrowLeft />
              <span>Volver al Dashboard</span>
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <img src={logo} alt="Logo Mega Delicias" className="w-32" />
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              <FaCalculator className="inline mr-2 text-blue-600" />
              Módulo de Contabilidad
            </h1>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-6 py-8">
        
        {/* Encabezado de sección */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Gestión Financiera
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Administra todos los aspectos financieros de Mega Delicias desde este panel centralizado.
            Controla ingresos, gastos, facturación y genera reportes detallados.
          </p>
        </div>

        {/* Sección Módulos Contables */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📚 Módulos Contables
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {opciones.filter(opcion => opcion.categoria === 'contable').map((opcion) => (
              <div
                key={opcion.id}
                onClick={() => manejarClickOpcion(opcion.id)}
                className={`
                  bg-gradient-to-br ${opcion.color} 
                  p-6 rounded-xl shadow-lg hover:shadow-xl 
                  transform hover:scale-105 transition-all duration-300 
                  cursor-pointer border border-white/20
                `}
              >
                <div className="text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white/90">
                      {opcion.icono}
                    </div>
                    <FaPlus className="text-white/60" />
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">
                    {opcion.titulo}
                  </h3>
                  
                  <p className="text-white/90 text-sm leading-relaxed">
                    {opcion.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Gestión Operativa */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            💼 Gestión Operativa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {opciones.filter(opcion => opcion.categoria === 'operativo').map((opcion) => (
              <div
                key={opcion.id}
                onClick={() => manejarClickOpcion(opcion.id)}
                className={`
                  bg-gradient-to-br ${opcion.color} 
                  p-6 rounded-xl shadow-lg hover:shadow-xl 
                  transform hover:scale-105 transition-all duration-300 
                  cursor-pointer border border-white/20
                `}
              >
                <div className="text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white/90">
                      {opcion.icono}
                    </div>
                    <FaPlus className="text-white/60" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">
                    {opcion.titulo}
                  </h3>
                  
                  <p className="text-white/90 text-sm leading-relaxed">
                    {opcion.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Reportes y Herramientas */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📊 Reportes y Herramientas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {opciones.filter(opcion => opcion.categoria === 'reportes' || opcion.categoria === 'herramientas').map((opcion) => (
              <div
                key={opcion.id}
                onClick={() => manejarClickOpcion(opcion.id)}
                className={`
                  bg-gradient-to-br ${opcion.color} 
                  p-6 rounded-xl shadow-lg hover:shadow-xl 
                  transform hover:scale-105 transition-all duration-300 
                  cursor-pointer border border-white/20
                `}
              >
                <div className="text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white/90">
                      {opcion.icono}
                    </div>
                    <FaPlus className="text-white/60" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">
                    {opcion.titulo}
                  </h3>
                  
                  <p className="text-white/90 text-sm leading-relaxed">
                    {opcion.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas rápidas (placeholder) */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📊 Resumen Financiero del Día
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800">Ingresos Hoy</h4>
              <p className="text-2xl font-bold text-green-600">$2,450.00</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800">Gastos Hoy</h4>
              <p className="text-2xl font-bold text-red-600">$380.00</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800">Ganancia Neta</h4>
              <p className="text-2xl font-bold text-blue-600">$2,070.00</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800">Facturas Emitidas</h4>
              <p className="text-2xl font-bold text-purple-600">47</p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-yellow-800">
              <strong>🚧 En desarrollo:</strong> Las funcionalidades específicas de cada módulo 
              estarán disponibles próximamente. Por ahora puedes explorar la estructura general.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}