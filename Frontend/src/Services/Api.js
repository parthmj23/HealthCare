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
  
    const response = await axios.post(`${API_URL}/doctors/login`, credentials);
    return response.data;  
};


export const fetchDoctors = async () => {
  return await axios.get(`${API_URL}/doctors`);
};

export const createConsultationRequest = async (requestData, token) => {
  try {
    const response = await axios.post(`${API_URL}/consultations/consultation`, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating consultation request:', error);
    throw error;
  }
};

export const fetchConsultations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/consultations/consultations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return []; 
  }
};



export const updateConsultationStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.put(
      `${API_URL}/consultations/${id}/status`,
      { status }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Status update response:', response.data);
    return response.data; 
  } catch (error) {
    console.error('Error updating consultation status:', error);
    throw error; 
  }
};



export const fetchPatientById = async (id) => {
  return await axios.get(`${API_URL}/patients/${id}`);
};

export const fetchAvailableSlots = async (doctorId, date) => {
  try {
    const token = localStorage.getItem('token'); 
    console.log(token)

    const response = await axios.get(`${API_URL}/consultations/available-slots`, {
      params: { doctorId, date },
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    throw error;
  }
};

export const verifyPatientEmail = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/patients/verify-email/:token`, {
      params: { token },
    });
    console.log('Email verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error;
  }
};

export const verifyDoctorEmail = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/doctors/verify-email/:token`, {
      params: { token },
    });
    console.log('Doctor email verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error verifying doctor email:', error);
    throw error;
  }
};

export const fetchPatientId = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found.');
    }

    console.log('Sending token:', token); 

    const response = await axios.get(`${API_URL}/patients/get-id`, {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });

    console.log('Fetched patient ID response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient ID:', error);
    throw error; 
  }
};

export const sendMessage = async (consultationId, sender, message) => {
  return axios.post(`${API_URL}/chat/send`, {
    consultationId,
    sender,
    message,
  });
};

export const fetchMessages = async (consultationId) => {
  try {
    const response = await axios.get(`${API_URL}/chat/messages`, {
      params: { consultationId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
