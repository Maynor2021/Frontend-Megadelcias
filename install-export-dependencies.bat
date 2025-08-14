@echo off
echo Instalando dependencias para exportacion...

REM Instalar xlsx para exportar a Excel
npm install xlsx

REM Instalar file-saver para descargar archivos
npm install file-saver

echo ✅ Dependencias instaladas exitosamente!
echo 📊 Ahora puedes exportar en: PDF, Excel (.xlsx) y CSV
pause 