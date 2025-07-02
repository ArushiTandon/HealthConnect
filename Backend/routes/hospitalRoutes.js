const express = require('express');
const router = express.Router();
const {
  getHospitals,
  getFilterOptions,
  getHospitalById,
} = require('../controllers/hospitalController');
const { jwtAuthMiddleware } = require('../middlewares/jwt');

router.get('/filter', jwtAuthMiddleware, getHospitals);
router.get('/filter-options', jwtAuthMiddleware, getFilterOptions);
router.get('/fetch/:id', jwtAuthMiddleware, getHospitalById);


module.exports = router;
