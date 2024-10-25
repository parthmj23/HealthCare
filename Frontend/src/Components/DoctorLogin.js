import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginDoctor } from '../Services/Api';

const DoctorLogin = ({ setUser }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginDoctor(credentials);
      setUser(data.user); 
      navigate('/doctor/dashboard'); 
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  

    return (
        <form onSubmit={handleSubmit}>
            <h2>Doctor Login</h2>
            <input name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default DoctorLogin;
