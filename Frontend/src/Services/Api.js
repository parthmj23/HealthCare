import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerPatient = async (patientData) => {
  return await axios.post(`${API_URL}/patients/register`, patientData);
};

export const registerDoctor = async (doctorData) => {
  return await axios.post(`${API_URL}/doctors/register`, doctorData);
};

export const loginPatient = async (credentials) => {
  return await axios.post(`${API_URL}/patients/login`, credentials);
};

export const loginDoctor = async (credentials) => {
  return await axios.post(`${API_URL}/doctors/login`, credentials);
};

export const fetchDoctors = async () => {
  return await axios.get(`${API_URL}/doctors`);
};

export const createConsultationRequest = async (requestData) => {
  return await axios.post(`${API_URL}/consultations/consultation`, requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fetchConsultations = async (role, id) => {
  return await axios.get(`${API_URL}/${role}/${id}/consultations`);
};

export const updateConsultationStatus = async (consultationId, status) => {
  return await axios.patch(`${API_URL}/consultations/${consultationId}/status`, { status });
};

export const fetchPatientById = async (id) => {
  return await axios.get(`${API_URL}/patients/${id}`);
};