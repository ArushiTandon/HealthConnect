const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const hospitalData = require('../data/hospital.json');

require('dotenv').config();

const seedHospitals = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    await Hospital.deleteMany(); // Clear existing
    await Hospital.insertMany(hospitalData); // Insert fresh
    console.log("Hospitals seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Error seeding hospitals:", err);
    process.exit(1);
  }
};

seedHospitals();
