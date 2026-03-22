import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ name:'', email:'', password:'', role:'WOMAN', phone:'', city:'' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      toast.success('Welcome to SheEarn! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-violet-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-rose-50">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold font-display">S</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Join SheEarn</h1>
            <p className="text-gray-500 text-sm mt-1">Create your free account today</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { val:'WOMAN',    icon:'👩‍💼', label:'I Offer Skills',    sub:'Woman Provider' },
              { val:'CUSTOMER', icon:'🛍️', label:'I Need Services',   sub:'Customer' },
            ].map(({ val, icon, label, sub }) => (
              <button key={val} type="button" onClick={() => setForm(f => ({ ...f, role: val }))}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  form.role === val ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-rose-200'
                }`}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className={`text-sm font-semibold ${form.role === val ? 'text-rose-600' : 'text-gray-700'}`}>{label}</div>
                <div className="text-xs text-gray-400">{sub}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Your name" required className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 00000" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange}
                  placeholder="Your city" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="Min 6 chars" required minLength={6} className="input-field" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 mt-2">
              {loading
                ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                : `Join as ${form.role === 'WOMAN' ? 'Provider' : 'Customer'} →`}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By joining, you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="text-center text-sm text-gray-500 mt-3">
            Already a member?{' '}
            <Link to="/login" className="text-rose-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
