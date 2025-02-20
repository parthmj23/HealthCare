import React, { useEffect, useState } from 'react';
import { fetchConsultations, sendMessage, fetchMessages, updateConsultationStatus } from '../Services/Api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const DoctorDashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [, setLoading] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageIndexes, setImageIndexes] = useState({});

  const getConsultations = async () => {
    try {
      setLoading(true);
      const response = await fetchConsultations();
      setConsultations(response || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMessages = async (consultationId) => {
    try {
      const response = await fetchMessages(consultationId);
      setMessages(response);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessage(selectedConsultation.id, 'Doctor', newMessage);
      setMessages([...messages, { sender: 'Doctor', message: newMessage }]);
      setNewMessage('');
      socket.emit('send-message', { consultationId: selectedConsultation.id, sender: 'Doctor', message: newMessage });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const changeImageIndex = (consultationId, direction) => {
    setImageIndexes((prev) => {
      const currentIndex = prev[consultationId] || 0;
      const images = JSON.parse(
        consultations.find((c) => c.id === consultationId)?.image || '[]'
      );
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % images.length
          : currentIndex === 0
          ? images.length - 1
          : currentIndex - 1;
      return { ...prev, [consultationId]: newIndex };
    });
  };

  const handleApprove = async (consultationId) => {
    try {
      await updateConsultationStatus(consultationId, 'Approved');
      setConsultations((prevConsultations) =>
        prevConsultations.map((consultation) =>
          consultation.id === consultationId
            ? { ...consultation, status: 'Approved' }
            : consultation
        )
      );
    } catch (error) {
      console.error('Error approving consultation:', error);
    }
  };

  const handleReject = async (consultationId) => {
    try {
      await updateConsultationStatus(consultationId, 'Rejected');
      setConsultations((prevConsultations) =>
        prevConsultations.map((consultation) =>
          consultation.id === consultationId
            ? { ...consultation, status: 'Rejected' }
            : consultation
        )
      );
    } catch (error) {
      console.error('Error rejecting consultation:', error);
    }
  };

  useEffect(() => {
    getConsultations();

    socket.on('receive-message', (messageData) => {
      if (messageData.consultationId === selectedConsultation?.id) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    });

    return () => {
      socket.off('receive-message');
    };
  }, [selectedConsultation]);

  return (
    <div className="min-h-screen bg-cover bg-center py-8" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580281658626-1b0b89f13c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')" }}>
      <div className="bg-white bg-opacity-80 min-h-screen p-8">
        <h1 className="text-4xl font-bold text-center text-black mb-8">Doctor Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {consultations.length > 0 ? (
            consultations.map((consultation) => (
              <div key={consultation.id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 hover:shadow-2xl transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Doctor ID: {consultation.doctorId}</h3>
                <p className="text-gray-600">Patient ID: {consultation.patientId}</p>
                <p className="text-gray-600">Date: {consultation.date}</p>
                <p className="text-gray-600">Time: {consultation.timeSlot}</p>
                <p className="text-gray-600 mb-2">Reason: {consultation.reason}</p>
                <p className="text-gray-600"><strong>Status:</strong> {consultation.status}</p>

                {consultation.image && (
                  <div className="relative">
                    <div className="overflow-hidden w-full">
                      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${(imageIndexes[consultation.id] || 0) * 100}%)` }}>
                        {JSON.parse(consultation.image).map((imgPath, index) => (
                          <div key={index} className="flex-shrink-0 w-full">
                            <img src={`http://localhost:5000/${imgPath}`} alt={`Consultation ${index + 1}`} className="w-full h-40 object-cover rounded-lg shadow-md" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full" onClick={() => changeImageIndex(consultation.id, 'prev')}>&#10094;</button>
                    <button className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full" onClick={() => changeImageIndex(consultation.id, 'next')}>&#10095;</button>
                  </div>
                )}

                <div className="mt-4 flex space-x-4">
                  <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" onClick={() => handleApprove(consultation.id)}>Approve</button>
                  <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700" onClick={() => handleReject(consultation.id)}>Reject</button>
                </div>

                {consultation.status === 'Approved' && (
                  <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={() => { setSelectedConsultation(consultation); getMessages(consultation.id); }}>View Chat</button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">No consultation requests available.</p>
          )}
        </div>

        {selectedConsultation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
              <h2 className="text-2xl font-bold mb-4">Chat for Consultation {selectedConsultation.id}</h2>
              <button className="absolute top-4 right-4 text-black font-bold" onClick={() => setSelectedConsultation(null)}>X</button>
              <div className="h-64 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.sender === 'Doctor' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'Doctor' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}><strong>{msg.sender}:</strong> {msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
              <input type="text" className="flex-1 border rounded px-4 py-2" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleSend}>Send</button>
              </div>
              <button className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700" onClick={() => setSelectedConsultation(null)}>Close</button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
