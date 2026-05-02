import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('doctors');
  const [searchSpec, setSearchSpec] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '',
    symptoms: ''
  });
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get('/doctors');
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
    setLoading(false);
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('/appointments/patient');
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/appointments', {
        doctorId: selectedDoctor._id,
        ...bookingData
      });
      toast.success('Appointment booked successfully!');
      setShowBooking(false);
      setBookingData({ date: '', timeSlot: '', symptoms: '' });
      fetchAppointments();
      setActiveTab('appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`/appointments/${id}/cancel`);
      toast.success('Appointment cancelled!');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const specializations = ['All', ...new Set(doctors.map(doc => doc.specialization))];

  const filteredDoctors = doctors.filter(doc =>
    searchSpec === '' || searchSpec === 'All'
      ? true
      : doc.specialization.toLowerCase().includes(searchSpec.toLowerCase())
  );

  const getSpecColor = (spec) => {
    const colors = {
      'Cardiologist': '#ef4444',
      'Dermatologist': '#f59e0b',
      'Neurologist': '#8b5cf6',
      'Pediatrician': '#10b981',
      'Orthopedic': '#3b82f6',
      'Gynecologist': '#ec4899',
      'Dentist': '#06b6d4',
      'Psychiatrist': '#6366f1'
    };
    return colors[spec] || '#667eea';
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
        <div style={styles.banner}>
          <div>
            <h1 style={styles.bannerTitle}>👋 Welcome back!</h1>
            <p style={styles.bannerSubtitle}>Find the best doctors and book appointments instantly</p>
          </div>
          <div style={styles.bannerStats}>
            <div style={styles.bannerStat}>
              <span style={styles.bannerStatNum}>{doctors.length}</span>
              <span style={styles.bannerStatLabel}>Doctors</span>
            </div>
            <div style={styles.bannerStat}>
              <span style={styles.bannerStatNum}>{appointments.length}</span>
              <span style={styles.bannerStatLabel}>My Appointments</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'doctors' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('doctors')}
          >
            👨‍⚕️ Find Doctors
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'appointments' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('appointments')}
          >
            📅 My Appointments ({appointments.length})
          </button>
        </div>

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div>
            <input
              style={styles.search}
              type="text"
              placeholder="🔍 Search by specialization (e.g. Cardiologist)"
              value={searchSpec}
              onChange={(e) => setSearchSpec(e.target.value)}
            />
            <div style={styles.filterBtns}>
              {specializations.map(spec => (
                <button
                  key={spec}
                  style={{
                    ...styles.filterBtn,
                    ...(searchSpec === spec || (spec === 'All' && searchSpec === '')
                      ? styles.filterBtnActive : {})
                  }}
                  onClick={() => setSearchSpec(spec === 'All' ? '' : spec)}
                >
                  {spec}
                </button>
              ))}
            </div>
            {loading ? (
              <p style={styles.loading}>Loading doctors...</p>
            ) : filteredDoctors.length === 0 ? (
              <p style={styles.loading}>No doctors found</p>
            ) : (
              <div style={styles.grid}>
                {filteredDoctors.map(doctor => (
                  <div key={doctor._id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div style={styles.avatar}>
                        {doctor.user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={styles.doctorName}>{doctor.user.name}</h3>
                        <span style={{
                        ...styles.spec,
                        background: getSpecColor(doctor.specialization) + '20',
                        color: getSpecColor(doctor.specialization)
                      }}>
                        {doctor.specialization}
                      </span>
                      </div>
                    </div>
                    <div style={styles.cardBody}>
                      <p style={styles.info}>⏱️ {doctor.experience} years experience</p>
                      <p style={styles.info}>💰 ₹{doctor.fees} per consultation</p>
                      <p style={styles.info}>⭐ {doctor.rating || 'No ratings yet'}</p>
                      {doctor.about && <p style={styles.about}>{doctor.about}</p>}
                    </div>
                    <div style={styles.slots}>
                      <p style={styles.slotsTitle}>Available Days:</p>
                      {doctor.availableSlots.map((slot, i) => (
                        <span key={i} style={styles.slot}>
                          {slot.day} {slot.startTime}-{slot.endTime}
                        </span>
                      ))}
                    </div>
                    <button
                      style={styles.bookBtn}
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setShowBooking(true);
                      }}
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            {appointments.length === 0 ? (
              <div style={styles.empty}>
                <p>📅 No appointments yet</p>
                <button style={styles.bookBtn} onClick={() => setActiveTab('doctors')}>
                  Find a Doctor
                </button>
              </div>
            ) : (
              <div style={styles.grid}>
                {appointments.map(apt => (
                  <div key={apt._id} style={styles.aptCard}>
                    <div style={styles.aptHeader}>
                      <h3 style={styles.doctorName}>
                        {apt.doctor?.user?.name || 'Doctor'}
                      </h3>
                      <span style={{
                        ...styles.status,
                        background: getStatusColor(apt.status)
                      }}>
                        {apt.status}
                      </span>
                    </div>
                    <p style={styles.info}>🏥 {apt.doctor?.specialization}</p>
                    <p style={styles.info}>📅 {apt.date}</p>
                    <p style={styles.info}>⏰ {apt.timeSlot}</p>
                    {apt.symptoms && <p style={styles.info}>🤒 {apt.symptoms}</p>}
                    {apt.status === 'pending' && (
                      <button
                        style={styles.cancelBtn}
                        onClick={() => handleCancel(apt._id)}
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Booking Modal */}
        {showBooking && selectedDoctor && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h2 style={styles.modalTitle}>
                Book Appointment with {selectedDoctor.user.name}
              </h2>
              <p style={styles.info}>🏥 {selectedDoctor.specialization} | 💰 ₹{selectedDoctor.fees}</p>
              <form onSubmit={handleBooking}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Select Date</label>
                  <input
                    style={styles.input}
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Select Time Slot</label>
                  <select
                    style={styles.input}
                    value={bookingData.timeSlot}
                    onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                    required
                  >
                    <option value="">Choose a time slot</option>
                    {selectedDoctor.availableSlots.map((slot, i) => (
                      <option key={i} value={`${slot.startTime}-${slot.endTime}`}>
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Symptoms (Optional)</label>
                  <textarea
                    style={{ ...styles.input, height: '80px' }}
                    placeholder="Describe your symptoms..."
                    value={bookingData.symptoms}
                    onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                  />
                </div>
                <div style={styles.modalBtns}>
                  <button type="submit" style={styles.bookBtn}>
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    style={styles.cancelBtn}
                    onClick={() => setShowBooking(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
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
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px' },
  tab: {
    padding: '10px 20px', border: '2px solid #667eea', borderRadius: '10px',
    background: 'white', color: '#667eea', cursor: 'pointer', fontWeight: '600', fontSize: '14px'
  },
  activeTab: { background: '#667eea', color: 'white' },
  search: {
    width: '100%', padding: '12px 15px', border: '2px solid #eee',
    borderRadius: '10px', fontSize: '14px', marginBottom: '20px',
    boxSizing: 'border-box', outline: 'none'
  },
  loading: { textAlign: 'center', color: '#888', fontSize: '16px', padding: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: {
    background: 'white', borderRadius: '15px', padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: {
    width: '50px', height: '50px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontSize: '20px', fontWeight: '700'
  },
  doctorName: { margin: '0', fontSize: '16px', fontWeight: '700', color: '#333' },
  spec: {
    background: '#f0f4ff', color: '#667eea', padding: '3px 10px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '600'
  },
  cardBody: { marginBottom: '15px' },
  info: { margin: '5px 0', fontSize: '13px', color: '#555' },
  about: { margin: '8px 0', fontSize: '13px', color: '#777', fontStyle: 'italic' },
  slots: { marginBottom: '15px' },
  slotsTitle: { fontSize: '12px', fontWeight: '600', color: '#444', margin: '0 0 8px' },
  slot: {
    display: 'inline-block', background: '#f0fff4', color: '#10b981',
    padding: '3px 8px', borderRadius: '5px', fontSize: '11px',
    margin: '2px', fontWeight: '600'
  },
  bookBtn: {
    width: '100%', padding: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px'
  },
  cancelBtn: {
    width: '100%', padding: '10px', background: '#fee2e2',
    color: '#ef4444', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '8px'
  },
  aptCard: {
    background: 'white', borderRadius: '15px', padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  aptHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  status: {
    color: 'white', padding: '4px 12px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '600', textTransform: 'capitalize'
  },
  empty: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '18px' },
  modal: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modalContent: {
    background: 'white', borderRadius: '20px', padding: '40px',
    width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
  },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '10px' },
  modalBtns: { display: 'flex', flexDirection: 'column', gap: '10px' },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#444' },
  input: {
    width: '100%', padding: '10px 15px', border: '2px solid #eee',
    borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  },
  filterBtns: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' },
  filterBtn: {
    padding: '6px 16px', border: '2px solid #667eea', borderRadius: '20px',
    background: 'white', color: '#667eea', cursor: 'pointer',
    fontWeight: '600', fontSize: '13px'
  },
  filterBtnActive: { background: '#667eea', color: 'white' },
banner: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '15px', padding: '25px 30px', marginBottom: '25px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    color: 'white'
  },
  bannerTitle: { fontSize: '24px', fontWeight: '700', margin: '0 0 5px' },
  bannerSubtitle: { fontSize: '14px', opacity: '0.9', margin: '0' },
  bannerStats: { display: 'flex', gap: '30px' },
  bannerStat: { textAlign: 'center' },
  bannerStatNum: { display: 'block', fontSize: '28px', fontWeight: '700' },
  bannerStatLabel: { fontSize: '12px', opacity: '0.9' },
};

export default PatientDashboard;