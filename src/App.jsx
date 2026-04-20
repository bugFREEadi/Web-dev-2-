// Main App Component - sets up routing and context providers
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { useAuth } from './hooks/useAuth';

// Layout & Common
import Layout from './components/layout/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import RequestsPage from './pages/RequestsPage';
import VolunteersPage from './pages/VolunteersPage';
import ResourcesPage from './pages/ResourcesPage';
import SettingsPage from './pages/SettingsPage';
import OnboardingPage from './pages/OnboardingPage';

// Protected Route Wrapper - Requires Authentication
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loader-fullscreen">
        <div className="loader" />
        <p>Loading CrisisConnect...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but has no role (e.g. social login first time), send to onboarding
  if (!user.role && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <Outlet />;
};

// Public Only Route Wrapper - Redirects Authenticated Users to Dashboard
const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loader-fullscreen">
        <div className="loader" />
        <p>Loading CrisisConnect...</p>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public Routes - Only accessible when NOT logged in */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
            
            {/* Protected Routes inside Layout - Only accessible WHEN logged in */}
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/volunteers" element={<VolunteersPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Fallback route - Redirects to ROOT which handles auth routing cleanly */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
