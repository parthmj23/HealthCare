import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDoctors, fetchPatientById } from '../Services/Api'; 

const HomePage = () => {  
  const [doctors, setDoctors] = useState([]);
  const [patientData, setPatientData] = useState(null); 
  const navigate = useNavigate();

  const getDoctors = async () => {
    try {
      const response = await fetchDoctors();
      setDoctors(response.data); 
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const getPatientId = async (id) => {
    try {
      const response = await fetchPatientById(id); 
      setPatientData(response.data);  
    } catch (error) {
      console.error('Error fetching patient ID:', error);
    }
  };

  useEffect(() => {
    getDoctors();
    const id = localStorage.getItem('patientId'); 
    if (id) {
      getPatientId(id);  
    } else {
      console.error('Patient ID is not available.');
    }
  }, []);

  const handleRequestConsultation = () => {
    navigate('/consultation/request');  
  };

  return (
    <div>
      <h1>Welcome to the Consultation App</h1>
      <p>This app allows you to request consultations with doctors.</p>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <strong>Patient ID:</strong> {patientData ? patientData.id : 'Loading...'}
      </div>

      <button onClick={handleRequestConsultation}>Request Consultation</button>

      <h2>Available Doctors</h2>
      <div className="doctors-list">
        {doctors.length > 0 ? (
          doctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <h3>{doctor.name}</h3>
              <p>Specialization: {doctor.specialization}</p>
              <p>ID: {doctor.id}</p>
            </div>
          ))
        ) : (
          <p>No doctors available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
