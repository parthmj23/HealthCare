const express = require('express');
const cors = require('cors');
const patientRoutes = require('./Routes/PatientRoutes');
const doctorRoutes = require('./Routes/DoctorRoutes');
const consultationRoutes = require('./Routes/ConsultationRoutes');
const sequelize = require('./Config/Config');
const path = require('path');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET,POST,PUT,DELETE', 
  credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/consultations', consultationRoutes);

const PORT = 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => console.error('Error syncing the database:', err));
