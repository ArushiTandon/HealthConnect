const express = require('express');
const router = express.Router();
const user = require('../models/User');
const adminController = require('../controllers/adminController');
const { jwtAuthMiddleware } = require('../middlewares/jwt');

const onlyHospitalAdmins = (req, res, next) => {
  if (req.user.role !== 'hospital') {
    return res.status(403).json({ error: 'Access denied. Only hospital admins allowed.' });
  }
  next();
};


router.get('/dashboard', jwtAuthMiddleware, onlyHospitalAdmins, adminController.getHospitalDashboard);

router.put('/hospital/update-beds', jwtAuthMiddleware, onlyHospitalAdmins, adminController.updateAvailableBeds);

router.put('/hospital/update-facilities', jwtAuthMiddleware, onlyHospitalAdmins, adminController.updateFacilityStatus);

router.put('/hospital/update-notes', jwtAuthMiddleware, onlyHospitalAdmins, adminController.updateNotes);


module.exports = router;

