import React, { useState } from 'react';
import { registerDoctor } from '../Services/Api';

const DoctorRegister = () => {
  const [doctorData, setDoctorData] = useState({
    name: '',
    specialization: '',
    email: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await registerDoctor(doctorData);
      if (response.error) {
        setErrorMessage(response.error);
      } else {
        setSuccessMessage('Registration successful! Please check your email for verification.');
        setDoctorData({ name: '', specialization: '', email: '', password: '' });
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error registering doctor:', error);
      setErrorMessage('Error registering doctor. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r  from-blue-400 to-purple-400">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-primary text-center mb-8">
          Doctor Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={doctorData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="specialization" className="block text-gray-700 mb-2">Specialization</label>
            <input
              id="specialization"
              name="specialization"
              type="text"
              value={doctorData.specialization}
              onChange={handleChange}
              placeholder="Enter your specialization"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={doctorData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={doctorData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Register
          </button>
        </form>

        {successMessage && (
          <p className="text-green-600 mt-4 text-center">{successMessage}</p>
        )}

        {errorMessage && (
          <p className="text-red-600 mt-4 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default DoctorRegister;
