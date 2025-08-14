#!/bin/bash

echo "Instalando dependencias para exportación..."

# Instalar xlsx para exportar a Excel
npm install xlsx

# Instalar file-saver para descargar archivos
npm install file-saver

echo "✅ Dependencias instaladas exitosamente!"
echo "📊 Ahora puedes exportar en: PDF, Excel (.xlsx) y CSV" 