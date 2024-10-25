import React, { useState } from 'react';
import PatientLogin from './PatientLogin';
import PatientRegister from './PatientRegister';
import DoctorLogin from './DoctorLogin';
import DoctorRegister from './DoctorRegister';

const Main = () => {
  const [user, setUser] = useState(null);
  const [activeForm, setActiveForm] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const showPatientLogin = () => {
    setActiveForm('patientLogin');
    setFormMessage(''); 
  };

  const showPatientRegister = () => {
    setActiveForm('patientRegister');
    setFormMessage(''); 
  };

  const showDoctorLogin = () => {
    setActiveForm('doctorLogin');
    setFormMessage(''); 
  };

  const showDoctorRegister = () => {
    setActiveForm('doctorRegister');
    setFormMessage('');
  };

  return (
    <div className="main-container">
      <h1 className="main-containerh1">Welcome to the Healthcare System</h1>

      <div className="box-container">
        <div className="box">
          <h2>Patient</h2>
          <button className="btn" onClick={showPatientRegister}>Patient Register</button>
          <button className="btn" onClick={showPatientLogin}>Patient Login</button>
        </div>

        <div className="box">
          <h2>Doctor</h2>
          <button className="btn" onClick={showDoctorRegister}>Doctor Register</button>
          <button className="btn" onClick={showDoctorLogin}>Doctor Login</button>
        </div>
      </div>

      <div className="form-container" aria-live="polite">
        {activeForm === 'patientLogin' && <PatientLogin setUser={setUser} />}
        {activeForm === 'patientRegister' && <PatientRegister />}
        {activeForm === 'doctorLogin' && <DoctorLogin setUser={setUser} />}
        {activeForm === 'doctorRegister' && <DoctorRegister />}
      </div>

      {formMessage && <p className="form-message">{formMessage}</p>}
    </div>
  );
};

export default Main;
