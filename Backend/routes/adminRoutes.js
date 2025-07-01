const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { jwtAuthMiddleware } = require('../middlewares/jwt');

const onlyHospitalAdmins = (req, res, next) => {
  if (req.user.role !== 'hospital') {
    return res.status(403).json({ error: 'Access denied. Only hospital admins allowed.' });
  }
  next();
};


router.get('/dashboard', jwtAuthMiddleware, onlyHospitalAdmins, adminController.getHospitalDashboard);

router.put('/update-beds', jwtAuthMiddleware, onlyHospitalAdmins, adminController.updateAvailableBeds);

router.put('/update-facilities', jwtAuthMiddleware, onlyHospitalAdmins, adminController.updateFacilityStatus);

router.get('/facility-status', jwtAuthMiddleware, onlyHospitalAdmins, adminController.getFacilityStatus);

router.put('/update-info', jwtAuthMiddleware, onlyHospitalAdmins, adminController.updateHospitalInfo);


module.exports = router;

