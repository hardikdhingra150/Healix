import React, { useState } from 'react';
import { Heart, Activity, User, Lock, Mail, UserCircle, Stethoscope } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Firebase authentication will go here
      setTimeout(() => {
        alert(`${isLogin ? 'Login' : 'Registration'} successful as ${userType}!`);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      {/* Floating background icons */}
      <div className="background-icons">
        <Activity className="icon icon-1" size={64} />
        <Heart className="icon icon-2" size={80} />
        <Stethoscope className="icon icon-3" size={64} />
      </div>

      <div className="login-card">
        {/* Left Side - Branding */}
        <div className="branding-section">
          <div className="branding-overlay"></div>
          
          <div className="branding-content">
            <div className="brand-header">
              <div className="brand-icon">
                <Heart size={40} />
              </div>
              <div className="brand-text">
                <h1 className="brand-title">Healix</h1>
                <p className="brand-subtitle">Post-Discharge Care Portal</p>
              </div>
            </div>

            <h2 className="branding-heading">
              Your Health,<br />Our Priority
            </h2>
            
            <p className="branding-description">
              Seamlessly monitor your recovery journey with real-time health tracking and direct access to your healthcare team.
            </p>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <Activity size={20} />
                </div>
                <div className="feature-text">
                  <h3>Real-Time Monitoring</h3>
                  <p>Track vitals and symptoms daily</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <Stethoscope size={20} />
                </div>
                <div className="feature-text">
                  <h3>Doctor Analytics</h3>
                  <p>Comprehensive health insights</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <Heart size={20} />
                </div>
                <div className="feature-text">
                  <h3>Better Recovery</h3>
                  <p>Personalized care plans</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="form-section">
          <div className="form-header">
            <h2 className="form-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="form-subtitle">
              {isLogin ? 'Enter your credentials to access your account' : 'Sign up to start your health journey'}
            </p>
          </div>

          {/* User Type Selector */}
          <div className="user-type-selector">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`user-type-btn ${userType === 'patient' ? 'active patient' : ''}`}
            >
              <User size={20} />
              Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType('doctor')}
              className={`user-type-btn ${userType === 'doctor' ? 'active doctor' : ''}`}
            >
              <Stethoscope size={20} />
              Doctor
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-fields">
            {!isLogin && (
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <UserCircle className="input-icon" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="input-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="forgot-password">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`submit-btn ${userType} ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <Activity className="spin" size={20} />
                  Processing...
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>

          <div className="form-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className={`toggle-form ${userType}`}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;