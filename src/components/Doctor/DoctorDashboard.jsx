import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Users, Activity, AlertCircle, TrendingUp, Search, LogOut, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { getAllPatients, getPatientHealthRecords } from '../../firebase/firestore';
import { logoutUser } from '../../firebase/auth';
import DarkModeToggle from '../Shared/DarkModeToggle';
import ProfileModal from '../Shared/ProfileModal';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientRecords, setSelectedPatientRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  // Fetch all patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        console.log('Fetching all patients...');
        const allPatients = await getAllPatients();
        console.log('Patients fetched:', allPatients);
        
        // Fetch latest record for each patient
        const patientsWithRecords = await Promise.all(
          allPatients.map(async (patient) => {
            try {
              const records = await getPatientHealthRecords(patient.uid, 7);
              console.log(`Records for ${patient.name}:`, records.length);
              return {
                ...patient,
                latestRecord: records[0] || null,
                recordCount: records.length,
                records: records
              };
            } catch (error) {
              console.error(`Error fetching records for ${patient.name}:`, error);
              return {
                ...patient,
                latestRecord: null,
                recordCount: 0,
                records: []
              };
            }
          })
        );
        
        console.log('Patients with records:', patientsWithRecords);
        setPatients(patientsWithRecords);
      } catch (error) {
        console.error('Error fetching patients:', error);
        alert('Failed to load patients. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && userData?.userType === 'doctor') {
      fetchPatients();
    }
  }, [currentUser, userData]);

  const handlePatientSelect = async (patient) => {
    console.log('Selected patient:', patient);
    setSelectedPatient(patient);
    setSelectedPatientRecords(patient.records || []);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientStatus = (patient) => {
    if (!patient.latestRecord) return 'no-data';
    
    const vitals = patient.latestRecord.vitals;
    
    // Check if any vital is outside normal range
    if (vitals.systolic > 130 || vitals.diastolic > 85 || 
        vitals.heartRate > 100 || vitals.temperature > 37.5 ||
        vitals.oxygenLevel < 95) {
      return 'attention';
    }
    
    return 'normal';
  };

  const attentionPatientsCount = patients.filter(p => getPatientStatus(p) === 'attention').length;
  const normalPatientsCount = patients.filter(p => getPatientStatus(p) === 'normal').length;
  const noDataPatientsCount = patients.filter(p => getPatientStatus(p) === 'no-data').length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const prepareChartData = (records) => {
    return records.slice(0, 7).reverse().map((record, index) => {
      const date = new Date(record.timestamp);
      return {
        day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        bp: record.vitals.systolic,
        hr: record.vitals.heartRate,
        temp: record.vitals.temperature,
        o2: record.vitals.oxygenLevel
      };
    });
  };

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
        Loading patients data...
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <Stethoscope size={32} />
              <div>
                <h1>HealthTrack</h1>
                <p>Doctor Portal</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <DarkModeToggle />
            <button className="settings-btn" onClick={() => setShowProfile(true)}>
              <Settings size={20} />
            </button>
            <div className="user-info">
              <div className="user-avatar doctor">
                <span>{userData?.name?.charAt(0).toUpperCase() || 'D'}</span>
              </div>
              <div className="user-details">
                <p className="user-name">{userData?.name || 'Doctor'}</p>
                <p className="user-role">Doctor</p>
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
              <h2>Good day, {userData?.name || 'Doctor'}! 👨‍⚕️</h2>
              <p>Monitor your patients' recovery and health trends</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card total-patients">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Patients</p>
                <p className="stat-value">{patients.length}</p>
                <p className="stat-trend positive">Active monitoring</p>
              </div>
            </div>

            <div className="stat-card attention-needed">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Needs Attention</p>
                <p className="stat-value">{attentionPatientsCount}</p>
                <p className="stat-trend">Elevated vitals</p>
              </div>
            </div>

            <div className="stat-card normal-status">
              <div className="stat-icon">
                <Activity size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Normal Status</p>
                <p className="stat-value">{normalPatientsCount}</p>
                <p className="stat-trend">Stable condition</p>
              </div>
            </div>

            <div className="stat-card avg-recovery">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">No Data</p>
                <p className="stat-value">{noDataPatientsCount}</p>
                <p className="stat-trend">Awaiting records</p>
              </div>
            </div>
          </div>

          <div className="patients-section">
            <div className="section-header">
              <h3>Patient List ({filteredPatients.length})</h3>
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredPatients.length === 0 ? (
              <div style={{
                background: '#f9fafb',
                padding: '40px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                  {searchTerm ? 'No patients found matching your search.' : 'No patients registered yet.'}
                </p>
              </div>
            ) : (
              <div className="patients-grid">
                {filteredPatients.map((patient) => {
                  const status = getPatientStatus(patient);
                  return (
                    <div
                      key={patient.uid}
                      className={`patient-card ${status}`}
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="patient-header">
                        <div className="patient-avatar">
                          {patient.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P'}
                        </div>
                        <div className="patient-info">
                          <h4>{patient.name || 'Unknown Patient'}</h4>
                          <p>{patient.email}</p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                            {patient.recordCount} health record{patient.recordCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {status === 'attention' && (
                          <div className="alert-badge">
                            <AlertCircle size={16} />
                          </div>
                        )}
                      </div>

                      {patient.latestRecord ? (
                        <>
                          <div className="patient-vitals-summary">
                            <div className="vital-badge">
                              <span className="vital-label">BP:</span>
                              <span className="vital-value">
                                {patient.latestRecord.vitals.systolic}/{patient.latestRecord.vitals.diastolic}
                              </span>
                            </div>
                            <div className="vital-badge">
                              <span className="vital-label">HR:</span>
                              <span className="vital-value">{patient.latestRecord.vitals.heartRate}</span>
                            </div>
                            <div className="vital-badge">
                              <span className="vital-label">O2:</span>
                              <span className="vital-value">{patient.latestRecord.vitals.oxygenLevel}%</span>
                            </div>
                          </div>

                          <div className="patient-footer">
                            <span className="last-update">
                              Updated: {formatDate(patient.latestRecord.timestamp)}
                            </span>
                            <button className="view-details-btn">View Details →</button>
                          </div>
                        </>
                      ) : (
                        <div style={{ 
                          padding: '20px 0', 
                          color: '#9ca3af', 
                          fontSize: '14px',
                          textAlign: 'center',
                          background: '#f9fafb',
                          borderRadius: '8px',
                          margin: '12px 0'
                        }}>
                          No health records yet
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedPatient && selectedPatientRecords.length > 0 && (
            <div className="analytics-section">
              <div className="section-header">
                <h3>{selectedPatient.name} - Health Trends ({selectedPatientRecords.length} records)</h3>
                <button className="close-btn" onClick={() => setSelectedPatient(null)}>×</button>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h4>Blood Pressure Trend</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={prepareChartData(selectedPatientRecords)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="bp" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h4>Heart Rate Trend</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={prepareChartData(selectedPatientRecords)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h4>Temperature Trend</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={prepareChartData(selectedPatientRecords)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" domain={[35, 40]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h4>Oxygen Level Trend</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={prepareChartData(selectedPatientRecords)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" domain={[90, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="o2" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showProfile && (
        <ProfileModal 
          userData={userData} 
          onClose={() => setShowProfile(false)} 
          onUpdate={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
