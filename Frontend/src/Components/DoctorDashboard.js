import React, { useEffect, useState } from 'react';
import { fetchConsultations, updateConsultationStatus } from '../Services/Api';

const DoctorDashboard = ({ user }) => {
  const [consultations, setConsultations] = useState([]);

  const getConsultations = async () => {
    try {
      const response = await fetchConsultations('doctors', user.id);
      setConsultations(response.data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  const handleStatusUpdate = async (consultationId, newStatus) => {
    try {
      await updateConsultationStatus(consultationId, newStatus);
      getConsultations();
    } catch (error) {
      console.error('Error updating consultation status:', error);
    }
  };

  useEffect(() => {
    getConsultations();
  }, []);

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <h2>Consultation Requests</h2>
      <div className="consultations-list">
        {consultations.length > 0 ? (
          consultations.map(consultation => (
            <div key={consultation.id} className="consultation-card">
              <h3>{consultation.doctor_name}</h3>
              <p>Date: {consultation.date}</p>
              <p>Time: {consultation.time}</p>
              <p>Reason: {consultation.reason}</p>
              <p>Status: {consultation.status}</p>
              <button onClick={() => handleStatusUpdate(consultation.id, 'approved')}>Approve</button>
              <button onClick={() => handleStatusUpdate(consultation.id, 'rejected')}>Reject</button>
            </div>
          ))
        ) : (
          <p>No consultation requests available.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
