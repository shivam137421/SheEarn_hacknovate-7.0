import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gigAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['COOKING','STITCHING','TEACHING','BEAUTY','CRAFTS','CLEANING','OTHER'];

export default function PostGigPage() {
  const navigate = useNavigate();
  const { isWoman } = useAuth();
  const [form, setForm] = useState({
    title:'', description:'', category:'COOKING', price:'', priceType:'FIXED',
    estimatedHours:1, location:'', city:'', isUrgent:false, requiredSkill:'',
    requiredSkillLevel:'ANY', latitude:0, longitude:0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleGetLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setForm(f => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        toast.success('Location captured!');
      },
      () => toast.error('Could not get location')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price) {
      toast.error('Please fill in all required fields'); return;
    }
    setLoading(true);
    try {
      await gigAPI.create({ ...form, price: parseFloat(form.price), estimatedHours: parseInt(form.estimatedHours) });
      toast.success('Gig posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post gig');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Post a Gig</h1>
        <p className="text-gray-500 text-sm mt-1">Describe the service you need. Skilled women nearby will apply.</p>
      </div>

      {isWoman() && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-700">
          💡 As a provider, you can also post gigs to offer your services to customers.
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gig Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. Need home-cooked meals for 4 people" required className="input-field" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Describe the job in detail — what you need, when, any special requirements..."
            required rows={4} className="input-field resize-none" />
        </div>

        {/* Category + Skill Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0)+c.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Required Skill Level</label>
            <select name="requiredSkillLevel" value={form.requiredSkillLevel} onChange={handleChange} className="input-field">
              <option value="ANY">Any Level</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (₹) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange}
              placeholder="500" min="0" required className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
            <select name="priceType" value={form.priceType} onChange={handleChange} className="input-field">
              <option value="FIXED">Fixed</option>
              <option value="HOURLY">Per Hour</option>
            </select>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estimated Hours</label>
          <input type="number" name="estimatedHours" value={form.estimatedHours} onChange={handleChange}
            min="1" max="24" className="input-field" />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location / Area</label>
            <input type="text" name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Sector 5, Noida" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
            <input type="text" name="city" value={form.city} onChange={handleChange}
              placeholder="e.g. Delhi" className="input-field" />
          </div>
        </div>

        {/* Get GPS location */}
        <button type="button" onClick={handleGetLocation}
          className="flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-medium">
          📍 Use My Current Location {form.latitude !== 0 && <span className="text-emerald-600">✓ Captured</span>}
        </button>

        {/* Urgent toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`relative w-10 h-6 rounded-full transition-colors ${form.isUrgent ? 'bg-rose-500' : 'bg-gray-300'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isUrgent ? 'translate-x-4' : ''}`} />
          </div>
          <input type="checkbox" name="isUrgent" checked={form.isUrgent} onChange={handleChange} className="hidden" />
          <span className="text-sm font-medium text-gray-700">⚡ Mark as Urgent (needed within 2 hours)</span>
        </label>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
          {loading
            ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            : '📮 Post Gig →'}
        </button>
      </form>
    </div>
  );
}
