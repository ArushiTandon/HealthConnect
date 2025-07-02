const Hospital = require('../models/Hospital');

exports.getHospitals = async (req, res) => {
  try {
    const { city, facility, specialty, beds, sort, search } = req.query;

    const filter = {};

    // City filter
    if (city && city !== 'All Cities') {
      filter.city = { $regex: new RegExp(city, 'i') };
    }

    if (facility) {
      if (facility !== 'All Facilities') {
        // Split comma-separated facilities and create filter
        const facilityArray = facility.split(',').map(f => f.trim());
        filter.facilities = { 
          $all: facilityArray.map(f => new RegExp(f, 'i'))
        };
      }
    }

    // Specialty filter
    if (specialty && specialty !== 'All Specialties') {
      filter.medicalSpecialties = { $elemMatch: { $regex: new RegExp(specialty, 'i') } };
    }

    // Filter for available beds
    if (beds === 'true') {
      filter.availableBeds = { $gt: 0 };
    }

    // Search by hospital name
     if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { city: { $regex: new RegExp(search, 'i') } }
      ];
    }

    console.log('Final filter:', filter);

    // Build query
    let query = Hospital.find(filter);

    // Sorting logic
    if (sort === 'availableBeds') {
      query = query.sort({ availableBeds: -1 });
    } else if (sort === 'name') {
      query = query.sort({ name: 1 });
    } else if (sort === 'lastUpdated') {
      query = query.sort({ lastUpdated: -1 });
    }

    const hospitals = await query;
    console.log("Filtered hospitals count:", hospitals.length);

    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
};


exports.getFilterOptions = async (req, res) => {
  try {
    // Get cities
    const cities = await Hospital.distinct('city');
    
    // Get facilities
    const facilities = await Hospital.distinct('facilities');
    
    
    const specialties = await Hospital.distinct('medicalSpecialties');

    res.status(200).json({
      cities: ['All Cities', ...cities.sort()],
      facilities: ['All Facilities', ...facilities.sort()],
      specialties: ['All Specialties', ...specialties.sort()],
      facilityCheckboxOptions: facilities.sort()
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
};

exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    console.log("Fetching hospital with ID:", req.params.id); 

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    res.status(200).json(hospital);
  } catch (error) {
    console.error('Error fetching hospital by ID:', error);
    res.status(500).json({ error: 'Failed to fetch hospital' });
  }
};