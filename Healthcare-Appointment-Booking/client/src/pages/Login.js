import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', formData);
      login(data);
      toast.success('Login successful!');
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logo}>🏥 MediBook</h1>
          <p style={styles.subtitle}>Your Healthcare Appointment Platform</p>
        </div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.desc}>Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.linkText}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  logo: {
    fontSize: '28px',
    margin: '0',
    color: '#667eea'
  },
  subtitle: {
    color: '#888',
    fontSize: '13px',
    margin: '5px 0 0'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 5px'
  },
  desc: {
    color: '#888',
    fontSize: '14px',
    margin: '0 0 25px'
  },
  inputGroup: {
    marginBottom: '18px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#444'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #eee',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  },
  link: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#888'
  },
  linkText: {
    color: '#667eea',
    fontWeight: '600',
    textDecoration: 'none'
  }
};

export default Login;