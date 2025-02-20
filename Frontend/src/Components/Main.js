import React, { useState } from 'react';
import PatientLogin from './PatientLogin';
import PatientRegister from './PatientRegister';
import DoctorLogin from './DoctorLogin';
import DoctorRegister from './DoctorRegister';

const Main = () => {
  const [user, setUser] = useState(null);
  const [activeForm, setActiveForm] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const showForm = (form) => {
    setActiveForm(form);
    setFormMessage('');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center py-8"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')",
      }}
    >
      <div className="bg-white bg-opacity-80 shadow-xl rounded-lg p-8 mb-10 w-11/12 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary text-center mb-12">
          Welcome to the Healthcare System
        </h1>
        <h2 className="text-2xl font-semibold text-primary text-center mb-8">
          Please select your role
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <button
            className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 w-full md:w-auto"
            onClick={() => showForm('patientLogin')}
          >
            Patient Login
          </button>
          <button
            className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 w-full md:w-auto"
            onClick={() => showForm('patientRegister')}
          >
            Patient Register
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
          <button
            className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 w-full md:w-auto"
            onClick={() => showForm('doctorLogin')}
          >
            Doctor Login
          </button>
          <button
            className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 w-full md:w-auto"
            onClick={() => showForm('doctorRegister')}
          >
            Doctor Register
          </button>
        </div>
      </div>

      <div
        className={`w-full max-w-lg bg-white bg-opacity-90 shadow-md rounded-md p-6 ${
          activeForm ? 'block' : 'hidden'
        }`}
        aria-live="polite"
      >
        {activeForm === 'patientLogin' && <PatientLogin setUser={setUser} />}
        {activeForm === 'patientRegister' && <PatientRegister />}
        {activeForm === 'doctorLogin' && <DoctorLogin setUser={setUser} />}
        {activeForm === 'doctorRegister' && <DoctorRegister />}
      </div>

      {formMessage && <p className="text-center text-red-600 mt-4">{formMessage}</p>}
    </div>
  );
};

export default Main;
