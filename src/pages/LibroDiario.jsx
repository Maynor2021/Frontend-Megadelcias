import React from 'react';

const LibroDiario = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Libro Diario
      </h1>

      <div className="bg-white p-6 rounded shadow-md">
        <p className="text-gray-700">Aquí se mostrará la lista de transacciones del libro diario.</p>
        {/* Aquí podrías mostrar una tabla más adelante */}
      </div>
    </div>
  );
};

export default LibroDiario;
