import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, User, Lock, Mail, UserCircle, Stethoscope } from 'lucide-react';
import { loginUser, registerUser, signInWithGoogle } from '../../firebase/auth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
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
      if (isLogin) {
        // Login
        await loginUser(formData.email, formData.password);
        navigate(userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        await registerUser(formData.email, formData.password, formData.name, userType);
        navigate(userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithGoogle(userType);
      navigate(userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
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
      <div className="background-icons">
        <Activity className="icon icon-1" size={64} />
        <Heart className="icon icon-2" size={80} />
        <Stethoscope className="icon icon-3" size={64} />
      </div>

      <div className="login-card">
        <div className="branding-section">
          <div className="branding-overlay"></div>
          
          <div className="branding-content">
            <div className="brand-header">
              <div className="brand-icon">
                <Heart size={40} />
              </div>
              <div className="brand-text">
                <h1 className="brand-title">HealthTrack</h1>
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

        <div className="form-section">
          <div className="form-header">
            <h2 className="form-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="form-subtitle">
              {isLogin ? 'Enter your credentials to access your account' : 'Sign up to start your health journey'}
            </p>
          </div>

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

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="google-signin-btn"
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : `Continue with Google as ${userType === 'patient' ? 'Patient' : 'Doctor'}`}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

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
                    required
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
                  required
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
                  required
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
                    required
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
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
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