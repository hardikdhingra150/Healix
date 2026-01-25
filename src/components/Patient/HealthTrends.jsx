import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Heart, Thermometer, Droplet } from 'lucide-react';
import './HealthTrends.css';

const HealthTrends = ({ healthRecords }) => {
  // Prepare data for charts (last 7 days)
  const chartData = healthRecords.slice(0, 7).reverse().map((record, index) => {
    const date = new Date(record.timestamp);
    return {
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bloodPressureSys: record.vitals.systolic,
      bloodPressureDia: record.vitals.diastolic,
      heartRate: record.vitals.heartRate,
      temperature: record.vitals.temperature,
      oxygenLevel: record.vitals.oxygenLevel,
      weight: record.vitals.weight
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="health-trends">
        <div className="trends-header">
          <TrendingUp size={24} />
          <h3>Health Trends</h3>
        </div>
        <div className="no-data">
          <p>Log at least 2 health records to see trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="health-trends">
      <div className="trends-header">
        <TrendingUp size={24} />
        <h3>Health Trends (Last 7 Days)</h3>
      </div>

      <div className="charts-container">
        {/* Blood Pressure Chart */}
        <div className="chart-card">
          <div className="chart-title">
            <Activity size={20} />
            <h4>Blood Pressure</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="bloodPressureSys" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                name="Systolic"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="bloodPressureDia" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                name="Diastolic"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Heart Rate Chart */}
        <div className="chart-card">
          <div className="chart-title">
            <Heart size={20} />
            <h4>Heart Rate</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#ef4444" 
                strokeWidth={2} 
                name="Heart Rate (bpm)"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Chart */}
        <div className="chart-card">
          <div className="chart-title">
            <Thermometer size={20} />
            <h4>Temperature</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} domain={[35, 40]} />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                name="Temperature (°C)"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Oxygen Level Chart */}
        <div className="chart-card">
          <div className="chart-title">
            <Droplet size={20} />
            <h4>Oxygen Level</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} domain={[90, 100]} />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="oxygenLevel" 
                stroke="#14b8a6" 
                strokeWidth={2} 
                name="Oxygen Level (%)"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HealthTrends;