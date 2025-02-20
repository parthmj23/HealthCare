import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Components/Main';
import PatientRegister from './Components/PatientRegister';
import PatientLogin from './Components/PatientLogin';
import DoctorRegister from './Components/DoctorRegister';
import DoctorLogin from './Components/DoctorLogin';
import Home from './Components/Home';
import ConsultationForm from './Components/Consultation';
import DoctorDashboard from './Components/DoctorDashboard';
import PatientConsultations from './Components/PatientConsultations';
import Header from './Components/Header';
import { ThemeProvider, ThemeContext } from '../src/Components/ThemeContext';
import './Styles.css';

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <div
            className={`min-h-screen ${
              theme === 'light' ? 'bg-secondary text-gray-800' : 'bg-gray-800 text-black'
            }`}
          >
            <Router>
              <Header />
              <main className="py-8">
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/patient/register" element={<PatientRegister />} />
                  <Route path="/patient/login" element={<PatientLogin setUser={setUser} />} />
                  <Route path="/doctor/register" element={<DoctorRegister />} />
                  <Route path="/doctor/login" element={<DoctorLogin setUser={setUser} />} />
                  <Route path="/home" element={<Home user={user} />} />
                  <Route path="/consultation/request" element={<ConsultationForm />} />
                  <Route
                    path="/doctor/dashboard"
                    element={<DoctorDashboard user={user} />}
                  />
                  <Route path="/PatientConsultations" element={<PatientConsultations/>} />
                </Routes>
              </main>
              <footer
                className={`text-center p-4 ${
                  theme === 'light' ? 'bg-primary text-white' : 'bg-gray-700 text-black'
                }`}
              >
                <p>&copy; 2024 Healthcare System. All rights reserved.</p>
              </footer>
            </Router>
          </div>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}

export default App;
