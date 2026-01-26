import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, X, Save } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { updateUserProfile } from '../../firebase/firestore';
import './ProfileModal.css';

const ProfileModal = ({ userData, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    dateOfBirth: userData?.dateOfBirth || '',
    emergencyContact: userData?.emergencyContact || '',
    bloodGroup: userData?.bloodGroup || '',
    allergies: userData?.allergies || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      console.log('Updating profile for user:', user.uid);

      // Update Firebase Auth displayName
      if (formData.name !== userData?.name) {
        await updateProfile(user, {
          displayName: formData.name
        });
        console.log('Auth profile updated');
      }

      // Update Firestore user document
      const profileData = {
        name: formData.name,
        phone: formData.phone || '',
        address: formData.address || '',
        dateOfBirth: formData.dateOfBirth || '',
        emergencyContact: formData.emergencyContact || '',
        bloodGroup: formData.bloodGroup || '',
        allergies: formData.allergies || '',
        updatedAt: new Date().toISOString()
      };

      await updateUserProfile(user.uid, profileData);
      console.log('Firestore profile updated');

      alert('Profile updated successfully!');
      
      // Call onUpdate if it exists, otherwise just close
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate();
      } else {
        // Just reload the page if no onUpdate function provided
        window.location.reload();
      }
      
      onClose();
    } catch (error) {
      console.error('Detailed error updating profile:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <div className="header-left">
            <User size={24} />
            <h2>Edit Profile</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="profile-modal-body">
          <div className="profile-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <User size={18} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email (Cannot be changed)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Phone size={18} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={18} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>
                <MapPin size={18} />
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
              />
            </div>
          </div>

          <div className="profile-section">
            <h3>Medical Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="List any allergies (e.g., Penicillin, Peanuts)"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="profile-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSubmit} disabled={loading}>
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;