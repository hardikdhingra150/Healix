import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import PatientDashboard from './components/Patient/PatientDashboard';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import './App.css';
import './styles/darkmode.css';

const PrivateRoute = ({ children, allowedRole }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return null; // LoadingScreen is shown by AuthProvider
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userData?.userType !== allowedRole) {
    const redirectPath = userData?.userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const AuthenticatedApp = () => {
  const { currentUser, userData } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route 
        path="/login" 
        element={
          currentUser && userData ? (
            <Navigate to={userData.userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard'} replace />
          ) : (
            <Login />
          )
        } 
      />
      
      <Route 
        path="/patient-dashboard" 
        element={
          <PrivateRoute allowedRole="patient">
            <PatientDashboard />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/doctor-dashboard" 
        element={
          <PrivateRoute allowedRole="doctor">
            <DoctorDashboard />
          </PrivateRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AuthenticatedApp />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;