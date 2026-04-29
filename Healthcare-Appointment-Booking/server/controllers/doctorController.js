const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all approved doctors
// @route   GET /api/doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: true }).populate('user', 'name email phone profilePic');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone profilePic');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create doctor profile
// @route   POST /api/doctors
const createDoctorProfile = async (req, res) => {
  try {
    const { specialization, experience, fees, about, availableSlots } = req.body;

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ user: req.user._id });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    const doctor = await Doctor.create({
      user: req.user._id,
      specialization,
      experience,
      fees,
      about,
      availableSlots
    });

    // Update user role to doctor
    await User.findByIdAndUpdate(req.user._id, { role: 'doctor' });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctors by specialization
// @route   GET /api/doctors/specialization/:spec
const getDoctorsBySpecialization = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      specialization: req.params.spec,
      isApproved: true
    }).populate('user', 'name email phone profilePic');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
  getDoctorsBySpecialization
};