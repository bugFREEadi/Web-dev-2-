// Signup Page — registration with role selection
// Demonstrates: useState, controlled components, lifting state up, form validation
import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const { signup, loginAsDemo, loginWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
  });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  // Generic change handler for controlled components
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      clearError();
      setLocalError('');

      if (formData.password !== formData.confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }

      setSubmitting(true);
      try {
        await signup(formData.email, formData.password, formData.displayName, formData.role);
        navigate('/dashboard');
      } catch {
        // Error is set in context
      } finally {
        setSubmitting(false);
      }
    },
    [formData, signup, navigate, clearError]
  );

  const handleDemoLogin = useCallback(() => {
    loginAsDemo();
    navigate('/dashboard');
  }, [loginAsDemo, navigate]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch {
      // Error is set in context
    }
  }, [loginWithGoogle, navigate]);

  const displayError = localError || error;

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Shield size={28} color="white" />
          </div>
          <h1>Create Account</h1>
          <p>Join CrisisConnect and make a difference</p>
        </div>

        {displayError && (
          <motion.div
            className="auth-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {displayError}
          </motion.div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              name="displayName"
              className="auth-input"
              placeholder="John Doe"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              className="auth-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="signup-role">I want to join as</label>
            <select
              id="signup-role"
              name="role"
              className="auth-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="citizen">Citizen — Report emergencies</option>
              <option value="volunteer">Volunteer — Help those in need</option>
              <option value="admin">Coordinator — Manage operations</option>
            </select>
          </div>

          <div className="auth-input-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              className="auth-input"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="signup-confirm">Confirm Password</label>
            <input
              id="signup-confirm"
              type="password"
              name="confirmPassword"
              className="auth-input"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={submitting || !formData.email || !formData.password || !formData.displayName}
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider" style={{ margin: '20px 0' }}>or</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="auth-demo-btn" onClick={handleGoogleLogin} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7l2.85 2.2c1.67-1.53 2.63-3.79 2.63-6.55z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.85-2.2c-.79.53-1.8.85-3.11.85-2.39 0-4.41-1.61-5.14-3.77L.95 13.46C2.43 16.36 5.48 18 9 18z" fill="#34A853"/><path d="M3.86 10.7c-.19-.56-.3-1.16-.3-1.77 0-.61.11-1.21.3-1.77L.95 4.71C.35 5.91 0 7.27 0 8.7s.35 2.79.95 3.99l2.91-2.26z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.89 11.42 0 9 0 5.48 0 2.43 1.64.95 4.54l2.91 2.26C4.59 5.19 6.61 3.58 9 3.58z" fill="#EA4335"/></svg>
            Sign in with Google
          </button>

          <button className="auth-demo-btn" onClick={handleDemoLogin}>
            🚀 Try Demo Mode
          </button>
        </div>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
