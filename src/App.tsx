 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { MinionForm } from './pages/MinionForm'; 
import { Workshop } from './pages/Workshop';
import { Home } from './pages/Home';
function App() {


  return (
 <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
       
  
        <Route path="/minions" element={<Dashboard />} />
        
        {/* Rutas Detalle: Importante el orden, primero 'new' para que no lo confunda con un ID */}
        <Route path="/minions/new" element={<MinionForm />} />
        <Route path="/minions/:id" element={<MinionForm />} />

        <Route path="/workshop" element={<Workshop />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
