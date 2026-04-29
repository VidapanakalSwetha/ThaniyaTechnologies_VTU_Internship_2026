const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
  getDoctorsBySpecialization
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/specialization/:spec', getDoctorsBySpecialization);

// Protected routes (need to be logged in)
router.post('/', protect, createDoctorProfile);
router.put('/:id', protect, updateDoctorProfile);

module.exports = router;