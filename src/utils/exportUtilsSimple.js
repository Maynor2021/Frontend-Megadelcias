// src/utils/exportUtilsSimple.js - Versión sin dependencias externas

// Función para exportar a CSV (sin dependencias externas)
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

// Función para exportar a Excel usando la API nativa del navegador (formato .xls básico)
export const exportToExcelBasic = (data, fileName) => {
  try {
    // Crear contenido HTML que se puede abrir en Excel
    const htmlContent = createExcelHTML(data);
    
    // Crear y descargar el archivo
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error al exportar a Excel básico:', error);
    alert('❌ Error al exportar a Excel: ' + error.message);
    return false;
  }
};

// Función para crear HTML compatible con Excel
const createExcelHTML = (data) => {
  const excelData = prepareDataForExcel(data);
  
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>Balance General - Mega Delicias</title>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet name="Balance General">
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
    </head>
    <body>
      <table border="1">
        <tr><th colspan="3" style="background-color: #2563eb; color: white; font-size: 16px; font-weight: bold;">BALANCE GENERAL - MEGA DELICIAS</th></tr>
        <tr><th colspan="3">Fecha: ${new Date(data.fechaGeneracion).toLocaleDateString()}</th></tr>
        <tr><td colspan="3"></td></tr>
        
        <tr><th colspan="3" style="background-color: #1e40af; color: white;">RESUMEN GENERAL</th></tr>
        <tr><th>Concepto</th><th>Monto ($)</th><th>Categoría</th></tr>
  `;
  
  // Agregar datos del balance general
  excelData.balanceGeneral.forEach(row => {
    html += `<tr><td>${row.Concepto}</td><td>${row.Monto}</td><td>${row.Categoría}</td></tr>`;
  });
  
  html += `
        <tr><td colspan="3"></td></tr>
        <tr><th colspan="3" style="background-color: #1e40af; color: white;">ACTIVOS</th></tr>
        <tr><th>Código</th><th>Concepto</th><th>Monto ($)</th></tr>
  `;
  
  // Agregar activos
  excelData.activos.forEach(row => {
    if (row.Monto > 0) {
      html += `<tr><td>${row.Código}</td><td>${row.Concepto}</td><td>${row.Monto}</td></tr>`;
    }
  });
  
  html += `
        <tr><td colspan="3"></td></tr>
        <tr><th colspan="3" style="background-color: #dc2626; color: white;">PASIVOS</th></tr>
        <tr><th>Código</th><th>Concepto</th><th>Monto ($)</th></tr>
  `;
  
  // Agregar pasivos
  excelData.pasivos.forEach(row => {
    if (row.Monto > 0) {
      html += `<tr><td>${row.Código}</td><td>${row.Concepto}</td><td>${row.Monto}</td></tr>`;
    }
  });
  
  html += `
        <tr><td colspan="3"></td></tr>
        <tr><th colspan="3" style="background-color: #059669; color: white;">PATRIMONIO</th></tr>
        <tr><th>Código</th><th>Concepto</th><th>Monto ($)</th></tr>
  `;
  
  // Agregar patrimonio
  excelData.patrimonio.forEach(row => {
    if (row.Monto > 0) {
      html += `<tr><td>${row.Código}</td><td>${row.Concepto}</td><td>${row.Monto}</td></tr>`;
    }
  });
  
  html += `
      </table>
    </body>
    </html>
  `;
  
  return html;
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
      'Monto': data.activos.circulantes.efectivo
    },
    {
      'Código': '1200',
      'Concepto': 'Cuentas por Cobrar',
      'Monto': data.activos.circulantes.cuentasPorCobrar
    },
    {
      'Código': '1300',
      'Concepto': 'Inventarios',
      'Monto': data.activos.circulantes.inventarios
    },
    {
      'Código': '1400',
      'Concepto': 'Otros Activos Circulantes',
      'Monto': data.activos.circulantes.otrosActivosCirculantes
    },
    {
      'Código': '1500',
      'Concepto': 'Equipos y Maquinaria',
      'Monto': data.activos.noCirculantes.equipos
    },
    {
      'Código': '1600',
      'Concepto': 'Mobiliario y Enseres',
      'Monto': data.activos.noCirculantes.mobiliario
    },
    {
      'Código': '1700',
      'Concepto': 'Edificios',
      'Monto': data.activos.noCirculantes.edificios
    },
    {
      'Código': '1800',
      'Concepto': 'Otros Activos Fijos',
      'Monto': data.activos.noCirculantes.otrosActivosFijos
    }
  ];

  const pasivos = [
    {
      'Código': '2100',
      'Concepto': 'Cuentas por Pagar',
      'Monto': data.pasivos.circulantes.cuentasPorPagar
    },
    {
      'Código': '2200',
      'Concepto': 'Préstamos a Corto Plazo',
      'Monto': data.pasivos.circulantes.prestamosCortoPlazo
    },
    {
      'Código': '2300',
      'Concepto': 'Impuestos por Pagar',
      'Monto': data.pasivos.circulantes.impuestosPorPagar
    },
    {
      'Código': '2400',
      'Concepto': 'Otros Pasivos Circulantes',
      'Monto': data.pasivos.circulantes.otrosPasivosCirculantes
    },
    {
      'Código': '2500',
      'Concepto': 'Préstamos a Largo Plazo',
      'Monto': data.pasivos.noCirculantes.prestamosLargoPlazo
    },
    {
      'Código': '2600',
      'Concepto': 'Hipotecas',
      'Monto': data.pasivos.noCirculantes.hipotecas
    },
    {
      'Código': '2700',
      'Concepto': 'Otros Pasivos Largo Plazo',
      'Monto': data.pasivos.noCirculantes.otrosPasivosLargoPlazo
    }
  ];

  const patrimonio = [
    {
      'Código': '3100',
      'Concepto': 'Capital Social',
      'Monto': data.patrimonio.capitalSocial
    },
    {
      'Código': '3200',
      'Concepto': 'Utilidades Retenidas',
      'Monto': data.patrimonio.utilidadesRetenidas
    },
    {
      'Código': '3300',
      'Concepto': 'Utilidad del Ejercicio',
      'Monto': data.patrimonio.utilidadDelEjercicio
    }
  ];

  return {
    balanceGeneral,
    activos,
    pasivos,
    patrimonio
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