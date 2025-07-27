const User = require('../models/User');
const Hospital = require('../models/Hospital');
const { generateToken } = require('../middlewares/jwt');
const mongoose = require('mongoose');

exports.signUp = async (req, res) => {
  const { username, email, password, role, hospitalId } = req.body;

  try {
  
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    if (role === 'hospital') {
     
      if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
        return res.status(400).json({ error: 'Invalid hospital ID format' });
      }

    
      const hospitalExists = await Hospital.findById(hospitalId);
      if (!hospitalExists) {
        return res.status(404).json({ error: 'Hospital not found' });
      }

  
      const existingHospitalAdmin = await User.findOne({ role: 'hospital', hospitalId });
      if (existingHospitalAdmin) {
        return res.status(400).json({ error: 'This hospital already has an admin.' });
      }
    }

  
    const user = await User.create({ username, email, password, role, hospitalId });

    return res.status(201).json({ userId: user._id, message: 'ACCOUNT CREATED!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {

        const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload = {
      id: user._id,
      hospitalId: user.hospitalId,
      username: user.username,
      role: user.role,
    };
    const token = generateToken(payload);

    res.status(200).json({
      message: 'Login successful!',
      token,
      data:payload,
    });
        
    } catch (error) {
        
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}