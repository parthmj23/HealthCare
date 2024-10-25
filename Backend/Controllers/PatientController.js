const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Patient = require('../Models/Patient');
const validator = require('validator'); 
const validatePassword = (password) => {
  const passwordRequirements = {
    minLength: 8,
    maxLength: 20,
    hasNumber: /\d/,
    hasUpperCase: /[A-Z]/,
    hasSpecialChar: /[!@#$%^&*]/,
  };

  if (password.length < passwordRequirements.minLength || password.length > passwordRequirements.maxLength) {
    return `Password should be between ${passwordRequirements.minLength} and ${passwordRequirements.maxLength} characters.`;
  }
  if (!passwordRequirements.hasNumber.test(password)) {
    return 'Password must contain at least one number.';
  }
  if (!passwordRequirements.hasUpperCase.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!passwordRequirements.hasSpecialChar.test(password)) {
    return 'Password must contain at least one special character.';
  }

  return null; 
};

const PatientController = {
  register: async (req, res) => {
    try {
      const { password, email } = req.body;

      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
        return res.status(400).json({ error: passwordValidationError });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const patient = await Patient.create({ ...req.body, password: hashedPassword });
      res.status(201).json(patient);
    } catch (error) {
      console.error('Error registering patient:', error);
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const patient = await Patient.findOne({ where: { email } });
      
      if (patient) {
        const isPasswordValid = await bcrypt.compare(password, patient.password);
        if (isPasswordValid) {
          const token = jwt.sign({ id: patient.id, role: 'patient' }, 'parth', { expiresIn: '1h' }); // Assign role 'patient'
          return res.json({ token });
        } else {
          return res.status(400).json({ message: 'Invalid password.' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid email.' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  getAllPatients: async (req, res) => {
    try {
      const patients = await Patient.findAll();
      res.json(patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(400).json({ error: error.message });
    }
  },

  getPatientById: async (req, res) => {
    try {
      const patient = await Patient.findByPk(req.params.id);
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
      res.json(patient);
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = PatientController;
