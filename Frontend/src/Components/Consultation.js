import React, { useState } from 'react';
import { createConsultationRequest } from '../Services/Api';

const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    images: [], 
  });
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = new FormData();
    requestData.append('patientId', formData.patientId);
    requestData.append('doctorId', formData.doctorId);
    requestData.append('date', formData.date);
    requestData.append('time', formData.time);
    requestData.append('reason', formData.reason);
    formData.images.forEach((image) => requestData.append('images', image)); // Append multiple images

    try {
      await createConsultationRequest(requestData);
      setSuccessMessage('Request made successfully!');
      setFormData({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        images: [],
      });
    } catch (error) {
      console.error('Error submitting consultation:', error);
      setSuccessMessage('Error submitting request. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Patient ID</label>
          <input type="integer" name="patientId" value={formData.patientId} onChange={handleChange} required />
        </div>
        <div>
          <label>Doctor ID</label>
          <input type="integer" name="doctorId" value={formData.doctorId} onChange={handleChange} required />
        </div>
        <div>
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>
        <div>
          <label>Reason</label>
          <textarea name="reason" value={formData.reason} onChange={handleChange} required />
        </div>
        <div>
          <label>Upload Images</label>
          <input type="file" name="images" multiple onChange={handleFileChange} /> {/* Multiple images */}
        </div>
        <button type="submit">Submit Request</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default ConsultationForm;
