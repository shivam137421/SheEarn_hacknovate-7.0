import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [listening, setListening]   = useState(false);
  const recognitionRef = useRef(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  // Voice input using Web Speech API
  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error('Voice input not supported in this browser'); return; }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript.toLowerCase();
      toast.success(`Heard: "${text}"`);
      // Parse voice commands like "email priya@gmail.com"
      const emailMatch = text.match(/email\s+(\S+@\S+\.\S+)/);
      if (emailMatch) setForm(f => ({ ...f, email: emailMatch[1] }));
      setListening(false);
    };
    rec.onerror = () => { setListening(false); toast.error('Could not hear clearly. Try again.'); };
    rec.onend   = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-violet-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-rose-50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold font-display">S</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your SheEarn account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required
                  className="input-field pr-10"
                />
                <button type="button" onClick={handleVoice}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg transition-transform ${listening ? 'animate-pulse text-rose-500 scale-125' : 'text-gray-400 hover:text-rose-500'}`}
                  title="Voice input">
                  🎤
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 mt-2">
              {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Demo Accounts</p>
            <p className="text-xs text-amber-600">Woman: priya@shearn.com / pass123</p>
            <p className="text-xs text-amber-600">Customer: rahul@shearn.com / pass123</p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            New to SheEarn?{' '}
            <Link to="/signup" className="text-rose-600 font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
