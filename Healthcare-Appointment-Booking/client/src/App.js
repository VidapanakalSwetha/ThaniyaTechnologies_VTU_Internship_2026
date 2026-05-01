import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}/dashboard`} />} />
        <Route path="/patient/dashboard" element={user?.role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" />} />
        <Route path="/doctor/dashboard" element={user ? <div style={{padding:'40px'}}>Doctor Dashboard Coming Soon...</div> : <Navigate to="/login" />} />
        <Route path="/admin/dashboard" element={user ? <div style={{padding:'40px'}}>Admin Dashboard Coming Soon...</div> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;