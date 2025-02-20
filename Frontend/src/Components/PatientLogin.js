import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPatient } from '../Services/Api';

const PatientLogin = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { data } = await loginPatient(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r  from-blue-400 to-purple-400">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-heading text-center text-primary mb-6">
          Patient Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md text-white ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientLogin;
