import React, { useState, useEffect } from 'react';
import { createConsultationRequest, fetchAvailableSlots } from '../Services/Api';

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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (formData.date && formData.doctorId) {
      const fetchSlots = async () => {
        try {
          const { availableSlots } = await fetchAvailableSlots(formData.doctorId, formData.date);
          setAvailableSlots(availableSlots);
        } catch (error) {
          console.error('Error fetching available slots:', error);
          setErrorMessage('Error fetching available slots. Please try again.');
        }
      };

      fetchSlots();
    }
  }, [formData.date, formData.doctorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reason) {
      setErrorMessage('Reason for consultation is required.');
      return;
    }

    if (!formData.time) {
      setErrorMessage('Please select a valid time slot.');
      return;
    }

    const requestData = new FormData();
    requestData.append('doctorId', formData.doctorId);
    requestData.append('date', formData.date);
    requestData.append('timeSlot', formData.time);
    requestData.append('reason', formData.reason);

    formData.images.forEach((image) => requestData.append('images', image));

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Authorization token is missing. Please log in again.');
      return;
    }

    try {
      await createConsultationRequest(requestData, token);
      setSuccessMessage('Consultation request submitted successfully!');
      setFormData({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        images: [],
      });
      setErrorMessage('');
    } catch (error) {
      console.error('Error submitting consultation:', error);
      setSuccessMessage('');
      setErrorMessage('Error submitting request. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1580281657527-47e06381b71f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')`,
      }}
    >
      <div className="max-w-2xl bg-white bg-opacity-90 shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Request Consultation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient ID</label>
            <input
              type="number"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
            <input
              type="number"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={availableSlots.length === 0}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                availableSlots.length === 0
                  ? 'border-gray-200 bg-gray-100 text-gray-400'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="">Select a time</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Images</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition"
          >
            Submit Request
          </button>
        </form>
        {successMessage && (
          <p className="mt-6 text-center text-green-600 font-medium">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mt-6 text-center text-red-600 font-medium">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ConsultationForm;
