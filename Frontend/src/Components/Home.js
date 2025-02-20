import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDoctors, fetchPatientId } from '../Services/Api';

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const navigate = useNavigate();

  const getDoctors = async () => {
    try {
      const response = await fetchDoctors();
      setDoctors(response?.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const getPatientId = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetchPatientId();
      if (response?.id) {
        setPatientData({ id: response.id });
      } else {
        console.error('Patient ID not found in response:', response);
      }
    } catch (error) {
      console.error('Error fetching patient ID:', error);
    }
  };

  useEffect(() => {
    getDoctors();
    getPatientId();
  }, []);

  const handleRequestConsultation = () => {
    navigate('/consultation/request');
  };

  const handleViewConsultations = () => {
    navigate('/PatientConsultations');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588774069265-3ebdc0cfa51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')" }}
    >
      <div className="bg-white bg-opacity-80 min-h-screen p-4">
        <nav className="bg-blue-600 text-white p-4 mb-6 shadow-md">
          <ul className="flex justify-between items-center">
            <li className="flex space-x-8">
              <button
                onClick={handleRequestConsultation}
                className="text-white hover:text-gray-200 transition-colors"
              >
                Request Consultation
              </button>
              <button
                onClick={handleViewConsultations}
                className="text-white hover:text-gray-200 transition-colors"
              >
                View My Consultations
              </button>
            </li>
            {patientData && (
              <li className="text-gray-200">
                <span>Patient ID: {patientData.id}</span>
              </li>
            )}
          </ul>
        </nav>

        <main className="px-4">
          <h1 className="text-4xl font-bold text-black text-center mb-6">
            Welcome to the Consultation App
          </h1>
          <p className="text-lg text-black text-center mb-10">
            This platform allows you to request consultations with doctors and track their status.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Available Doctors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-medium text-blue-600 mb-3">
                    {doctor.name}
                  </h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Specialization:</strong> {doctor.specialization}
                  </p>
                  <p className="text-gray-700">
                    <strong>ID:</strong> {doctor.id}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-700 text-center col-span-full">
                No doctors available at the moment.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
