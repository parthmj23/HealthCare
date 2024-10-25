const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Doctor = require('../Models/Doctor');
const validator = require('validator'); // Optional for additional validation

// Password validation function
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

  return null; // Password is valid
};

const DoctorController = {
  register: async (req, res) => {
    try {
      const { password, email } = req.body;

      // Validate password
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
        return res.status(400).json({ error: passwordValidationError });
      }

      // Optionally, validate email format
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the doctor with the hashed password
      const doctor = await Doctor.create({ ...req.body, password: hashedPassword });
      res.status(201).json(doctor);
    } catch (error) {
      console.error('Error registering doctor:', error);
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const doctor = await Doctor.findOne({ where: { email } });

      if (doctor) {
        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        if (isPasswordValid) {
          const token = jwt.sign({ id: doctor.id, role: 'doctor' }, 'parth', { expiresIn: '1h' }); // Assign role 'doctor'
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

  getAllDoctors: async (req, res) => {
    try {
      const doctors = await Doctor.findAll();
      res.json(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(400).json({ error: error.message });
    }
  },

  getDoctorById: async (req, res) => {
    try {
      const doctor = await Doctor.findByPk(req.params.id);
      if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
      res.json(doctor);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = DoctorController;
