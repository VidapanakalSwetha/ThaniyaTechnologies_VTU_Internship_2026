import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoText}>🏥 MediBook</Link>
      </div>
      <div style={styles.links}>
        {user && (
          <>
            <span style={styles.welcome}>👋 {user.name}</span>
            <span style={styles.role}>{user.role}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  logo: {
    display: 'flex',
    alignItems: 'center'
  },
  logoText: {
    color: 'white',
    fontSize: '22px',
    fontWeight: '700',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  welcome: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600'
  },
  role: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    textTransform: 'capitalize'
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default Navbar;