import React, { useEffect, useState } from 'react';
import { fetchConsultations, sendMessage, fetchMessages } from '../Services/Api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const PatientConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
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
       await sendMessage(selectedConsultation.id, 'Patient', newMessage);
      setMessages([...messages,  { sender: 'Patient', message: newMessage }]);
      setNewMessage('');

      socket.emit('send-message', { consultationId: selectedConsultation.id, sender: 'Patient', message: newMessage });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const changeImageIndex = (consultationId, direction) => {
    setImageIndexes((prev) => {
      const currentIndex = prev[consultationId] || 0;
      const images = JSON.parse(consultations.find((c) => c.id === consultationId)?.image || '[]');
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % images.length
          : currentIndex === 0
          ? images.length - 1
          : currentIndex - 1;
      return { ...prev, [consultationId]: newIndex };
    });
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
    <div className="min-h-screen bg-cover bg-center py-8" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576671080749-1d33a539237d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')" }}>
      <h1 className="text-4xl font-bold text-center text-white mb-10">My Consultations</h1>

      {loading ? (
        <p className="text-center text-gray-200 text-xl">Loading consultations...</p>
      ) : consultations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Consultation ID: {consultation.id}</h3>
              <p className="text-gray-700 mb-2"><strong>Date:</strong> {consultation.date}</p>
              <p className="text-gray-700 mb-2"><strong>Time:</strong> {consultation.timeSlot}</p>
              <p className="text-gray-700 mb-2"><strong>Reason:</strong> {consultation.reason}</p>
              <p className="text-gray-700 mb-4"><strong>Status:</strong> {consultation.status}</p>
              
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

              <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={() => { setSelectedConsultation(consultation); getMessages(consultation.id); }}>View Chat</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-200 text-xl">No consultations found.</p>
      )}

      {selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Chat for Consultation {selectedConsultation.id}</h2>
            <div className="h-64 overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'Patient' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'Patient' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}><strong>{msg.sender}:</strong> {msg.message}</span>
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
  );
};

export default PatientConsultations;
