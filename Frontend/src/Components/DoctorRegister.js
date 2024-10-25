import React, { useState } from 'react';
import { registerDoctor } from '../Services/Api';

const DoctorRegister = () => {
  const [doctorData, setDoctorData] = useState({
    name: '',
    special:'',
    email: '',
    password: ''
  });

  const [successMessage, setSuccessMessage] = useState(''); 

  const handleChange = (e) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDoctor(doctorData);
      setSuccessMessage('Registration successful!'); 
      setTimeout(() => {
      }, 2000);
    } catch (error) {
      console.error('Error registering doctor:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Doctor Register</h2>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="specialization" placeholder="Specialization" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} 
    </div>
  );
};

export default DoctorRegister;
