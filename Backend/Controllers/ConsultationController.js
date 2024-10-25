const Consultation = require('../Models/Consultation');

const ConsultationController = {
  requestConsultation: async (req, res) => {
    try {
      const images = req.files ? req.files.map(file => file.path) : [];
      const { doctorId, date, timeSlot } = req.body;

      const existingConsultation = await Consultation.findOne({
        where: { doctorId, date, timeSlot, status: 'Accepted' },
      });

      if (existingConsultation) {
        return res.status(400).json({ message: 'The selected time slot is not available.' });
      }

      const consultation = await Consultation.create({
        ...req.body,
        images,
      });

      res.status(201).json({ message: 'Consultation request created', consultation });
    } catch (error) {
      console.error('Error creating consultation:', error);
      res.status(400).json({ error: error.message });
    }
  },

  getAllConsultations: async (req, res) => {
    try {
      const consultations = await Consultation.findAll();
      res.json(consultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      res.status(400).json({ error: error.message });
    }
  },

  updateStatus: async (req, res) => {
    try {
      if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied. Only doctors can update the status.' });
      }

      const consultationId = req.params.id;
      const consultation = await Consultation.findByPk(consultationId);

      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' });
      }

      consultation.status = 'Accepted'; 
      await consultation.save();

      res.json({ message: 'Consultation status updated', consultation });
    } catch (error) {
      console.error('Error updating consultation status:', error);
      res.status(400).json({ error: error.message });
    }
  },

  getConsultationById: async (req, res) => {
    try {
      const consultation = await Consultation.findByPk(req.params.id);
      if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
      res.json(consultation);
    } catch (error) {
      console.error('Error fetching consultation:', error);
      res.status(400).json({ error: error.message });
    }
  },

  getAvailableSlots: async (req, res) => {
    try {
      const { doctorId, date } = req.query;

      const bookedConsultations = await Consultation.findAll({
        where: {
          doctorId,
          date,
          status: 'Accepted',
        },
        attributes: ['timeSlot'],
      });

      const allSlots = [
        '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
        '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00'
      ];

      const bookedSlots = bookedConsultations.map((consultation) => consultation.timeSlot);
      const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

      res.json({ availableSlots });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = ConsultationController;
