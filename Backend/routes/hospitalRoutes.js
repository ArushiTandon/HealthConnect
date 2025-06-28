const express = require('express');
const router = express.Router();
const {
  getHospitals,
  getHospitalById,
} = require('../controllers/hospitalController');
const { jwtAuthMiddleware } = require('../middlewares/jwt');

router.get('/filter', jwtAuthMiddleware, getHospitals);
router.get('/gethospital/:id', jwtAuthMiddleware, getHospitalById);


module.exports = router;
