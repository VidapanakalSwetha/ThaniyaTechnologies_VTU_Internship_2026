import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/patient/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/patient/dashboard" />} />
        <Route path="/patient/dashboard" element={user ? <div style={{padding:'40px', fontSize:'24px'}}>🎉 Welcome {user.name}! Patient Dashboard Coming Soon...</div> : <Navigate to="/login" />} />
        <Route path="/doctor/dashboard" element={user ? <div style={{padding:'40px', fontSize:'24px'}}>🎉 Welcome Dr. {user.name}! Doctor Dashboard Coming Soon...</div> : <Navigate to="/login" />} />
        <Route path="/admin/dashboard" element={user ? <div style={{padding:'40px', fontSize:'24px'}}>🎉 Welcome {user.name}! Admin Dashboard Coming Soon...</div> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;