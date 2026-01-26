import React from 'react';
import { Heart } from 'lucide-react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-icon">
          <Heart size={48} className="pulse-icon" />
        </div>
        <h2>Healix</h2>
        <div className="loading-spinner"></div>
        <p>Loading your health dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;