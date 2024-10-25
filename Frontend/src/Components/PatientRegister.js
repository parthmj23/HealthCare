import React, { useState } from 'react';
import { registerPatient } from '../Services/Api';

const PatientRegister = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerPatient(patientData);
      setSuccessMessage('Registration successful!');
      
      setPatientData({
        name: '',
        email: '',
        password: '',
      });

      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error registering patient:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Patient Register</h2>
        <input
          name="name"
          placeholder="Name"
          value={patientData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={patientData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={patientData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default PatientRegister;
