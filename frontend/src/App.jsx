import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import GigsPage from './pages/GigsPage';
import ProfilePage from './pages/ProfilePage';
import SkillAnalyzerPage from './pages/SkillAnalyzerPage';
import PostGigPage from './pages/PostGigPage';

// Protected route wrapper
const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" /></div>;
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={isLoggedIn() ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup"    element={isLoggedIn() ? <Navigate to="/dashboard" /> : <SignupPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/gigs"      element={<GigsPage />} />
        <Route path="/post-gig"  element={<PrivateRoute><PostGigPage /></PrivateRoute>} />
        <Route path="/ai-skill"  element={<PrivateRoute><SkillAnalyzerPage /></PrivateRoute>} />
        <Route path="/profile"   element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontFamily: 'DM Sans' } }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
