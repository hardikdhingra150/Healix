import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Thermometer, Droplet, Weight, LogOut, Plus, TrendingUp, Calendar, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { addHealthRecord, getPatientHealthRecords } from '../../firebase/firestore';
import { logoutUser } from '../../firebase/auth';
import ProfileModal from '../Shared/ProfileModal';
import DarkModeToggle from '../Shared/DarkModeToggle';
import './PatientDashboard.css';


const PatientDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [showLogger, setShowLogger] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    temperature: '',
    oxygenLevel: '',
    weight: '',
    symptoms: '',
    notes: ''
  });
  
  useEffect(() => {
    console.log('Current User:', currentUser);
    console.log('User Data:', userData);
    
    if (!currentUser) {
      console.error('USER NOT LOGGED IN!');
    }
  }, [currentUser, userData]);


  useEffect(() => {
    const fetchRecords = async () => {
      if (currentUser) {
        try {
          setFetchLoading(true);
          const records = await getPatientHealthRecords(currentUser.uid, 30);
          setHealthRecords(records);
        } catch (error) {
          console.error('Error fetching health records:', error);
        } finally {
          setFetchLoading(false);
        }
      }
    };

    fetchRecords();
  }, [currentUser]);


  const latestRecord = healthRecords[0];


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (!formData.systolic || !formData.diastolic || !formData.heartRate || 
          !formData.temperature || !formData.oxygenLevel || !formData.weight) {
        throw new Error('Please fill in all required fields');
      }
  
      if (!currentUser) {
        throw new Error('You must be logged in to save health records');
      }
  
      console.log('Saving health record for user:', currentUser.uid);
  
      const healthData = {
        vitals: {
          systolic: parseFloat(formData.systolic),
          diastolic: parseFloat(formData.diastolic),
          heartRate: parseFloat(formData.heartRate),
          temperature: parseFloat(formData.temperature),
          oxygenLevel: parseFloat(formData.oxygenLevel),
          weight: parseFloat(formData.weight)
        },
        symptoms: formData.symptoms || '',
        notes: formData.notes || ''
      };
  
      const recordId = await addHealthRecord(currentUser.uid, healthData);
      console.log('Record saved successfully with ID:', recordId);
  
      const updatedRecords = await getPatientHealthRecords(currentUser.uid, 30);
      setHealthRecords(updatedRecords);
  
      setFormData({
        systolic: '',
        diastolic: '',
        heartRate: '',
        temperature: '',
        oxygenLevel: '',
        weight: '',
        symptoms: '',
        notes: ''
      });
      
      setShowLogger(false);
      alert('Health record saved successfully!');
    } catch (error) {
      console.error('Detailed error saving health record:', error);
      
      let errorMessage = 'Failed to save health record. ';
      
      if (error.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please check Firestore security rules.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };


  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Health Alerts inline
  const renderHealthAlerts = () => {
    if (!latestRecord?.vitals) return null;

    const checkVitalStatus = (vital, value) => {
      const ranges = {
        systolic: { min: 90, max: 120, warning: 140 },
        diastolic: { min: 60, max: 80, warning: 90 },
        heartRate: { min: 60, max: 100, warning: 120 },
        temperature: { min: 36.1, max: 37.2, warning: 38.0 },
        oxygenLevel: { min: 95, max: 100, warning: 90 }
      };

      if (!ranges[vital]) return 'normal';
      const range = ranges[vital];
      
      if (value < range.min || value > range.warning) return 'critical';
      if (value > range.max) return 'warning';
      return 'normal';
    };

    const alerts = [];
    
    Object.entries(latestRecord.vitals).forEach(([key, value]) => {
      const status = checkVitalStatus(key, value);
      if (status !== 'normal') {
        alerts.push({ vital: key, value, status });
      }
    });

    if (alerts.length === 0) return null;

    return (
      <div className="health-alerts" style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        {alerts.map((alert, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: alert.status === 'critical' ? '#dc2626' : '#f59e0b',
            marginBottom: index < alerts.length - 1 ? '8px' : '0'
          }}>
            <span>⚠️ {alert.vital}: {alert.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Health Trends inline
  const renderHealthTrends = () => {
    if (healthRecords.length < 2) return null;

    const calculateTrend = (vital) => {
      const recent = healthRecords.slice(0, 7);
      const values = recent.map(r => r.vitals[vital]);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const trend = values[0] - values[values.length - 1];
      return { avg: avg.toFixed(1), trend };
    };

    return (
      <div className="health-trends" style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        marginTop: '24px'
      }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>7-Day Trends</h3>
        <div className="trends-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {['heartRate', 'systolic', 'oxygenLevel'].map(vital => {
            const { avg, trend } = calculateTrend(vital);
            return (
              <div key={vital} style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{vital}</p>
                <p style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>{avg}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                  {trend > 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />}
                  <span>{Math.abs(trend).toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  if (fetchLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading your health data...
      </div>
    );
  }


  return (
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <Heart size={32} />
              <div>
                <h1>HealthTrack</h1>
                <p>Patient Portal</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <DarkModeToggle />
            <button className="settings-btn" onClick={() => setShowProfile(true)}>
              <Settings size={20} />
            </button>
            <div className="user-info">
              <div className="user-avatar">
                <span>{userData?.name?.charAt(0).toUpperCase() || 'P'}</span>
              </div>
              <div className="user-details">
                <p className="user-name">{userData?.name || 'Patient'}</p>
                <p className="user-role">Patient</p>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>


      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="welcome-section">
            <div>
              <h2>Welcome back, {userData?.name || 'Patient'}! 👋</h2>
              <p>Track your health metrics and monitor your recovery progress</p>
            </div>
            <button className="log-vitals-btn" onClick={() => setShowLogger(true)}>
              <Plus size={20} />
              Log Today's Vitals
            </button>
          </div>


          {renderHealthAlerts()}


          {latestRecord && (
            <div className="stats-grid">
              <div className="stat-card blood-pressure">
                <div className="stat-icon">
                  <Activity size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Blood Pressure</p>
                  <p className="stat-value">
                    {latestRecord.vitals.systolic}/{latestRecord.vitals.diastolic}
                    <span className="stat-unit">mmHg</span>
                  </p>
                  <p className="stat-status normal">Normal</p>
                </div>
              </div>

              <div className="stat-card heart-rate">
                <div className="stat-icon">
                  <Heart size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Heart Rate</p>
                  <p className="stat-value">
                    {latestRecord.vitals.heartRate}
                    <span className="stat-unit">bpm</span>
                  </p>
                  <p className="stat-status normal">Normal</p>
                </div>
              </div>

              <div className="stat-card temperature">
                <div className="stat-icon">
                  <Thermometer size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Temperature</p>
                  <p className="stat-value">
                    {latestRecord.vitals.temperature}
                    <span className="stat-unit">°C</span>
                  </p>
                  <p className="stat-status normal">Normal</p>
                </div>
              </div>

              <div className="stat-card oxygen">
                <div className="stat-icon">
                  <Droplet size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Oxygen Level</p>
                  <p className="stat-value">
                    {latestRecord.vitals.oxygenLevel}
                    <span className="stat-unit">%</span>
                  </p>
                  <p className="stat-status normal">Normal</p>
                </div>
              </div>
            </div>
          )}


          {!latestRecord && (
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>
                No health records yet. Click "Log Today's Vitals" to get started!
              </p>
            </div>
          )}


          {healthRecords.length > 0 && (
            <div className="records-section">
              <div className="section-header">
                <h3>Recent Health Records</h3>
                <button className="view-all-btn">
                  <TrendingUp size={18} />
                  View Trends
                </button>
              </div>

              <div className="records-list">
                {healthRecords.map((record) => (
                  <div key={record.id} className="record-card">
                    <div className="record-header">
                      <div className="record-date">
                        <Calendar size={18} />
                        <span>{formatDate(record.timestamp)}</span>
                        <span className="record-time">{formatTime(record.timestamp)}</span>
                      </div>
                    </div>
                    <div className="record-vitals">
                      <div className="vital-item">
                        <span className="vital-label">BP:</span>
                        <span className="vital-value">{record.vitals.systolic}/{record.vitals.diastolic}</span>
                      </div>
                      <div className="vital-item">
                        <span className="vital-label">HR:</span>
                        <span className="vital-value">{record.vitals.heartRate} bpm</span>
                      </div>
                      <div className="vital-item">
                        <span className="vital-label">Temp:</span>
                        <span className="vital-value">{record.vitals.temperature}°C</span>
                      </div>
                      <div className="vital-item">
                        <span className="vital-label">O2:</span>
                        <span className="vital-value">{record.vitals.oxygenLevel}%</span>
                      </div>
                      <div className="vital-item">
                        <span className="vital-label">Weight:</span>
                        <span className="vital-value">{record.vitals.weight} kg</span>
                      </div>
                    </div>
                    {record.symptoms && (
                      <div style={{ marginTop: '12px', fontSize: '13px', color: '#6b7280' }}>
                        <strong>Symptoms:</strong> {record.symptoms}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderHealthTrends()}
        </div>
      </main>


      {showLogger && (
        <div className="modal-overlay" onClick={() => setShowLogger(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log Health Vitals</h2>
              <button className="modal-close" onClick={() => setShowLogger(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Blood Pressure (Systolic)</label>
                  <input
                    type="number"
                    name="systolic"
                    value={formData.systolic}
                    onChange={handleInputChange}
                    placeholder="120"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Blood Pressure (Diastolic)</label>
                  <input
                    type="number"
                    name="diastolic"
                    value={formData.diastolic}
                    onChange={handleInputChange}
                    placeholder="80"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Heart Rate (bpm)</label>
                  <input
                    type="number"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleInputChange}
                    placeholder="72"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    placeholder="36.8"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Oxygen Level (%)</label>
                  <input
                    type="number"
                    name="oxygenLevel"
                    value={formData.oxygenLevel}
                    onChange={handleInputChange}
                    placeholder="98"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="70"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Symptoms (Optional)</label>
                <input
                  type="text"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  placeholder="e.g., Headache, Fatigue"
                />
              </div>

              <div className="form-group full-width">
                <label>Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes..."
                  rows="3"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowLogger(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} userData={userData} />
      )}
    </div>
  );
};

export default PatientDashboard;
