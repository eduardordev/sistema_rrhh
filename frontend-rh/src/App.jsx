import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Employees from './pages/Employees';
import Companies from './pages/Companies';
import Geografia from './pages/Geografia';

function App() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'btn btn-primary me-2' : 'btn btn-secondary me-2';

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión RH</h1>
      <nav className="mb-3">
        <Link to="/employees" className={isActive('/employees')}>Colaboradores</Link>
        <Link to="/companies" className={isActive('/companies')}>Empresas</Link>
        <Link to="/geografia" className={isActive('/geografia')}>Geografía</Link>
      </nav>
      <Routes>
        <Route path="/employees" element={<Employees />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/geografia" element={<Geografia />} />
      </Routes>
    </div>
  );
}


export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
