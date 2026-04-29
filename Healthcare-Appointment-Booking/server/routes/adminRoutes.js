const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllDoctors,
  approveDoctor,
  deleteUser,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All admin routes are protected
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/doctors', protect, isAdmin, getAllDoctors);
router.get('/stats', protect, isAdmin, getDashboardStats);
router.put('/doctors/:id/approve', protect, isAdmin, approveDoctor);
router.delete('/users/:id', protect, isAdmin, deleteUser);

module.exports = router;