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
  const hospitalId = req.user.hospitalId;
  const { availableBeds } = req.body;

  // Input validation
  if (availableBeds === undefined || availableBeds === null) {
    return res.status(400).json({ error: 'availableBeds is required' });
  }

  if (typeof availableBeds !== 'number' || availableBeds < 0) {
    return res.status(400).json({ error: 'availableBeds must be a non-negative number' });
  }

  try {
    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { availableBeds, lastUpdated: new Date() },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Emit to users in that hospital room only
    req.io.to(hospitalId).emit("bedAvailabilityUpdated", {
      hospitalId,
      availableBeds,
      lastUpdated: hospital.lastUpdated
    });

    res.status(200).json({ message: "Available beds updated", hospital });
  } catch (error) {
    console.error("Error updating beds:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateFacilityStatus = async (req, res) => {
  const hospitalId = req.user.hospitalId; 
  const { facility, status } = req.body;

  // Validate input
  if (!facility || !status) {
    return res.status(400).json({ error: 'facility and status are required' });
  }

  if (!['Available', 'Unavailable'].includes(status)) {
    return res.status(400).json({ error: 'status must be either "Available" or "Unavailable"' });
  }

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found for this admin' });
    }

    if (!hospital.facilityStatus) {
      hospital.facilityStatus = new Map();
    }

    hospital.facilityStatus.set(facility, status);
    hospital.lastUpdated = new Date();

    await hospital.save();

    // Convert Map to Object for emission
    const facilityStatusObj = {};
    if (hospital.facilityStatus && hospital.facilityStatus.size > 0) {
      for (let [key, value] of hospital.facilityStatus) {
        facilityStatusObj[key] = value;
      }
    } else {
      // If facilityStatus is empty, convert it properly
      facilityStatusObj[facility] = status;
    }

    // ✅ FIXED: Send the complete facilityStatus object
    req.io.to(hospitalId).emit("facilityStatusUpdated", {
      hospitalId,
      facilityStatus: facilityStatusObj,  // ✅ Send complete object
      lastUpdated: hospital.lastUpdated
    });

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

    const updatedFields = {}; 

    if (name !== undefined) {
      hospital.name = name;
      updatedFields.name = name;
    }
    if (address !== undefined) {
      hospital.address = address;
      updatedFields.address = address;
    }
    if (contactNumber !== undefined) {
      hospital.contactNumber = contactNumber;
      updatedFields.contactNumber = contactNumber;
    }
    if (email !== undefined) {
      hospital.email = email;
      updatedFields.email = email;
    }
    if (website !== undefined) {
      hospital.website = website;
      updatedFields.website = website;
    }
    if (notes !== undefined) {
      hospital.notes = notes;
      updatedFields.notes = notes;
    }
    
    if (medicalSpecialties !== undefined) {
      if (typeof medicalSpecialties === 'string') {
        hospital.medicalSpecialties = medicalSpecialties
          .split(',')
          .map(specialty => specialty.trim())
          .filter(specialty => specialty.length > 0);
      } else if (Array.isArray(medicalSpecialties)) {
        hospital.medicalSpecialties = medicalSpecialties;
      }
      updatedFields.medicalSpecialties = hospital.medicalSpecialties;
    }

    hospital.lastUpdated = new Date();

    await hospital.save();

    req.io.to(req.user.hospitalId).emit("hospitalInfoUpdated", {
      hospitalId: req.user.hospitalId,
      updatedFields: updatedFields,
      lastUpdated: hospital.lastUpdated
    });

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