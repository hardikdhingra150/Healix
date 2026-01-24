import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    window.location.href = '/login';
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">⚡️</span>
            <span>Healix</span>
          </div>
          <ul className="nav-links">
            <li><button onClick={() => scrollToSection('features')}>Features</button></li>
            <li><button onClick={() => scrollToSection('how-it-works')}>How It Works</button></li>
            <li><button onClick={() => scrollToSection('testimonials')}>Testimonials</button></li>
          </ul>
          <button onClick={handleGetStarted} className="cta-button">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="gradient-circle circle-1"></div>
          <div className="gradient-circle circle-2"></div>
          <div className="gradient-circle circle-3"></div>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span style={{ fontSize: '16px' }}>⚡</span>
              <span>Post-Discharge Care Platform</span>
            </div>
            <h1>Post-Discharge Care Made Simple</h1>
            <p>Monitor your recovery journey with real-time health tracking. Connect with your doctor seamlessly and ensure better health outcomes.</p>
            <div className="hero-buttons">
              <button onClick={handleGetStarted} className="primary-btn">
                Start Tracking Now
                <span style={{ fontSize: '20px' }}>→</span>
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="secondary-btn">
                Learn More
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span style={{ fontSize: '20px' }}>✓</span>
                <span>98% Satisfaction</span>
              </div>
              <div className="stat-item">
                <span style={{ fontSize: '20px' }}>✓</span>
                <span>1000+ Users</span>
              </div>
              <div className="stat-item">
                <span style={{ fontSize: '20px' }}>✓</span>
                <span>24/7 Monitoring</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="mockup-content">
                <div className="stat-cards">
                  <div className="mini-card card-blue">
                    <span style={{ fontSize: '24px' }}>💓</span>
                    <div className="card-info">
                      <span className="card-label">Blood Pressure</span>
                      <span className="card-value">120/80</span>
                    </div>
                  </div>
                  <div className="mini-card card-red">
                    <span style={{ fontSize: '24px' }}>❤️</span>
                    <div className="card-info">
                      <span className="card-label">Heart Rate</span>
                      <span className="card-value">72 bpm</span>
                    </div>
                  </div>
                </div>
                <div className="chart-area">
                  <span style={{ fontSize: '80px' }}>📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <div className="section-badge">
            <span style={{ fontSize: '16px' }}>⚡</span>
            
          </div>
          <h2>Everything You Need for Better Recovery</h2>
          <p>Comprehensive tools designed for patients and healthcare providers</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon icon-blue">
              <span style={{ fontSize: '32px' }}>💓</span>
            </div>
            <h3>Real-Time Vitals Tracking</h3>
            <p>Log blood pressure, heart rate, temperature, oxygen levels, and weight daily. Monitor your health trends effortlessly.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-purple">
              <span style={{ fontSize: '32px' }}>👥</span>
            </div>
            <h3>Doctor Dashboard</h3>
            <p>Healthcare providers can monitor all patients in one place with comprehensive analytics and health trend visualization.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-orange">
              <span style={{ fontSize: '32px' }}>💬</span>
            </div>
            <h3>Smart Alerts</h3>
            <p>Automatic notifications when vitals fall outside normal ranges, ensuring timely medical intervention.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-green">
              <span style={{ fontSize: '32px' }}>📈</span>
            </div>
            <h3>Health Analytics</h3>
            <p>Beautiful charts and graphs showing your health trends over time, helping you understand your recovery progress.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-pink">
              <span style={{ fontSize: '32px' }}>📅</span>
            </div>
            <h3>Symptom Logging</h3>
            <p>Record symptoms and notes alongside your vitals to give doctors complete context of your health status.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-teal">
              <span style={{ fontSize: '32px' }}>🛡️</span>
            </div>
            <h3>Secure & Private</h3>
            <p>Your health data is encrypted and stored securely with Firebase. Only you and your authorized doctors can access it.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <div className="section-badge">
            <span style={{ fontSize: '16px' }}>⏱️</span>
            
          </div>
          <h2>How HealthTrack Works</h2>
          <p>Get started in three simple steps</p>
        </div>
        <div className="steps-container">
          <div className="step-line"></div>
          <div className="step">
            <div className="step-number">
              <span>1</span>
            </div>
            <div className="step-icon">
              <span style={{ fontSize: '32px' }}>👤</span>
            </div>
            <h3>Create Your Account</h3>
            <p>Sign up as a patient or doctor using email or Google authentication. It takes less than a minute.</p>
          </div>
          <div className="step">
            <div className="step-number">
              <span>2</span>
            </div>
            <div className="step-icon">
              <span style={{ fontSize: '32px' }}>📝</span>
            </div>
            <h3>Log Your Health Data</h3>
            <p>Patients can easily log daily vitals through an intuitive interface. Takes just 2 minutes per day.</p>
          </div>
          <div className="step">
            <div className="step-number">
              <span>3</span>
            </div>
            <div className="step-icon">
              <span style={{ fontSize: '32px' }}>📊</span>
            </div>
            <h3>Monitor & Improve</h3>
            <p>Track trends, receive alerts, and share data with your doctor for better health outcomes.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stats-background"></div>
        <div className="stats-container">
          <div className="stat">
            <div className="stat-icon">
              <span style={{ fontSize: '32px' }}>❤️</span>
            </div>
            <h3>98%</h3>
            <p>Patient Satisfaction</p>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <span style={{ fontSize: '32px' }}>⏰</span>
            </div>
            <h3>24/7</h3>
            <p>Health Monitoring</p>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <span style={{ fontSize: '32px' }}>👥</span>
            </div>
            <h3>1000+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <span style={{ fontSize: '32px' }}>🩺</span>
            </div>
            <h3>50+</h3>
            <p>Healthcare Providers</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="section-header">
          <div className="section-badge">
            <span style={{ fontSize: '16px' }}>💬</span>
            
          </div>
          <h2>What Our Users Say</h2>
          <p>Real stories from patients and doctors</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">HealthTrack made my post-surgery recovery so much easier. I could track my vitals daily and my doctor could monitor my progress remotely. Highly recommended!</p>
            <div className="testimonial-author">
              <div className="author-avatar">
                <span>JD</span>
              </div>
              <div className="author-info">
                <h4>Jatin</h4>
                <p>Cardiac Patient</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">As a cardiologist, HealthTrack has transformed how I monitor my post-discharge patients. The analytics dashboard is excellent and the alerts help me intervene early.</p>
            <div className="testimonial-author">
              <div className="author-avatar">
                <span>DS</span>
              </div>
              <div className="author-info">
                <h4>Dr. Sarah</h4>
                <p>Cardiologist</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">Simple, effective, and user-friendly. I'm 65 and not tech-savvy, but I can easily log my health data every morning. It gives me peace of mind.</p>
            <div className="testimonial-author">
              <div className="author-avatar">
                <span>MJ</span>
              </div>
              <div className="author-info">
                <h4>Rohan</h4>
                <p>Diabetes Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to Take Control of Your Health?</h2>
          <p>Join thousands of patients and doctors using HealthTrack for better post-discharge care.</p>
          <button onClick={handleGetStarted} className="primary-btn large">
            Get Started Free
            <span style={{ fontSize: '20px' }}>→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">
              <span style={{ fontSize: '28px' }}>❤️</span>
              <span>Healix</span>
            </div>
            <p>Post-discharge patient monitoring made simple and effective.</p>
          </div>
          <div className="footer-section">
            <h3>Product</h3>
            <ul>
              <li><button onClick={() => scrollToSection('features')}>Features</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')}>How It Works</button></li>
              <li><button onClick={handleGetStarted}>Get Started</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Security</h3>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 HealthTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;