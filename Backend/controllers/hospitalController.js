const Hospital = require('../models/Hospital');

// exports.updateBeds = async (req, res) => {
//   const { id } = req.params;
//   const { availableBeds } = req.body;

//   try {
//     const hospital = await Hospital.findById(id);
//     if (!hospital) return res.status(404).json({ error: "Hospital not found" });

//     hospital.availableBeds = availableBeds;
//     hospital.lastUpdated = new Date();
    
//     await hospital.save();
//     res.status(200).json({ message: "Bed availability updated", hospital });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.getHospitals = async (req, res) => {

  try {
    const { city, facility, beds, sort, search } = req.query;

    const filter = {};

    // city match
    if (city) {
      filter.city = { $regex: new RegExp(city, 'i') };
    }

    // facility match
    if (facility) {
      filter.facilities = { $elemMatch: { $regex: new RegExp(facility, 'i') } };
    }

    // Filter for available beds
    if (beds === 'true') {
      filter.availableBeds = { $gt: 0 };
    }

    // Search by hospital name
    if (search) {
      filter.name = { $regex: new RegExp(search, 'i') };
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
    console.log("*****", hospitals);

    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
};

exports.getHospitalById = async (req, res) => {

  try {
    const hospital = await Hospital.findById(req.params.id);
    onsole.log("Fetching hospital with ID:", id); // <-- ✅ Add here


    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    res.status(200).json(hospital);
  } catch (error) {
    console.error('Error fetching hospital by ID:', error);
    res.status(500).json({ error: 'Failed to fetch hospital' });
  }
};
