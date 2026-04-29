const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  about: {
    type: String,
    default: ''
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  availableSlots: [
    {
      day: String,
      startTime: String,
      endTime: String
    }
  ],
  rating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);