import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import './HealthAlerts.css';

const HealthAlerts = ({ latestRecord }) => {
  if (!latestRecord) return null;

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
      <div className="health-alerts">
        <div className="alert-card success">
          <CheckCircle size={24} />
          <div className="alert-content">
            <h4>All Vitals Normal</h4>
            <p>Your latest health readings are within normal ranges. Keep up the good work!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="health-alerts">
      <div className="alerts-header">
        <AlertCircle size={20} />
        <h3>Health Alerts</h3>
      </div>
      {alerts.map((alert, index) => (
        <div key={index} className={`alert-card ${alert.type}`}>
          {alert.type === 'danger' && <AlertCircle size={24} />}
          {alert.type === 'warning' && <AlertTriangle size={24} />}
          {alert.type === 'info' && <AlertCircle size={24} />}
          <div className="alert-content">
            <h4>{alert.title}</h4>
            <p>{alert.message}</p>
          </div>
        </div>
      ))}
      <div className="alert-footer">
        <p>⚠️ If you're experiencing concerning symptoms, please contact your doctor immediately.</p>
      </div>
    </div>
  );
};

export default HealthAlerts;