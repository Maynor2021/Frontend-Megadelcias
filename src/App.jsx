import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import Register from "./pages/Register";
import AdminUsers from "./pages/AdminUsers";
import Contabilidad from "./pages/Contabilidad";
import LibroDiario from "./pages/LibroDiario";
import Bancos from "./pages/Bancos";
import CajaPanel from './pages/CajaPanel';
import MeseroPanel from "./pages/MeseroPanel";

const CajaPage = () => <h1>Panel de Caja</h1>;
const MeseroPage = () => <h1>Panel de Mesero</h1>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute rol="admin">
              <AdminUsers />
            </RoleRoute>
          }
        />

        <Route
          path="/contabilidad"
          element={
            <RoleRoute rol="admin">
              <Contabilidad />
            </RoleRoute>
          }
        />

        {/* ✅ Corregido: estas rutas ahora coinciden con navigate('/libro-diario') y navigate('/bancos') */}
        <Route
          path="/libro-diario"
          element={
            <RoleRoute rol="admin">
              <LibroDiario />
            </RoleRoute>
          }
        />

        <Route
          path="/bancos"
          element={
            <RoleRoute rol="admin">
              <Bancos />
            </RoleRoute>
          }
        />

      
        <Route
          path="/caja"
          element={
            <RoleRoute rol={['admin', 'caja']}>
              <CajaPanel />
           </RoleRoute>
         }
        />


        <Route
          path="/mesero"
          element={
            <RoleRoute rol={["mesero", "admin"]}>
              <MeseroPanel />
            </RoleRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
