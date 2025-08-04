@echo off
echo Instalando dependencias necesarias...
echo.

echo 1. Instalando @tailwindcss/postcss...
npm install --save-dev @tailwindcss/postcss

echo.
echo 2. Instalando @react-pdf/renderer...
npm install @react-pdf/renderer

echo.
echo ✅ Dependencias instaladas correctamente!
echo.
echo Ahora puedes:
echo 1. Reiniciar el servidor de desarrollo (Ctrl+C y luego npm run dev)
echo 2. Descomentar las importaciones de PDF en Estadoderesultado.jsx
echo.
pause
