const express = require('express');
const router = express.Router();
const ConsultationController = require('../Controllers/ConsultationController');
const authMiddleware = require('../Middleware/Auth'); 
const upload = require('../Middleware/uploads');

router.post('/consultation', upload.array('images', 5), ConsultationController.requestConsultation);
router.get('/consultations', authMiddleware, ConsultationController.getAllConsultations);
router.get('/consultations/:id', authMiddleware, ConsultationController.getConsultationById);
router.patch('/consultations/:id/status', authMiddleware, ConsultationController.updateStatus);

router.get('/consultations/available-slots', authMiddleware, ConsultationController.getAvailableSlots);

module.exports = router;
