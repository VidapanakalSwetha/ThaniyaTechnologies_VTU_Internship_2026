import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [stats, setStats] = useState({
    total: 0, pending: 0, confirmed: 0, completed: 0
  });

  useEffect(() => {
    fetchAppointments();
    fetchProfile();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('/appointments/doctor');
      setAppointments(data);
      setStats({
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        confirmed: data.filter(a => a.status === 'confirmed').length,
        completed: data.filter(a => a.status === 'completed').length
      });
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
    setLoading(false);
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/doctors');
      if (data.length > 0) setProfile(data[0]);
    } catch (error) {
      console.log('Profile fetch error');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status}!`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      cancelled: '#ef4444',
      completed: '#6366f1'
    };
    return colors[status] || '#888';
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.heading}>Doctor Dashboard</h1>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #667eea' }}>
            <h3 style={styles.statNumber}>{stats.total}</h3>
            <p style={styles.statLabel}>Total Appointments</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #f59e0b' }}>
            <h3 style={styles.statNumber}>{stats.pending}</h3>
            <p style={styles.statLabel}>Pending</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #10b981' }}>
            <h3 style={styles.statNumber}>{stats.confirmed}</h3>
            <p style={styles.statLabel}>Confirmed</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #6366f1' }}>
            <h3 style={styles.statNumber}>{stats.completed}</h3>
            <p style={styles.statLabel}>Completed</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'appointments' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('appointments')}
          >
            📅 Appointments
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'profile' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('profile')}
          >
            👨‍⚕️ My Profile
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            {loading ? (
              <p style={styles.loading}>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <div style={styles.empty}>
                <p>📅 No appointments yet</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {appointments.map(apt => (
                  <div key={apt._id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div style={styles.avatar}>
                        {apt.patient?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <h3 style={styles.patientName}>{apt.patient?.name}</h3>
                        <p style={styles.patientInfo}>{apt.patient?.email}</p>
                      </div>
                      <span style={{
                        ...styles.status,
                        background: getStatusColor(apt.status)
                      }}>
                        {apt.status}
                      </span>
                    </div>
                    <p style={styles.info}>📅 Date: {apt.date}</p>
                    <p style={styles.info}>⏰ Time: {apt.timeSlot}</p>
                    {apt.symptoms && (
                      <p style={styles.info}>🤒 Symptoms: {apt.symptoms}</p>
                    )}
                    {apt.status === 'pending' && (
                      <div style={styles.btnGroup}>
                        <button
                          style={styles.confirmBtn}
                          onClick={() => updateStatus(apt._id, 'confirmed')}
                        >
                          ✅ Confirm
                        </button>
                        <button
                          style={styles.cancelBtn}
                          onClick={() => updateStatus(apt._id, 'cancelled')}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        style={styles.confirmBtn}
                        onClick={() => updateStatus(apt._id, 'completed')}
                      >
                        ✅ Mark Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && profile && (
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.profileAvatar}>
                {profile.user?.name?.charAt(0) || 'D'}
              </div>
              <div>
                <h2 style={styles.profileName}>{profile.user?.name}</h2>
                <span style={styles.spec}>{profile.specialization}</span>
              </div>
            </div>
            <div style={styles.profileDetails}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Experience</span>
                <span style={styles.detailValue}>{profile.experience} years</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Consultation Fees</span>
                <span style={styles.detailValue}>₹{profile.fees}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Rating</span>
                <span style={styles.detailValue}>⭐ {profile.rating || 'No ratings yet'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Status</span>
                <span style={{
                  ...styles.detailValue,
                  color: profile.isApproved ? '#10b981' : '#f59e0b'
                }}>
                  {profile.isApproved ? '✅ Approved' : '⏳ Pending Approval'}
                </span>
              </div>
            </div>
            {profile.about && (
              <p style={styles.about}>{profile.about}</p>
            )}
            <div style={styles.slotsSection}>
              <h3 style={styles.slotsTitle}>Available Slots</h3>
              {profile.availableSlots.map((slot, i) => (
                <span key={i} style={styles.slot}>
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f0f4ff' },
  content: { padding: '30px', maxWidth: '1200px', margin: '0 auto' },
  heading: { fontSize: '28px', fontWeight: '700', color: '#333', marginBottom: '20px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' },
  statCard: {
    background: 'white', borderRadius: '12px', padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  statNumber: { fontSize: '32px', fontWeight: '700', color: '#333', margin: '0 0 5px' },
  statLabel: { fontSize: '13px', color: '#888', margin: '0' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px' },
  tab: {
    padding: '10px 20px', border: '2px solid #667eea', borderRadius: '10px',
    background: 'white', color: '#667eea', cursor: 'pointer', fontWeight: '600', fontSize: '14px'
  },
  activeTab: { background: '#667eea', color: 'white' },
  loading: { textAlign: 'center', color: '#888', fontSize: '16px', padding: '40px' },
  empty: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '18px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: {
    background: 'white', borderRadius: '15px', padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  avatar: {
    width: '45px', height: '45px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontSize: '18px', fontWeight: '700', flexShrink: 0
  },
  patientName: { margin: '0', fontSize: '15px', fontWeight: '700', color: '#333' },
  patientInfo: { margin: '2px 0 0', fontSize: '12px', color: '#888' },
  status: {
    color: 'white', padding: '4px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '600', textTransform: 'capitalize',
    marginLeft: 'auto', flexShrink: 0
  },
  info: { margin: '5px 0', fontSize: '13px', color: '#555' },
  btnGroup: { display: 'flex', gap: '8px', marginTop: '12px' },
  confirmBtn: {
    flex: 1, padding: '8px', background: '#dcfce7',
    color: '#10b981', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '13px'
  },
  cancelBtn: {
    flex: 1, padding: '8px', background: '#fee2e2',
    color: '#ef4444', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '13px'
  },
  profileCard: {
    background: 'white', borderRadius: '15px', padding: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)', maxWidth: '600px'
  },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' },
  profileAvatar: {
    width: '70px', height: '70px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontSize: '28px', fontWeight: '700'
  },
  profileName: { margin: '0 0 8px', fontSize: '22px', fontWeight: '700', color: '#333' },
  spec: {
    background: '#f0f4ff', color: '#667eea', padding: '4px 12px',
    borderRadius: '20px', fontSize: '13px', fontWeight: '600'
  },
  profileDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' },
  detailItem: {
    background: '#f8f9ff', borderRadius: '10px', padding: '15px',
    display: 'flex', flexDirection: 'column', gap: '5px'
  },
  detailLabel: { fontSize: '12px', color: '#888', fontWeight: '600' },
  detailValue: { fontSize: '16px', color: '#333', fontWeight: '700' },
  about: { color: '#666', fontSize: '14px', fontStyle: 'italic', marginBottom: '20px' },
  slotsSection: { marginTop: '15px' },
  slotsTitle: { fontSize: '15px', fontWeight: '700', color: '#333', marginBottom: '10px' },
  slot: {
    display: 'inline-block', background: '#f0fff4', color: '#10b981',
    padding: '5px 12px', borderRadius: '8px', fontSize: '13px',
    margin: '4px', fontWeight: '600'
  }
};

export default DoctorDashboard;