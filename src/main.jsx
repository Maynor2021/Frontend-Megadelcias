import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { UserProvider } from './context/UserContext';
import axios from 'axios'; // ✅ Importar axios

// ✅ Establecer la URL base del backend
axios.defaults.baseURL = 'http://localhost:4000';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
