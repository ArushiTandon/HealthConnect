const express = require('express');
const router =  express.Router();
const appointmentController = require('../controllers/appointmentController');
const { jwtAuthMiddleware } = require('../middlewares/jwt');

const onlyHospitalAdmins = (req, res, next) => {
  if (req.user.role !== 'hospital') {
    return res.status(403).json({ error: 'Access denied. Only hospital admins allowed.' });
  }
  next();
};


router.post('/create', jwtAuthMiddleware, appointmentController.createAppointment);

router.get('/get-appointments/:id', jwtAuthMiddleware, appointmentController.getAppointmentsByUserId);

router.put('/update/:id', jwtAuthMiddleware, appointmentController.updateAppointment);

module.exports = router;