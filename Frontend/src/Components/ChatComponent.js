import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ChatComponent = ({ consultationId, messages, setMessages }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    newSocket.emit('joinRoom', consultationId);
    newSocket.on('receiveMessage', (msg) => {
      setMessages((prev) => ({
        ...prev,
        [consultationId]: [...(prev[consultationId] || []), msg],
      }));
    });

    return () => newSocket.disconnect();
  }, [consultationId, setMessages]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const messageData = {
        consultationId,
        sender: 'User',
        message,
      };
      socket.emit('sendMessage', messageData);
      setMessages((prev) => ({
        ...prev,
        [consultationId]: [...(prev[consultationId] || []), messageData],
      }));
      setMessage('');
    }
  };

  return (
    <div>
      <div className="chat-messages h-60 overflow-y-auto mb-4">
        {(messages[consultationId] || []).map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded mb-1 ${
              msg.sender === 'Doctor' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded px-4 py-2"
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
