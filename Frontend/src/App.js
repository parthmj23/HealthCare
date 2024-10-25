import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Components/Main';
import PatientRegister from './Components/PatientRegister';
import PatientLogin from './Components/PatientLogin';
import DoctorRegister from './Components/DoctorRegister';
import DoctorLogin from './Components/DoctorLogin';
import Home from './Components/Home'; 
import ConsultationForm from './Components/Consultation';
import './Styles.css';

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/login" element={<PatientLogin setUser={setUser} />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin setUser={setUser} />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/consultation/request" element={<ConsultationForm />} />
     
     </Routes>
    </Router>
  );
}

export default App;
