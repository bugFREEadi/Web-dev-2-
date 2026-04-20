import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Cloud, ChevronRight, Moon, Sun, Smartphone, Mail, Lock, Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';

export default function SettingsPage() {
  const { user, isDemo, updateUserProfile } = useAuth();
  const { addToast } = useData();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  // Notification Toggles State
  const [notifications, setNotifications] = useState({
    emailSOS: true,
    pushSOS: true,
    inventoryAlerts: false,
    volunteerUpdates: true
  });

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    addToast({ type: 'info', title: 'Setting Updated', message: 'Notification preferences updated.' });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(formData);
      addToast({ type: 'success', title: 'Profile Updated', message: 'Your changes have been saved.' });
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
            <div className="settings-section">
              <h3>Personal Information</h3>
              <p>Update your responder profile and contact details.</p>
              
              <form className="settings-form" onSubmit={handleSaveProfile}>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" name="displayName" className="input" value={formData.displayName} onChange={handleFormChange} required />
                </div>
                
                <div className="settings-row">
                  <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <input type="email" className="input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                  </div>
                  
                  <div className="input-group">
                    <label className="input-label">Phone Number</label>
                    <input type="tel" name="phone" className="input" value={formData.phone} onChange={handleFormChange} />
                  </div>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Default Assignment Location</label>
                  <input type="text" name="location" className="input" value={formData.location} onChange={handleFormChange} />
                </div>
                
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        );
      
      case 'notifications':
        return (
          <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
            <div className="settings-section">
              <h3>Notification Dispatch</h3>
              <p>Choose how you want to be alerted for emergency incidents.</p>
              
              <div className="notification-list" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { id: 'emailSOS', label: 'Email Alerts for New SOS', icon: Mail, desc: 'Receive instant emails for high priority requests.' },
                  { id: 'pushSOS', label: 'Push Notifications', icon: Smartphone, desc: 'Desktop alerts for assigned missions.' },
                  { id: 'inventoryAlerts', label: 'Critical Inventory Alerts', icon: Shield, desc: 'Notify when resources fall below 20%.' },
                ].map(item => (
                  <div key={item.id} className="notification-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <item.icon size={20} color="var(--text-secondary)" />
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.label}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                      </div>
                    </div>
                    <div 
                      onClick={() => handleToggleNotification(item.id)}
                      style={{ 
                        width: '44px', height: '24px', borderRadius: '12px', 
                        background: notifications[item.id] ? '#FF5CCD' : '#333',
                        position: 'relative', cursor: 'pointer', transition: '0.2s'
                      }}
                    >
                      <div style={{ 
                        width: '18px', height: '18px', background: 'white', borderRadius: '50%',
                        position: 'absolute', top: '3px', left: notifications[item.id] ? '23px' : '3px',
                        transition: '0.2s'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
            <div className="settings-section">
              <h3>Authentication Security</h3>
              <p>Secure your responder account with advanced authentication settings.</p>
              
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '20px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Lock size={20} color="#FF6E00" />
                    <h4 style={{ margin: 0 }}>Two-Factor Authentication</h4>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Add an extra layer of security by requiring a mobile verification code.</p>
                  <button className="btn btn-secondary btn-sm" disabled={isDemo}>Enable 2FA</button>
                </div>

                <div style={{ padding: '20px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Smartphone size={20} color="var(--text-secondary)" />
                    <h4 style={{ margin: 0 }}>Connected Devices</h4>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>You are currently signed in from 1 device in Mumbai, India.</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'preferences':
        return (
          <motion.div key="preferences" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
            <div className="settings-section">
              <h3>Interface Preferences</h3>
              <p>Customize your command center viewing experience.</p>
              
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="settings-row">
                  <div className="input-group">
                    <label className="input-label">Theme Mode</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn btn-primary" style={{ padding: '8px 16px', background: 'white', color: 'black' }}><Sun size={16} /> Light</button>
                      <button className="btn btn-primary" style={{ padding: '8px 16px', background: '#222' }}><Moon size={16} /> Dark</button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Dashboard Refresh Rate</label>
                    <select className="select">
                      <option>Real-time (Stream)</option>
                      <option>Every 30 seconds</option>
                      <option>Manual only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Global Settings</h1>
        <p>Control your response mission parameters and system behaviors.</p>
        {isDemo && (
          <div className="auth-error" style={{ marginTop: '16px', display: 'inline-block', background: 'rgba(255, 92, 205, 0.1)', color: '#FF5CCD', borderColor: 'rgba(255, 92, 205, 0.2)' }}>
            Note: You are currently navigating in Demo Environment.
          </div>
        )}
      </motion.div>

      <div className="settings-grid">
        <aside className="settings-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
              <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: activeTab === tab.id ? 1 : 0 }} />
            </button>
          ))}
        </aside>

        <main className="settings-content">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
