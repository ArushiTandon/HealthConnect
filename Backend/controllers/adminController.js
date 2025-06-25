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

  if (!facility || !status) {
    return res.status(400).json({ error: 'facility and status are required' });
  }

  try {
    const hospital = await Hospital.findById(req.user.hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found for this admin' });
    }

    hospital.facilityStatus.set(facility, status);
    hospital.lastUpdated = new Date();

    await hospital.save();

    res.status(200).json({
      message: `Facility status for "${facility}" updated to "${status}"`,
      facilityStatus: hospital.facilityStatus
    });
  } catch (err) {
    console.error('Error updating facility status:', err);
    res.status(500).json({ error: 'Server error while updating facility status' });
  }
};

exports.updateNotes = async (req, res) => {
  const { notes } = req.body;

  if (!notes) {
    return res.status(400).json({ error: 'notes field is required' });
  }

  try {
    const hospital = await Hospital.findById(req.user.hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found for this admin' });
    }

    hospital.notes = notes;
    hospital.lastUpdated = new Date();

    await hospital.save();

    res.status(200).json({
      message: 'Notes updated successfully',
      notes: hospital.notes
    });
  } catch (err) {
    console.error('Error updating notes:', err);
    res.status(500).json({ error: 'Server error while updating notes' });
  }
};
