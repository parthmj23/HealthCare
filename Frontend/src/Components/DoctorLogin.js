import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginDoctor } from '../Services/Api';

const DoctorLogin = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginDoctor(credentials);
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/doctor/dashboard');
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r  from-blue-400 to-purple-400">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-semibold text-primary text-center mb-8">
          Doctor Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        {errorMessage && (
          <p className="text-red-600 mt-4 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default DoctorLogin;
