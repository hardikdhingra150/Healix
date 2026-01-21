import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import './App.css';

// Placeholder components (we'll create these later)
const PatientDashboard = () => <div className="dashboard"><h1>Patient Dashboard</h1></div>;
const DoctorDashboard = () => <div className="dashboard"><h1>Doctor Dashboard</h1></div>;

const PrivateRoute = ({ children, allowedRole }) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && userData?.userType !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
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
      
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;