// Onboarding Page — role selection for social login users
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';

export default function OnboardingPage() {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useData();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async () => {
    if (!selectedRole) return;
    
    setSubmitting(true);
    try {
      await updateUserProfile({ role: selectedRole });
      addToast({ type: 'success', title: 'Onboarding Complete', message: `Welcome! You are now joined as a ${selectedRole}.` });
      navigate('/dashboard');
    } catch {
      addToast({ type: 'error', title: 'Registration Failed', message: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const roles = [
    { 
      id: 'citizen', 
      title: 'Citizen', 
      desc: 'I want to report emergencies and request help for my community.',
      icon: User,
      color: '#FF5CCD'
    },
    { 
      id: 'volunteer', 
      title: 'Volunteer', 
      desc: 'I want to respond to active SOS requests and assist coordinators.',
      icon: Shield,
      color: '#C8E6C9'
    }
  ];

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <motion.div 
        className="auth-card" 
        style={{ maxWidth: '600px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-brand">
          <h1>Final Step</h1>
          <p>Welcome, {user?.displayName}. Please select your mission role to continue.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '40px 0' }}>
          {roles.map(role => (
            <div 
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              style={{
                padding: '32px 24px',
                borderRadius: '24px',
                border: `2px solid ${selectedRole === role.id ? role.color : '#222'}`,
                background: selectedRole === role.id ? 'rgba(255,255,255,0.05)' : '#0a0a0a',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '16px', 
                background: 'rgba(255,255,255,0.05)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', marginBottom: '20px' 
              }}>
                <role.icon size={28} color={selectedRole === role.id ? role.color : '#555'} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{role.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{role.desc}</p>
              
              {selectedRole === role.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginTop: '16px' }}>
                  <CheckCircle size={20} color={role.color} />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <button 
          className="auth-btn" 
          disabled={!selectedRole || submitting}
          onClick={handleComplete}
          style={{ background: selectedRole ? '#fff' : '#333', color: '#000' }}
        >
          {submitting ? 'Setting up profile...' : 'Complete Registration'}
        </button>
      </motion.div>
    </div>
  );
}
