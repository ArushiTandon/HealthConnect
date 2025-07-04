const express = require('express');
const router =  express.Router();
const appointmentController = require('../controllers/appointmentController');
const { jwtAuthMiddleware } = require('../middlewares/jwt');


router.post('/create', jwtAuthMiddleware, appointmentController.createAppointment);

router.get('/get-appointments/:id', jwtAuthMiddleware, appointmentController.getUserAppointments);

router.put('/cancel/:id', jwtAuthMiddleware, appointmentController.cancelAppointment);

module.exports = router;