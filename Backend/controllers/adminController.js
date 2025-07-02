const Hospital = require('../models/Hospital');

exports.getHospitalDashboard = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.hospitalId);

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found for this admin' });
    }

    const occupancyRate = Math.round(
      ((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100
    );

    const updatedMinutesAgo = Math.floor(
      (Date.now() - new Date(hospital.lastUpdated)) / 60000
    );

    res.status(200).json({
      hospitalName: hospital.name,
      city: hospital.city,
      address: hospital.address,
      contactNumber: hospital.contactNumber,
      email: hospital.email,
      website: hospital.website,
      totalBeds: hospital.totalBeds,
      availableBeds: hospital.availableBeds,
      icuBeds: hospital.icuBeds,
      emergencyBeds: hospital.emergencyBeds,
      facilities: hospital.facilities,
      facilityStatus: hospital.facilityStatus,
      medicalSpecialties: hospital.medicalSpecialties,
      rating: hospital.rating,
      notes: hospital.notes,
      occupancyRate,
      lastUpdated: hospital.lastUpdated,
      metrics: {
        criticalOccupancy: occupancyRate > 90,
        updatedMinutesAgo,
      }
    });
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Server error fetching dashboard' });
  }
};

exports.updateAvailableBeds = async (req, res) => {
  const { availableBeds } = req.body;

  if (availableBeds === undefined) {
    return res.status(400).json({ error: 'availableBeds is required' });
  }

  try {
    const hospital = await Hospital.findById(req.user.hospitalId);

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found for this admin' });
    }

    hospital.availableBeds = availableBeds;
    hospital.lastUpdated = new Date();

    await hospital.save();

    res.status(200).json({
      message: 'Available beds updated successfully',
      availableBeds: hospital.availableBeds,
      lastUpdated: hospital.lastUpdated
    });
  } catch (err) {
    console.error('Error updating available beds:', err);
    res.status(500).json({ error: 'Server error while updating available beds' });
  }
};

exports.updateFacilityStatus = async (req, res) => {
  const { facility, status } = req.body;

  // Validate input
  if (!facility || !status) {
    return res.status(400).json({ error: 'facility and status are required' });
  }

  if (!['Available', 'Unavailable'].includes(status)) {
    return res.status(400).json({ error: 'status must be either "Available" or "Unavailable"' });
  }

  try {
    const hospital = await Hospital.findById(req.user.hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found for this admin' });
    }

    if (!hospital.facilityStatus) {
      hospital.facilityStatus = new Map();
    }

    // Update the facility status
    hospital.facilityStatus.set(facility, status);
    hospital.lastUpdated = new Date();

    await hospital.save();

    // Return the updated facility status
    const facilityStatusObj = {};
    for (let [key, value] of hospital.facilityStatus) {
      facilityStatusObj[key] = value;
    }

    res.status(200).json({
      message: `Facility status for "${facility}" updated to "${status}"`,
      facilityStatus: facilityStatusObj,
      lastUpdated: hospital.lastUpdated
    });
  } catch (err) {
    console.error('Error updating facility status:', err);
    res.status(500).json({ error: 'Server error while updating facility status' });
  }
};

exports.updateHospitalInfo = async (req, res) => {
  const { 
    name, 
    address, 
    contactNumber, 
    email, 
    website, 
    notes,
    medicalSpecialties 
  } = req.body;

  try {
    const hospital = await Hospital.findById(req.user.hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found for this admin' });
    }

  
    if (name !== undefined) hospital.name = name;
    if (address !== undefined) hospital.address = address;
    if (contactNumber !== undefined) hospital.contactNumber = contactNumber;
    if (email !== undefined) hospital.email = email;
    if (website !== undefined) hospital.website = website;
    if (notes !== undefined) hospital.notes = notes;
    
    
    if (medicalSpecialties !== undefined) {
      if (typeof medicalSpecialties === 'string') {
        hospital.medicalSpecialties = medicalSpecialties
          .split(',')
          .map(specialty => specialty.trim())
          .filter(specialty => specialty.length > 0);
      } else if (Array.isArray(medicalSpecialties)) {
        hospital.medicalSpecialties = medicalSpecialties;
      }
    }

    hospital.lastUpdated = new Date();

    await hospital.save();

    res.status(200).json({
      message: 'Hospital information updated successfully',
      hospital: {
        name: hospital.name,
        address: hospital.address,
        contactNumber: hospital.contactNumber,
        email: hospital.email,
        website: hospital.website,
        notes: hospital.notes,
        medicalSpecialties: hospital.medicalSpecialties,
        lastUpdated: hospital.lastUpdated
      }
    });
  } catch (err) {
    console.error('Error updating hospital info:', err);
    res.status(500).json({ error: 'Server error while updating hospital information' });
  }
};


exports.getFacilityStatus = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found for this admin' });
    }

    const facilityStatusObj = {};
    if (hospital.facilityStatus) {
      for (let [key, value] of hospital.facilityStatus) {
        facilityStatusObj[key] = value;
      }
    }

    res.status(200).json({
      facilityStatus: facilityStatusObj,
      facilities: hospital.facilities,
      lastUpdated: hospital.lastUpdated
    });
  } catch (err) {
    console.error('Error fetching facility status:', err);
    res.status(500).json({ error: 'Server error while fetching facility status' });
  }
};