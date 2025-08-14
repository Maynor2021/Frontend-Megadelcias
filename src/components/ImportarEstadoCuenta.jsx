// src/components/ImportarEstadoCuenta.jsx
import React, { useState, useRef } from 'react';
import { FaTimes, FaFileExcel, FaUpload, FaEye, FaSave, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

export default function ImportarEstadoCuenta({ bancoId, onClose, onImportSuccess }) {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [datosProcesados, setDatosProcesados] = useState([]);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    columnaFecha: 'A',
    columnaConcepto: 'B',
    columnaMonto: 'C',
    columnaTipo: 'D',
    primeraFila: 2,
    mapeoCuentas: {
      'deposito': '4000', // Ventas por defecto
      'retiro': '5000',   // Gastos por defecto
      'transferencia': '1100' // Banco por defecto
    }
  });
  
  const fileInputRef = useRef();

  const procesarArchivo = (archivo) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Procesar datos según la configuración
        const movimientos = [];
        for (let i = configuracion.primeraFila - 1; i < jsonData.length; i++) {
          const fila = jsonData[i];
          if (fila && fila.length > 0) {
            const fecha = obtenerValorColumna(fila, configuracion.columnaFecha);
            const concepto = obtenerValorColumna(fila, configuracion.columnaConcepto);
            const monto = parseFloat(obtenerValorColumna(fila, configuracion.columnaMonto)) || 0;
            const tipo = obtenerValorColumna(fila, configuracion.columnaTipo) || 'deposito';

            if (fecha && concepto && monto !== 0) {
              movimientos.push({
                id: Date.now() + i,
                fecha: formatearFecha(fecha),
                nombreAsiento: concepto,
                monto: monto,
                tipo: tipo.toLowerCase(),
                asientoContable: generarAsientoContable(monto, tipo, concepto)
              });
            }
          }
        }

        setDatosProcesados(movimientos);
        setMostrarVistaPrevia(true);
      } catch (error) {
        console.error('Error al procesar archivo:', error);
        alert('❌ Error al procesar el archivo Excel: ' + error.message);
      }
    };
    reader.readAsArrayBuffer(archivo);
  };

  const obtenerValorColumna = (fila, columna) => {
    const indice = columna.charCodeAt(0) - 65; // A=0, B=1, C=2, etc.
    return fila[indice];
  };

  const formatearFecha = (fecha) => {
    if (typeof fecha === 'string') {
      return fecha;
    }
    if (fecha instanceof Date) {
      return fecha.toISOString().split('T')[0];
    }
    // Si es un número de Excel, convertirlo
    if (typeof fecha === 'number') {
      const excelDate = new Date((fecha - 25569) * 86400 * 1000);
      return excelDate.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  const generarAsientoContable = (monto, tipo, concepto) => {
    const cuentaBanco = '1100'; // Banco por defecto
    const cuentaContrapartida = configuracion.mapeoCuentas[tipo] || '4000';

    if (monto > 0) {
      // Depósito: Banco debe, Contrapartida haber
      return {
        debe: [{ cuenta: cuentaBanco, concepto: 'Banco', monto: Math.abs(monto) }],
        haber: [{ cuenta: cuentaContrapartida, concepto: concepto, monto: Math.abs(monto) }]
      };
    } else {
      // Retiro: Contrapartida debe, Banco haber
      return {
        debe: [{ cuenta: cuentaContrapartida, concepto: concepto, monto: Math.abs(monto) }],
        haber: [{ cuenta: cuentaBanco, concepto: 'Banco', monto: Math.abs(monto) }]
      };
    }
  };

  const handleFileChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoSeleccionado(archivo);
      procesarArchivo(archivo);
    }
  };

  const confirmarImportacion = () => {
    if (datosProcesados.length > 0) {
      onImportSuccess(datosProcesados);
      alert(`✅ Se importaron ${datosProcesados.length} movimientos exitosamente.`);
    }
  };

  const eliminarMovimiento = (id) => {
    setDatosProcesados(datosProcesados.filter(m => m.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-purple-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <FaFileExcel className="mr-2" />
              Importar Estado de Cuenta
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
          {/* Configuración de columnas */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Configuración de Columnas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Columna Fecha
                </label>
                <select
                  value={configuracion.columnaFecha}
                  onChange={(e) => setConfiguracion({...configuracion, columnaFecha: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Columna Concepto
                </label>
                <select
                  value={configuracion.columnaConcepto}
                  onChange={(e) => setConfiguracion({...configuracion, columnaConcepto: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Columna Monto
                </label>
                <select
                  value={configuracion.columnaMonto}
                  onChange={(e) => setConfiguracion({...configuracion, columnaMonto: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primera Fila
                </label>
                <input
                  type="number"
                  value={configuracion.primeraFila}
                  onChange={(e) => setConfiguracion({...configuracion, primeraFila: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-3 py-2"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Mapeo de cuentas */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Mapeo de Cuentas Contables</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuenta para Depósitos
                </label>
                <select
                  value={configuracion.mapeoCuentas.deposito}
                  onChange={(e) => setConfiguracion({
                    ...configuracion, 
                    mapeoCuentas: {...configuracion.mapeoCuentas, deposito: e.target.value}
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="4000">4000 - Ventas</option>
                  <option value="1200">1200 - Caja General</option>
                  <option value="1300">1300 - Otros Ingresos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuenta para Retiros
                </label>
                <select
                  value={configuracion.mapeoCuentas.retiro}
                  onChange={(e) => setConfiguracion({
                    ...configuracion, 
                    mapeoCuentas: {...configuracion.mapeoCuentas, retiro: e.target.value}
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="5000">5000 - Gastos</option>
                  <option value="2100">2100 - Cuentas por Pagar</option>
                  <option value="2200">2200 - Préstamos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuenta para Transferencias
                </label>
                <select
                  value={configuracion.mapeoCuentas.transferencia}
                  onChange={(e) => setConfiguracion({
                    ...configuracion, 
                    mapeoCuentas: {...configuracion.mapeoCuentas, transferencia: e.target.value}
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="1100">1100 - Banco</option>
                  <option value="1200">1200 - Caja General</option>
                  <option value="1300">1300 - Otros Bancos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Selección de archivo */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Seleccionar Archivo Excel</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center mx-auto space-x-2"
              >
                <FaUpload />
                <span>Seleccionar Archivo Excel</span>
              </button>
              {archivoSeleccionado && (
                <p className="mt-2 text-sm text-gray-600">
                  Archivo seleccionado: {archivoSeleccionado.name}
                </p>
              )}
            </div>
          </div>

          {/* Vista previa de datos */}
          {mostrarVistaPrevia && datosProcesados.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Vista Previa de Datos</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 font-semibold text-sm">
                  <div>Fecha</div>
                  <div>Concepto</div>
                  <div>Monto</div>
                  <div>Acciones</div>
                </div>
                {datosProcesados.map((mov) => (
                  <div key={mov.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 py-2 border-b border-gray-200">
                    <div className="text-sm">{mov.fecha}</div>
                    <div className="text-sm">{mov.nombreAsiento}</div>
                    <div className={`text-sm font-medium ${mov.monto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(mov.monto).toFixed(2)}
                    </div>
                    <div>
                      <button
                        onClick={() => eliminarMovimiento(mov.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Eliminar"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            {datosProcesados.length > 0 && (
              <button
                onClick={confirmarImportacion}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2"
              >
                <FaSave />
                <span>Importar {datosProcesados.length} Movimientos</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}