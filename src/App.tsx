 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { MinionForm } from './pages/MinionForm'; 
function App() {


  return (
 <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/minions" replace />} />
        
        {/* Ruta Lista */}
        <Route path="/minions" element={<Dashboard />} />
        
        {/* Rutas Detalle: Importante el orden, primero 'new' para que no lo confunda con un ID */}
        <Route path="/minions/new" element={<MinionForm />} />
        <Route path="/minions/:id" element={<MinionForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
