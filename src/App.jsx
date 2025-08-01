// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Contabilidad from "./pages/Contabilidad";
import LibroDiario from "./pages/LibroDiario";
import Bancos from "./pages/Bancos";
import Cocina from "./pages/Cocina";
import PrivateRoute from "./components/PrivateRoute"; // ⬅️ Nuevo import
import Register from "./pages/Register";
import VistaPlatos from "./pages/Platos";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* RUTA PROTEGIDA */}
        {/* RUTA TEMPORALMENTE SIN PROTECCIÓN */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contabilidad" element={<Contabilidad />} />
        <Route path="/libro-diario" element={<LibroDiario />} />
        <Route path="/bancos" element={<Bancos />} />
        <Route path="/cocina" element={<Cocina />} />
        <Route path="/Platos" element={<VistaPlatos />} />
      </Routes>
    </Router>
  );
}

export default App;