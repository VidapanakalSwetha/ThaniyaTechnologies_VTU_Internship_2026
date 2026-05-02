import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchDoctors();
    fetchUsers();
    fetchAppointments();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/admin/stats');
      setStats(data);
    } catch (error) {
      toast.error('Failed to fetch stats');
    }
    setLoading(false);
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get('/admin/doctors');
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('/appointments/all');
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
  };

  const handleApprove = async (id, isApproved) => {
    try {
      await axios.put(`/admin/doctors/${id}/approve`, { isApproved });
      toast.success(`Doctor ${isApproved ? 'approved' : 'rejected'} successfully!`);
      fetchDoctors();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update doctor status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/admin/users/${id}`);
        toast.success('User deleted successfully!');
        fetchUsers();
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete user');
      }
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
        <h1 style={styles.heading}>Admin Dashboard</h1>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #667eea' }}>
            <h3 style={styles.statNumber}>{stats.totalUsers || 0}</h3>
            <p style={styles.statLabel}>Total Patients</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #10b981' }}>
            <h3 style={styles.statNumber}>{stats.totalDoctors || 0}</h3>
            <p style={styles.statLabel}>Approved Doctors</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #f59e0b' }}>
            <h3 style={styles.statNumber}>{stats.pendingDoctors || 0}</h3>
            <p style={styles.statLabel}>Pending Approvals</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #6366f1' }}>
            <h3 style={styles.statNumber}>{stats.totalAppointments || 0}</h3>
            <p style={styles.statLabel}>Total Appointments</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #ec4899' }}>
            <h3 style={styles.statNumber}>{stats.completedAppointments || 0}</h3>
            <p style={styles.statLabel}>Completed</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['overview', 'doctors', 'users', 'appointments'].map(tab => (
            <button
              key={tab}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'doctors' && `👨‍⚕️ Doctors (${doctors.length})`}
              {tab === 'users' && `👥 Users (${users.length})`}
              {tab === 'appointments' && `📅 Appointments (${appointments.length})`}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={styles.overviewGrid}>
            <div style={styles.overviewCard}>
              <h3 style={styles.overviewTitle}>⏳ Pending Doctor Approvals</h3>
              {doctors.filter(d => !d.isApproved).length === 0 ? (
                <p style={styles.empty}>No pending approvals</p>
              ) : (
                doctors.filter(d => !d.isApproved).map(doctor => (
                  <div key={doctor._id} style={styles.pendingItem}>
                    <div>
                      <p style={styles.pendingName}>{doctor.user?.name}</p>
                      <p style={styles.pendingSpec}>{doctor.specialization}</p>
                    </div>
                    <div style={styles.pendingBtns}>
                      <button
                        style={styles.approveBtn}
                        onClick={() => handleApprove(doctor._id, true)}
                      >
                        ✅ Approve
                      </button>
                      <button
                        style={styles.rejectBtn}
                        onClick={() => handleApprove(doctor._id, false)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={styles.overviewCard}>
              <h3 style={styles.overviewTitle}>📅 Recent Appointments</h3>
              {appointments.slice(0, 5).map(apt => (
                <div key={apt._id} style={styles.recentItem}>
                  <div>
                    <p style={styles.pendingName}>{apt.patient?.name}</p>
                    <p style={styles.pendingSpec}>{apt.date} | {apt.timeSlot}</p>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    background: getStatusColor(apt.status)
                  }}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div style={styles.grid}>
            {doctors.map(doctor => (
              <div key={doctor._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.avatar}>
                    {doctor.user?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h3 style={styles.name}>{doctor.user?.name}</h3>
                    <p style={styles.subInfo}>{doctor.specialization}</p>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    background: doctor.isApproved ? '#10b981' : '#f59e0b'
                  }}>
                    {doctor.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p style={styles.info}>⏱️ {doctor.experience} years experience</p>
                <p style={styles.info}>💰 ₹{doctor.fees} per consultation</p>
                <p style={styles.info}>📧 {doctor.user?.email}</p>
                <div style={styles.btnGroup}>
                  {!doctor.isApproved ? (
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleApprove(doctor._id, true)}
                    >
                      ✅ Approve
                    </button>
                  ) : (
                    <button
                      style={styles.rejectBtn}
                      onClick={() => handleApprove(doctor._id, false)}
                    >
                      🚫 Revoke Approval
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={styles.tableRow}>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.roleBadge,
                        background: user.role === 'admin' ? '#667eea' :
                          user.role === 'doctor' ? '#10b981' : '#f59e0b'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.td}>{user.phone || 'N/A'}</td>
                    <td style={styles.td}>
                      {user.role !== 'admin' && (
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Doctor</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Time Slot</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt._id} style={styles.tableRow}>
                    <td style={styles.td}>{apt.patient?.name}</td>
                    <td style={styles.td}>{apt.doctor?.user?.name}</td>
                    <td style={styles.td}>{apt.date}</td>
                    <td style={styles.td}>{apt.timeSlot}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        background: getStatusColor(apt.status)
                      }}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' },
  statCard: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  statNumber: { fontSize: '32px', fontWeight: '700', color: '#333', margin: '0 0 5px' },
  statLabel: { fontSize: '13px', color: '#888', margin: '0' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' },
  tab: { padding: '10px 20px', border: '2px solid #667eea', borderRadius: '10px', background: 'white', color: '#667eea', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  activeTab: { background: '#667eea', color: 'white' },
  overviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  overviewCard: { background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  overviewTitle: { fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '15px' },
  empty: { color: '#888', fontSize: '14px', textAlign: 'center', padding: '20px' },
  pendingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  pendingName: { margin: '0', fontSize: '14px', fontWeight: '600', color: '#333' },
  pendingSpec: { margin: '3px 0 0', fontSize: '12px', color: '#888' },
  pendingBtns: { display: 'flex', gap: '8px' },
  recentItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  approveBtn: { padding: '6px 12px', background: '#dcfce7', color: '#10b981', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' },
  rejectBtn: { padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  avatar: { width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: '700', flexShrink: 0 },
  name: { margin: '0', fontSize: '15px', fontWeight: '700', color: '#333' },
  subInfo: { margin: '2px 0 0', fontSize: '12px', color: '#888' },
  info: { margin: '5px 0', fontSize: '13px', color: '#555' },
  btnGroup: { display: 'flex', gap: '8px', marginTop: '12px' },
  statusBadge: { color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize' },
  roleBadge: { color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize' },
  tableWrapper: { background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  th: { padding: '15px 20px', color: 'white', fontWeight: '600', fontSize: '14px', textAlign: 'left' },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '15px 20px', fontSize: '14px', color: '#555' },
  deleteBtn: { padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }
};

export default AdminDashboard;