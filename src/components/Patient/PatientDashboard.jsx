import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Thermometer, Droplet, Weight, LogOut, Plus, TrendingUp, Calendar } from 'lucide-react';
import './PatientDashboard.css';

// Mock data for demonstration
const mockHealthRecords = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    vitals: {
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      temperature: 36.8,
      oxygenLevel: 98,
      weight: 70
    }
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    vitals: {
      systolic: 118,
      diastolic: 78,
      heartRate: 75,
      temperature: 36.9,
      oxygenLevel: 97,
      weight: 70.2
    }
  }
];

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [showLogger, setShowLogger] = useState(false);
  const [healthRecords, setHealthRecords] = useState(mockHealthRecords);
  const [loading, setLoading] = useState(false);
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

  const latestRecord = healthRecords[0];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate saving to Firebase
    setTimeout(() => {
      const newRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        vitals: {
          systolic: parseFloat(formData.systolic),
          diastolic: parseFloat(formData.diastolic),
          heartRate: parseFloat(formData.heartRate),
          temperature: parseFloat(formData.temperature),
          oxygenLevel: parseFloat(formData.oxygenLevel),
          weight: parseFloat(formData.weight)
        },
        symptoms: formData.symptoms,
        notes: formData.notes
      };

      setHealthRecords([newRecord, ...healthRecords]);
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
      setLoading(false);
      alert('Health record saved successfully!');
    }, 1000);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="patient-dashboard">
      {/* Header */}
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
            <div className="user-info">
              <div className="user-avatar">
                <span>P</span>
              </div>
              <div className="user-details">
                <p className="user-name">Patient User</p>
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

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div>
              <h2>Welcome back, Patient! 👋</h2>
              <p>Track your health metrics and monitor your recovery progress</p>
            </div>
            <button className="log-vitals-btn" onClick={() => setShowLogger(true)}>
              <Plus size={20} />
              Log Today's Vitals
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card blood-pressure">
              <div className="stat-icon">
                <Activity size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Blood Pressure</p>
                <p className="stat-value">
                  {latestRecord?.vitals.systolic}/{latestRecord?.vitals.diastolic}
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
                  {latestRecord?.vitals.heartRate}
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
                  {latestRecord?.vitals.temperature}
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
                  {latestRecord?.vitals.oxygenLevel}
                  <span className="stat-unit">%</span>
                </p>
                <p className="stat-status normal">Normal</p>
              </div>
            </div>
          </div>

          {/* Recent Records */}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Health Logger Modal */}
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
    </div>
  );
};

export default PatientDashboard;