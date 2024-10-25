const jwt = require('jsonwebtoken');
const Patient = require('../Models/Patient');
const Doctor = require('../Models/Doctor');
const your_jwt_secret = "parth";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, your_jwt_secret);
    req.user = decoded; 

    if (decoded.role === 'patient') {
      req.userData = await Patient.findByPk(decoded.id);
    } else if (decoded.role === 'doctor') {
      req.userData = await Doctor.findByPk(decoded.id);
    }

    if (!req.userData) {
      return res.status(404).json({ message: 'User not found.' });
    }

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired.' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: 'Invalid token.' });
    } else {
      console.error('Error in auth middleware:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

module.exports = authMiddleware;
