const express = require('express');
const DoctorController = require('../Controllers/DoctorController');
const router = express.Router();

router.post('/register', DoctorController.register);
router.post('/login', DoctorController.login); 
router.get('/', DoctorController.getAllDoctors); 
router.get('/:id', DoctorController.getDoctorById); 

module.exports = router;
