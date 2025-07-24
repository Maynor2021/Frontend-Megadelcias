import React from 'react';

const Bancos = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Gestión Bancaria
      </h1>

      <div className="bg-white p-6 rounded shadow-md">
        <p className="text-gray-700">Aquí se gestionarán las cuentas bancarias y movimientos.</p>
        {/* Más adelante puedes colocar un formulario o tabla */}
      </div>
    </div>
  );
};

export default Bancos;
