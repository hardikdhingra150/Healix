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
  const [showTrends, setShowTrends] = useState(false);
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

  const handleProfileUpdate = async () => {
    // Refresh the page to get updated user data
    window.location.reload();
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

    const alerts = [];
    const vitals = latestRecord.vitals;

    // Blood Pressure Check
    if (vitals.systolic > 130 || vitals.diastolic > 85) {
      alerts.push({
        type: 'warning',
        title: 'Elevated Blood Pressure',
        message: `${vitals.systolic}/${vitals.diastolic} mmHg is above normal range (120/80)`
      });
    } else if (vitals.systolic < 90 || vitals.diastolic < 60) {
      alerts.push({
        type: 'warning',
        title: 'Low Blood Pressure',
        message: `${vitals.systolic}/${vitals.diastolic} mmHg is below normal range (120/80)`
      });
    }

    // Heart Rate Check
    if (vitals.heartRate > 100) {
      alerts.push({
        type: 'warning',
        title: 'Elevated Heart Rate',
        message: `${vitals.heartRate} bpm is above normal range (60-100 bpm)`
      });
    } else if (vitals.heartRate < 60) {
      alerts.push({
        type: 'info',
        title: 'Low Heart Rate',
        message: `${vitals.heartRate} bpm is below normal range (60-100 bpm)`
      });
    }

    // Temperature Check
    if (vitals.temperature > 37.5) {
      alerts.push({
        type: 'danger',
        title: 'Fever Detected',
        message: `${vitals.temperature}°C is above normal range (36.1-37.2°C)`
      });
    } else if (vitals.temperature < 36.1) {
      alerts.push({
        type: 'warning',
        title: 'Low Temperature',
        message: `${vitals.temperature}°C is below normal range (36.1-37.2°C)`
      });
    }

    // Oxygen Level Check
    if (vitals.oxygenLevel < 95) {
      alerts.push({
        type: 'danger',
        title: 'Low Oxygen Level',
        message: `${vitals.oxygenLevel}% is below normal range (95-100%)`
      });
    }

    // All Normal
    if (alerts.length === 0) {
      return (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '24px' }}>✅</span>
          <div>
            <h4 style={{ color: '#166534', margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>All Vitals Normal</h4>
            <p style={{ color: '#166534', margin: 0, fontSize: '14px' }}>Your latest health readings are within normal ranges. Keep up the good work!</p>
          </div>
        </div>
      );
    }

    return (
      <div className="health-alerts" style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#f59e0b' }}>⚠️</span>
          Health Alerts
        </h3>
        {alerts.map((alert, index) => (
          <div key={index} style={{
            display: 'flex',
            gap: '12px',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: index < alerts.length - 1 ? '12px' : '0',
            background: alert.type === 'danger' ? '#fef2f2' : alert.type === 'warning' ? '#fffbeb' : '#eff6ff',
            border: `1px solid ${alert.type === 'danger' ? '#fecaca' : alert.type === 'warning' ? '#fde68a' : '#bfdbfe'}`
          }}>
            <span style={{ fontSize: '20px' }}>
              {alert.type === 'danger' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <div>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                color: alert.type === 'danger' ? '#991b1b' : alert.type === 'warning' ? '#92400e' : '#1e40af'
              }}>
                {alert.title}
              </h4>
              <p style={{
                fontSize: '14px',
                margin: 0,
                color: alert.type === 'danger' ? '#991b1b' : alert.type === 'warning' ? '#92400e' : '#1e40af'
              }}>
                {alert.message}
              </p>
            </div>
          </div>
        ))}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f9fafb',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            ⚠️ If you're experiencing concerning symptoms, please contact your doctor immediately.
          </p>
        </div>
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
      return { avg: avg.toFixed(1), trend: trend.toFixed(1) };
    };

    return (
      <div className="health-trends" style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        marginTop: '24px'
      }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} style={{ color: '#3b82f6' }} />
          7-Day Health Trends
        </h3>
        <div className="trends-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {['heartRate', 'systolic', 'oxygenLevel'].map(vital => {
            const { avg, trend } = calculateTrend(vital);
            const isPositive = trend > 0;
            const vitalLabels = {
              heartRate: 'Heart Rate',
              systolic: 'Blood Pressure',
              oxygenLevel: 'Oxygen Level'
            };
            return (
              <div key={vital} style={{
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s'
              }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>
                  {vitalLabels[vital]}
                </p>
                <p style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#1f2937' }}>
                  {avg}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: isPositive ? '#ef4444' : '#22c55e' }}>
                  <TrendingUp size={16} style={{ transform: isPositive ? 'none' : 'rotate(180deg)' }} />
                  <span style={{ fontWeight: '600' }}>{Math.abs(trend)}</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>from last week</span>
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: '16px', fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
          Based on your last {Math.min(healthRecords.length, 7)} health records
        </p>
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
                <h1>Healix</h1>
                <p>Patient Portal</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <DarkModeToggle />
            <button className="settings-btn" onClick={() => setShowProfile(true)} title="Edit Profile">
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
                  <p className="stat-status normal">
                    {latestRecord.vitals.systolic > 130 || latestRecord.vitals.diastolic > 85 ? 'Elevated' : 'Normal'}
                  </p>
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
                  <p className="stat-status normal">
                    {latestRecord.vitals.heartRate > 100 ? 'Elevated' : latestRecord.vitals.heartRate < 60 ? 'Low' : 'Normal'}
                  </p>
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
                  <p className="stat-status normal">
                    {latestRecord.vitals.temperature > 37.5 ? 'Fever' : latestRecord.vitals.temperature < 36.1 ? 'Low' : 'Normal'}
                  </p>
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
                  <p className="stat-status normal">
                    {latestRecord.vitals.oxygenLevel < 95 ? 'Low' : 'Normal'}
                  </p>
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

          {renderHealthTrends()}

          {healthRecords.length > 0 && (
            <div className="records-section">
              <div className="section-header">
                <h3>Recent Health Records</h3>
                <button className="view-all-btn" onClick={() => setShowTrends(true)}>
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
        <ProfileModal 
          userData={userData} 
          onClose={() => setShowProfile(false)} 
          onUpdate={handleProfileUpdate}
        />
      )}
      {/* Trends Modal */}
{showTrends && healthRecords.length >= 2 && (
  <div className="modal-overlay" onClick={() => setShowTrends(false)}>
    <div className="modal-content trends-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>📊 Health Trends Analysis</h2>
        <button className="modal-close" onClick={() => setShowTrends(false)}>×</button>
      </div>

      <div className="modal-body">
        {/* Summary Stats */}
        <div className="trends-summary" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {['heartRate', 'systolic', 'diastolic', 'temperature', 'oxygenLevel'].map(vital => {
            const recent = healthRecords.slice(0, 7);
            const values = recent.map(r => r.vitals[vital] || (vital === 'systolic' || vital === 'diastolic' ? r.vitals.bloodPressure?.[vital] : 0));
            const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
            const min = Math.min(...values).toFixed(1);
            const max = Math.max(...values).toFixed(1);
            
            const vitalLabels = {
              heartRate: 'Heart Rate',
              systolic: 'Systolic BP',
              diastolic: 'Diastolic BP',
              temperature: 'Temperature',
              oxygenLevel: 'Oxygen Level'
            };

            const units = {
              heartRate: 'bpm',
              systolic: 'mmHg',
              diastolic: 'mmHg',
              temperature: '°C',
              oxygenLevel: '%'
            };

            return (
              <div key={vital} style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>
                  {vitalLabels[vital]}
                </p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
                  {avg} <span style={{ fontSize: '14px', fontWeight: '500', color: '#9ca3af' }}>{units[vital]}</span>
                </p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
                  <span>Min: {min}</span>
                  <span>Max: {max}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Records Table */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Detailed History (Last {Math.min(healthRecords.length, 10)} Records)
          </h3>
          <div style={{ 
            overflowX: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <table style={{ 
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>BP</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>HR</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Temp</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>O2</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Weight</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Symptoms</th>
                </tr>
              </thead>
              <tbody>
                {healthRecords.slice(0, 10).map((record, index) => (
                  <tr key={record.id} style={{ 
                    borderBottom: '1px solid #e5e7eb',
                    background: index % 2 === 0 ? 'white' : '#f9fafb'
                  }}>
                    <td style={{ padding: '12px', color: '#1f2937' }}>
                      {formatDate(record.timestamp)}
                      <br />
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {formatTime(record.timestamp)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#1f2937', fontWeight: '500' }}>
                      {record.vitals.systolic}/{record.vitals.diastolic}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#1f2937', fontWeight: '500' }}>
                      {record.vitals.heartRate}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#1f2937', fontWeight: '500' }}>
                      {record.vitals.temperature}°C
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#1f2937', fontWeight: '500' }}>
                      {record.vitals.oxygenLevel}%
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#1f2937', fontWeight: '500' }}>
                      {record.vitals.weight} kg
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280', fontSize: '13px' }}>
                      {record.symptoms || 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Health Insights */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
            💡 Insights
          </h4>
          <p style={{ fontSize: '13px', color: '#1e40af', margin: 0, lineHeight: '1.6' }}>
            You've logged {healthRecords.length} health records. 
            {healthRecords.length >= 7 ? ' Great job maintaining consistent tracking!' : ' Try to log your vitals daily for better trend analysis.'}
          </p>
        </div>
      </div>

      <div className="modal-footer">
        <button className="cancel-btn" onClick={() => setShowTrends(false)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default PatientDashboard;