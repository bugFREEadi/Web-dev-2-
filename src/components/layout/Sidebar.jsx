// Sidebar navigation — role-based nav with active state detection
// Demonstrates: React Router NavLink, conditional rendering, props
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Package,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { getInitials } from '../../utils/formatters';
import { useState, useCallback, memo } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/requests', label: 'SOS Requests', icon: AlertTriangle, showBadge: true },
  { path: '/volunteers', label: 'Volunteers', icon: Users },
  { path: '/resources', label: 'Resources', icon: Package },
];

const bottomItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = memo(function Sidebar() {
  const { user, logout, isDemo } = useAuth();
  const { stats } = useData();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login');
  }, [logout, navigate]);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={toggleMobile} aria-label="Toggle menu">
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          onClick={closeMobile}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Shield size={22} color="white" />
          </div>
          <div className="sidebar-brand">
            <h2>CrisisConnect</h2>
            <span>{isDemo ? 'Demo Mode' : 'Relief Coordination'}</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={closeMobile}
            >
              <item.icon size={18} />
              {item.label}
              {item.showBadge && stats.pendingRequests > 0 && (
                <motion.span
                  className="sidebar-link-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {stats.pendingRequests}
                </motion.span>
              )}
            </NavLink>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: 'auto' }}>
            System
          </div>
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={closeMobile}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(user?.displayName)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.displayName}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
            <button
              className="btn-ghost btn-icon"
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
});

export default Sidebar;
