const User = require('../models/User');
const { generateToken } = require('../middlewares/jwt');


exports.signUp = async (req, res) => {
    const {username, email, password, role, hospitalId } = req.body;

    try {

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const user = await User.create({ username, email, password, role, hospitalId });
        return res.status(201).json({ userId: user._id, message: 'ACCOUNT CREATED!' });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
        
    }
}

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
    });
        
    } catch (error) {
        
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}