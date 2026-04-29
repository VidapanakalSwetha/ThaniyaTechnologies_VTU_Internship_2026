const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments
} = require('../controllers/appointmentController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All routes are protected
router.post('/', protect, bookAppointment);
router.get('/patient', protect, getPatientAppointments);
router.get('/doctor', protect, getDoctorAppointments);
router.get('/all', protect, isAdmin, getAllAppointments);
router.put('/:id', protect, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;