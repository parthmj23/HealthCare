const express = require('express');
const PatientController = require('../Controllers/PatientController');
const authMiddleware = require('../Middleware/Auth');
const router = express.Router();

router.post('/register', PatientController.register); 
router.post('/login', PatientController.login); 
router.get('/', PatientController.getAllPatients); 
router.get('/:id', PatientController.getPatientById); 

module.exports = router;
