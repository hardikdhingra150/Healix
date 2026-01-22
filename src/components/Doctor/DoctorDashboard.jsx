import React, { useState } from 'react';
import { Stethoscope, Users, Activity, AlertCircle, TrendingUp, Search, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DoctorDashboard.css';

// Mock patient data
const mockPatients = [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    condition: 'Post-surgery recovery',
    lastRecord: {
      timestamp: new Date().toISOString(),
      vitals: { systolic: 135, diastolic: 85, heartRate: 82, temperature: 37.1, oxygenLevel: 96 }
    },
    status: 'attention',
    trend: [
      { date: 'Mon', bp: 120, hr: 72 },
      { date: 'Tue', bp: 122, hr: 74 },
      { date: 'Wed', bp: 125, hr: 76 },
      { date: 'Thu', bp: 130, hr: 80 },
      { date: 'Fri', bp: 135, hr: 82 }
    ]
  },
  {
    id: '2',
    name: 'Sarah Smith',
    age: 32,
    condition: 'Cardiac monitoring',
    lastRecord: {
      timestamp: new Date().toISOString(),
      vitals: { systolic: 118, diastolic: 78, heartRate: 68, temperature: 36.7, oxygenLevel: 98 }
    },
    status: 'normal',
    trend: [
      { date: 'Mon', bp: 115, hr: 65 },
      { date: 'Tue', bp: 116, hr: 66 },
      { date: 'Wed', bp: 117, hr: 67 },
      { date: 'Thu', bp: 118, hr: 68 },
      { date: 'Fri', bp: 118, hr: 68 }
    ]
  },
  {
    id: '3',
    name: 'Mike Johnson',
    age: 58,
    condition: 'Diabetes management',
    lastRecord: {
      timestamp: new Date().toISOString(),
      vitals: { systolic: 122, diastolic: 80, heartRate: 70, temperature: 36.9, oxygenLevel: 97 }
    },
    status: 'normal',
    trend: [
      { date: 'Mon', bp: 120, hr: 68 },
      { date: 'Tue', bp: 121, hr: 69 },
      { date: 'Wed', bp: 122, hr: 70 },
      { date: 'Thu', bp: 122, hr: 70 },
      { date: 'Fri', bp: 122, hr: 70 }
    ]
  }
];

const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const attentionPatientsCount = mockPatients.filter(p => p.status === 'attention').length;
  const normalPatientsCount = mockPatients.filter(p => p.status === 'normal').length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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
            <div className="user-info">
              <div className="user-avatar doctor">
                <span>D</span>
              </div>
              <div className="user-details">
                <p className="user-name">Dr. Smith</p>
                <p className="user-role">Cardiologist</p>
              </div>
            </div>
            <button className="logout-btn">
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
              <h2>Good morning, Dr. Smith! 👨‍⚕️</h2>
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
                <p className="stat-value">{mockPatients.length}</p>
                <p className="stat-trend positive">+2 this week</p>
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
                <p className="stat-label">Avg Recovery</p>
                <p className="stat-value">87%</p>
                <p className="stat-trend positive">+5% improvement</p>
              </div>
            </div>
          </div>

          <div className="patients-section">
            <div className="section-header">
              <h3>Patient List</h3>
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

            <div className="patients-grid">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`patient-card ${patient.status}`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="patient-header">
                    <div className="patient-avatar">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="patient-info">
                      <h4>{patient.name}</h4>
                      <p>{patient.age} years • {patient.condition}</p>
                    </div>
                    {patient.status === 'attention' && (
                      <div className="alert-badge">
                        <AlertCircle size={16} />
                      </div>
                    )}
                  </div>

                  <div className="patient-vitals-summary">
                    <div className="vital-badge">
                      <span className="vital-label">BP:</span>
                      <span className="vital-value">
                        {patient.lastRecord.vitals.systolic}/{patient.lastRecord.vitals.diastolic}
                      </span>
                    </div>
                    <div className="vital-badge">
                      <span className="vital-label">HR:</span>
                      <span className="vital-value">{patient.lastRecord.vitals.heartRate}</span>
                    </div>
                    <div className="vital-badge">
                      <span className="vital-label">O2:</span>
                      <span className="vital-value">{patient.lastRecord.vitals.oxygenLevel}%</span>
                    </div>
                  </div>

                  <div className="patient-footer">
                    <span className="last-update">Updated: {formatDate(patient.lastRecord.timestamp)}</span>
                    <button className="view-details-btn">View Details →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPatient && (
            <div className="analytics-section">
              <div className="section-header">
                <h3>{selectedPatient.name} - Health Trends</h3>
                <button className="close-btn" onClick={() => setSelectedPatient(null)}>×</button>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h4>Blood Pressure Trend</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={selectedPatient.trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="bp" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h4>Heart Rate Trend</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={selectedPatient.trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;