import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import PatientDashboard from './components/patient/PatientDashboard';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import './App.css';

const PrivateRoute = ({ children, allowedRole }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userData?.userType !== allowedRole) {
    // Redirect to correct dashboard based on user type
    const redirectPath = userData?.userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const AuthenticatedApp = () => {
  const { currentUser, userData } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          currentUser ? (
            <Navigate to={userData?.userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard'} replace />
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
      
      <Route 
        path="/" 
        element={
          currentUser ? (
            <Navigate to={userData?.userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthenticatedApp />
      </Router>
    </AuthProvider>
  );
}

export default App;