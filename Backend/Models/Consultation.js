const { DataTypes } = require('sequelize');
const sequelize = require('../Config/Config');

const Consultation = sequelize.define('Consultation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  timeSlot: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending', 
  },
  image: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Consultation;
