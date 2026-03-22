import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sosAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isLoggedIn, isWoman, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); toast.success('Logged out safely'); };

  const handleSOS = async () => {
    if (!isLoggedIn()) { toast.error('Please login first'); return; }
    setSosLoading(true);
    try {
      // Get browser location
      navigator.geolocation?.getCurrentPosition(
        async (pos) => {
          await sosAPI.trigger({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            locationDescription: 'Live GPS location',
            message: 'EMERGENCY! I need immediate help!'
          });
          toast.error('🚨 SOS Alert sent! Emergency contacts notified.', { duration: 6000 });
          setSosLoading(false);
        },
        async () => {
          await sosAPI.trigger({ latitude: 0, longitude: 0, message: 'EMERGENCY! I need immediate help!' });
          toast.error('🚨 SOS Alert sent!', { duration: 6000 });
          setSosLoading(false);
        }
      );
    } catch { setSosLoading(false); toast.error('Could not send SOS'); }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-rose-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-display font-bold text-xl text-rose-600">SheEarn</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/gigs" className={`transition-colors ${isActive('/gigs') ? 'text-rose-600' : 'text-gray-600 hover:text-rose-500'}`}>Browse Gigs</Link>
          {isLoggedIn() && (
            <>
              <Link to="/dashboard" className={`transition-colors ${isActive('/dashboard') ? 'text-rose-600' : 'text-gray-600 hover:text-rose-500'}`}>Dashboard</Link>
              {isWoman() && <Link to="/ai-skill" className={`transition-colors ${isActive('/ai-skill') ? 'text-rose-600' : 'text-gray-600 hover:text-rose-500'}`}>AI Analyzer</Link>}
              <Link to="/post-gig" className={`transition-colors ${isActive('/post-gig') ? 'text-rose-600' : 'text-gray-600 hover:text-rose-500'}`}>Post Gig</Link>
            </>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* SOS Button - only for logged-in women */}
          {isLoggedIn() && isWoman() && (
            <button
              onClick={handleSOS}
              disabled={sosLoading}
              className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse-slow transition-all"
            >
              <span>{sosLoading ? '...' : '🚨'}</span>
              <span>SOS</span>
            </button>
          )}

          {isLoggedIn() ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="hidden sm:flex items-center gap-2 text-sm text-gray-700 hover:text-rose-600 transition-colors">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-semibold text-xs">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="font-medium">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-rose-600 transition-colors">Logout</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary text-sm py-2 px-4 hidden sm:block">Login</Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-4">Join Free</Link>
            </div>
          )}

          {/* Hamburger */}
          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(o => !o)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-rose-50 px-4 py-3 space-y-2 animate-fade-in">
          <Link to="/gigs"      className="block py-2 text-sm text-gray-700 hover:text-rose-600" onClick={() => setMenuOpen(false)}>Browse Gigs</Link>
          {isLoggedIn() && <>
            <Link to="/dashboard" className="block py-2 text-sm text-gray-700 hover:text-rose-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            {isWoman() && <Link to="/ai-skill" className="block py-2 text-sm text-gray-700 hover:text-rose-600" onClick={() => setMenuOpen(false)}>AI Analyzer</Link>}
            <Link to="/post-gig"  className="block py-2 text-sm text-gray-700 hover:text-rose-600" onClick={() => setMenuOpen(false)}>Post Gig</Link>
            <Link to="/profile"   className="block py-2 text-sm text-gray-700 hover:text-rose-600" onClick={() => setMenuOpen(false)}>Profile</Link>
            {isWoman() && <button onClick={handleSOS} className="w-full text-left py-2 text-sm text-red-600 font-bold">🚨 SOS Emergency</button>}
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block py-2 text-sm text-gray-500">Logout</button>
          </>}
          {!isLoggedIn() && <>
            <Link to="/login"  className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="block py-2 text-sm text-rose-600 font-medium" onClick={() => setMenuOpen(false)}>Sign Up Free</Link>
          </>}
        </div>
      )}
    </nav>
  );
}
