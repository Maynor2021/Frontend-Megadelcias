// src/utils/exportUtils.js

// Importaciones condicionales para evitar errores si las dependencias no están instaladas
let XLSX = null;
let saveAs = null;

try {
  XLSX = require('xlsx');
} catch (error) {
  console.warn('xlsx no está disponible. La exportación a Excel no funcionará.');
}

try {
  saveAs = require('file-saver').saveAs;
} catch (error) {
  console.warn('file-saver no está disponible. La descarga de archivos no funcionará.');
}

// Función para exportar a Excel (.xlsx)
export const exportToExcel = (data, fileName) => {
  if (!XLSX) {
    alert('❌ La librería xlsx no está disponible. Ejecuta: npm install xlsx');
    return false;
  }

  try {
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Preparar los datos para Excel
    const excelData = prepareDataForExcel(data);
    
    // Crear hojas para cada sección
    const sheets = [
      { name: 'Balance General', data: excelData.balanceGeneral },
      { name: 'Activos', data: excelData.activos },
      { name: 'Pasivos', data: excelData.pasivos },
      { name: 'Patrimonio', data: excelData.patrimonio },
      { name: 'Detalle Cuentas', data: excelData.detalleCuentas }
    ];
    
    // Agregar cada hoja al libro
    sheets.forEach(sheet => {
      if (sheet.data && sheet.data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(sheet.data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
      }
    });
    
    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Descargar el archivo usando la API nativa del navegador si file-saver no está disponible
    if (saveAs) {
      saveAs(dataBlob, `${fileName}.xlsx`);
    } else {
      // Fallback usando la API nativa del navegador
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    return true;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    alert('❌ Error al exportar a Excel: ' + error.message);
    return false;
  }
};

// Función para exportar a CSV
export const exportToCSV = (data, fileName) => {
  try {
    // Preparar los datos para CSV
    const csvData = prepareDataForCSV(data);
    
    // Convertir a formato CSV
    const csvContent = convertToCSV(csvData);
    
    // Crear y descargar el archivo usando la API nativa del navegador
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    return true;
  } catch (error) {
    console.error('Error al exportar a CSV:', error);
    alert('❌ Error al exportar a CSV: ' + error.message);
    return false;
  }
};

// Función para preparar datos para Excel
const prepareDataForExcel = (data) => {
  const balanceGeneral = [
    {
      'Concepto': 'TOTAL ACTIVOS',
      'Monto': data.activos.totalActivos,
      'Categoría': 'ACTIVOS'
    },
    {
      'Concepto': 'TOTAL PASIVOS',
      'Monto': data.pasivos.totalPasivos,
      'Categoría': 'PASIVOS'
    },
    {
      'Concepto': 'TOTAL PATRIMONIO',
      'Monto': data.patrimonio.totalPatrimonio,
      'Categoría': 'PATRIMONIO'
    },
    {
      'Concepto': 'ECUACIÓN CONTABLE',
      'Monto': `${data.activos.totalActivos} = ${data.pasivos.totalPasivos} + ${data.patrimonio.totalPatrimonio}`,
      'Categoría': 'VERIFICACIÓN'
    }
  ];

  const activos = [
    {
      'Código': '1100',
      'Concepto': 'Efectivo y Equivalentes',
      'Monto': data.activos.circulantes.efectivo,
      'Tipo': 'Circulante',
      'Categoría': 'Activos Circulantes'
    },
    {
      'Código': '1200',
      'Concepto': 'Cuentas por Cobrar',
      'Monto': data.activos.circulantes.cuentasPorCobrar,
      'Tipo': 'Circulante',
      'Categoría': 'Activos Circulantes'
    },
    {
      'Código': '1300',
      'Concepto': 'Inventarios',
      'Monto': data.activos.circulantes.inventarios,
      'Tipo': 'Circulante',
      'Categoría': 'Activos Circulantes'
    },
    {
      'Código': '1400',
      'Concepto': 'Otros Activos Circulantes',
      'Monto': data.activos.circulantes.otrosActivosCirculantes,
      'Tipo': 'Circulante',
      'Categoría': 'Activos Circulantes'
    },
    {
      'Código': '1500',
      'Concepto': 'Equipos y Maquinaria',
      'Monto': data.activos.noCirculantes.equipos,
      'Tipo': 'No Circulante',
      'Categoría': 'Activos No Circulantes'
    },
    {
      'Código': '1600',
      'Concepto': 'Mobiliario y Enseres',
      'Monto': data.activos.noCirculantes.mobiliario,
      'Tipo': 'No Circulante',
      'Categoría': 'Activos No Circulantes'
    },
    {
      'Código': '1700',
      'Concepto': 'Edificios',
      'Monto': data.activos.noCirculantes.edificios,
      'Tipo': 'No Circulante',
      'Categoría': 'Activos No Circulantes'
    },
    {
      'Código': '1800',
      'Concepto': 'Otros Activos Fijos',
      'Monto': data.activos.noCirculantes.otrosActivosFijos,
      'Tipo': 'No Circulante',
      'Categoría': 'Activos No Circulantes'
    }
  ];

  const pasivos = [
    {
      'Código': '2100',
      'Concepto': 'Cuentas por Pagar',
      'Monto': data.pasivos.circulantes.cuentasPorPagar,
      'Tipo': 'Circulante',
      'Categoría': 'Pasivos Circulantes'
    },
    {
      'Código': '2200',
      'Concepto': 'Préstamos a Corto Plazo',
      'Monto': data.pasivos.circulantes.prestamosCortoPlazo,
      'Tipo': 'Circulante',
      'Categoría': 'Pasivos Circulantes'
    },
    {
      'Código': '2300',
      'Concepto': 'Impuestos por Pagar',
      'Monto': data.pasivos.circulantes.impuestosPorPagar,
      'Tipo': 'Circulante',
      'Categoría': 'Pasivos Circulantes'
    },
    {
      'Código': '2400',
      'Concepto': 'Otros Pasivos Circulantes',
      'Monto': data.pasivos.circulantes.otrosPasivosCirculantes,
      'Tipo': 'Circulante',
      'Categoría': 'Pasivos Circulantes'
    },
    {
      'Código': '2500',
      'Concepto': 'Préstamos a Largo Plazo',
      'Monto': data.pasivos.noCirculantes.prestamosLargoPlazo,
      'Tipo': 'No Circulante',
      'Categoría': 'Pasivos No Circulantes'
    },
    {
      'Código': '2600',
      'Concepto': 'Hipotecas',
      'Monto': data.pasivos.noCirculantes.hipotecas,
      'Tipo': 'No Circulante',
      'Categoría': 'Pasivos No Circulantes'
    },
    {
      'Código': '2700',
      'Concepto': 'Otros Pasivos Largo Plazo',
      'Monto': data.pasivos.noCirculantes.otrosPasivosLargoPlazo,
      'Tipo': 'No Circulante',
      'Categoría': 'Pasivos No Circulantes'
    }
  ];

  const patrimonio = [
    {
      'Código': '3100',
      'Concepto': 'Capital Social',
      'Monto': data.patrimonio.capitalSocial,
      'Categoría': 'Patrimonio'
    },
    {
      'Código': '3200',
      'Concepto': 'Utilidades Retenidas',
      'Monto': data.patrimonio.utilidadesRetenidas,
      'Categoría': 'Patrimonio'
    },
    {
      'Código': '3300',
      'Concepto': 'Utilidad del Ejercicio',
      'Monto': data.patrimonio.utilidadDelEjercicio,
      'Categoría': 'Patrimonio'
    }
  ];

  const detalleCuentas = data.datosOriginales ? data.datosOriginales.map(cuenta => ({
    'Sección': cuenta.Seccion,
    'Código': cuenta.CodigoCuenta,
    'Nombre de Cuenta': cuenta.NombreCuenta,
    'Monto': cuenta.Monto,
    'Tipo': cuenta.Tipo || 'N/A',
    'Orden': cuenta.Orden,
    'Fecha': new Date(cuenta.Fecha).toLocaleDateString()
  })) : [];

  return {
    balanceGeneral,
    activos,
    pasivos,
    patrimonio,
    detalleCuentas
  };
};

// Función para preparar datos para CSV
const prepareDataForCSV = (data) => {
  const allData = [];
  
  // Agregar encabezado
  allData.push(['BALANCE GENERAL - MEGA DELICIAS']);
  allData.push(['Fecha de Generación:', new Date(data.fechaGeneracion).toLocaleDateString()]);
  allData.push([]);
  
  // Agregar resumen
  allData.push(['RESUMEN GENERAL']);
  allData.push(['Concepto', 'Monto ($)']);
  allData.push(['Total Activos', data.activos.totalActivos]);
  allData.push(['Total Pasivos', data.pasivos.totalPasivos]);
  allData.push(['Total Patrimonio', data.patrimonio.totalPatrimonio]);
  allData.push([]);
  
  // Agregar activos
  allData.push(['ACTIVOS']);
  allData.push(['Código', 'Concepto', 'Monto ($)', 'Tipo', 'Categoría']);
  
  if (data.activos.circulantes.efectivo > 0) {
    allData.push(['1100', 'Efectivo y Equivalentes', data.activos.circulantes.efectivo, 'Circulante', 'Activos Circulantes']);
  }
  if (data.activos.circulantes.cuentasPorCobrar > 0) {
    allData.push(['1200', 'Cuentas por Cobrar', data.activos.circulantes.cuentasPorCobrar, 'Circulante', 'Activos Circulantes']);
  }
  if (data.activos.circulantes.inventarios > 0) {
    allData.push(['1300', 'Inventarios', data.activos.circulantes.inventarios, 'Circulante', 'Activos Circulantes']);
  }
  if (data.activos.circulantes.otrosActivosCirculantes > 0) {
    allData.push(['1400', 'Otros Activos Circulantes', data.activos.circulantes.otrosActivosCirculantes, 'Circulante', 'Activos Circulantes']);
  }
  
  allData.push(['', 'Total Activos Circulantes', data.activos.circulantes.totalCirculantes, '', '']);
  allData.push([]);
  
  if (data.activos.noCirculantes.equipos > 0) {
    allData.push(['1500', 'Equipos y Maquinaria', data.activos.noCirculantes.equipos, 'No Circulante', 'Activos No Circulantes']);
  }
  if (data.activos.noCirculantes.mobiliario > 0) {
    allData.push(['1600', 'Mobiliario y Enseres', data.activos.noCirculantes.mobiliario, 'No Circulante', 'Activos No Circulantes']);
  }
  if (data.activos.noCirculantes.edificios > 0) {
    allData.push(['1700', 'Edificios', data.activos.noCirculantes.edificios, 'No Circulante', 'Activos No Circulantes']);
  }
  if (data.activos.noCirculantes.otrosActivosFijos > 0) {
    allData.push(['1800', 'Otros Activos Fijos', data.activos.noCirculantes.otrosActivosFijos, 'No Circulante', 'Activos No Circulantes']);
  }
  
  allData.push(['', 'Total Activos No Circulantes', data.activos.noCirculantes.totalNoCirculantes, '', '']);
  allData.push(['', 'TOTAL ACTIVOS', data.activos.totalActivos, '', '']);
  allData.push([]);
  
  // Agregar pasivos
  allData.push(['PASIVOS']);
  allData.push(['Código', 'Concepto', 'Monto ($)', 'Tipo', 'Categoría']);
  
  if (data.pasivos.circulantes.cuentasPorPagar > 0) {
    allData.push(['2100', 'Cuentas por Pagar', data.pasivos.circulantes.cuentasPorPagar, 'Circulante', 'Pasivos Circulantes']);
  }
  if (data.pasivos.circulantes.prestamosCortoPlazo > 0) {
    allData.push(['2200', 'Préstamos a Corto Plazo', data.pasivos.circulantes.prestamosCortoPlazo, 'Circulante', 'Pasivos Circulantes']);
  }
  if (data.pasivos.circulantes.impuestosPorPagar > 0) {
    allData.push(['2300', 'Impuestos por Pagar', data.pasivos.circulantes.impuestosPorPagar, 'Circulante', 'Pasivos Circulantes']);
  }
  if (data.pasivos.circulantes.otrosPasivosCirculantes > 0) {
    allData.push(['2400', 'Otros Pasivos Circulantes', data.pasivos.circulantes.otrosPasivosCirculantes, 'Circulante', 'Pasivos Circulantes']);
  }
  
  allData.push(['', 'Total Pasivos Circulantes', data.pasivos.circulantes.totalCirculantes, '', '']);
  allData.push([]);
  
  if (data.pasivos.noCirculantes.prestamosLargoPlazo > 0) {
    allData.push(['2500', 'Préstamos a Largo Plazo', data.pasivos.noCirculantes.prestamosLargoPlazo, 'No Circulante', 'Pasivos No Circulantes']);
  }
  if (data.pasivos.noCirculantes.hipotecas > 0) {
    allData.push(['2600', 'Hipotecas', data.pasivos.noCirculantes.hipotecas, 'No Circulante', 'Pasivos No Circulantes']);
  }
  if (data.pasivos.noCirculantes.otrosPasivosLargoPlazo > 0) {
    allData.push(['2700', 'Otros Pasivos Largo Plazo', data.pasivos.noCirculantes.otrosPasivosLargoPlazo, 'No Circulante', 'Pasivos No Circulantes']);
  }
  
  allData.push(['', 'Total Pasivos No Circulantes', data.pasivos.noCirculantes.totalNoCirculantes, '', '']);
  allData.push(['', 'TOTAL PASIVOS', data.pasivos.totalPasivos, '', '']);
  allData.push([]);
  
  // Agregar patrimonio
  allData.push(['PATRIMONIO']);
  allData.push(['Código', 'Concepto', 'Monto ($)', 'Categoría']);
  
  if (data.patrimonio.capitalSocial > 0) {
    allData.push(['3100', 'Capital Social', data.patrimonio.capitalSocial, 'Patrimonio']);
  }
  if (data.patrimonio.utilidadesRetenidas > 0) {
    allData.push(['3200', 'Utilidades Retenidas', data.patrimonio.utilidadesRetenidas, 'Patrimonio']);
  }
  if (data.patrimonio.utilidadDelEjercicio > 0) {
    allData.push(['3300', 'Utilidad del Ejercicio', data.patrimonio.utilidadDelEjercicio, 'Patrimonio']);
  }
  
  allData.push(['', 'TOTAL PATRIMONIO', data.patrimonio.totalPatrimonio, '']);
  allData.push([]);
  
  // Agregar ecuación contable
  allData.push(['ECUACIÓN CONTABLE']);
  allData.push(['ACTIVOS = PASIVOS + PATRIMONIO']);
  allData.push([`${data.activos.totalActivos} = ${data.pasivos.totalPasivos} + ${data.patrimonio.totalPatrimonio}`]);
  allData.push(['Estado:', Math.abs(data.activos.totalActivos - (data.pasivos.totalPasivos + data.patrimonio.totalPatrimonio)) < 0.01 ? 'BALANCEADO' : 'NO BALANCEADO']);
  
  return allData;
};

// Función para convertir array a formato CSV
const convertToCSV = (data) => {
  return data.map(row => 
    row.map(cell => {
      // Escapar comillas y envolver en comillas si contiene comas o saltos de línea
      const cellStr = String(cell || '');
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(',')
  ).join('\n');
}; 