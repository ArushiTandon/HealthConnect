const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  totalBeds: {
    type: Number,
    required: true,
  },
  availableBeds: {
    type: Number,
    required: true,
  },
  icuBeds: {
    type: Number,
    default: 0,
  },
  emergencyBeds: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  facilities: {
    type: [String], 
    required: true,
  },
  facilityStatus: {
    type: Map,
    of: String, 
    default: {},
  },
  medicalSpecialties: {
    type: [String], 
    required: true,
  },
  rating: {
    type: Number,
    default: 4.0,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model('Hospital', hospitalSchema);
