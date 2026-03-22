import React, { useState, useEffect } from 'react';
import { userAPI, sosAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SKILL_OPTIONS = ['COOKING','STITCHING','TEACHING','BEAUTY','CRAFTS','CLEANING','OTHER'];

export default function ProfilePage() {
  const { user: authUser, isWoman } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [sosHistory, setSosHistory] = useState([]);

  useEffect(() => {
    userAPI.getMe().then(r => {
      setProfile(r.data);
      setForm(r.data);
    }).catch(() => toast.error('Could not load profile'));

    if (isWoman()) {
      sosAPI.getMine().then(r => setSosHistory(r.data)).catch(() => {});
    }
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSkillToggle = (skill) => {
    const current = form.skills || [];
    const updated = current.includes(skill)
      ? current.filter(s => s !== skill)
      : [...current, skill];
    setForm(f => ({ ...f, skills: updated }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userAPI.updateMe(form);
      setProfile(res.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Could not save profile'); }
    finally { setSaving(false); }
  };

  const handleUpdateLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const res = await userAPI.updateLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setProfile(res.data);
        toast.success('Location updated!');
      },
      () => toast.error('Could not get location')
    );
  };

  if (!profile) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Avatar + stats */}
        <div className="space-y-4">
          <div className="card text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-violet-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
              {profile.name?.[0]?.toUpperCase()}
            </div>
            <h2 className="font-display font-bold text-gray-800">{profile.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{profile.city || 'Location not set'}</p>

            {/* Verification badge */}
            <div className={`mt-2 inline-flex items-center gap-1 badge ${profile.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
              {profile.verified ? '✅ Verified' : '⏳ Pending Verification'}
            </div>

            {/* Role badge */}
            <div className="mt-2">
              <span className={`badge ${profile.role === 'WOMAN' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                {profile.role === 'WOMAN' ? '👩‍💼 Provider' : '🛍️ Customer'}
              </span>
            </div>
          </div>

          {/* Stats for women */}
          {isWoman() && (
            <div className="card space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Earnings</span>
                <span className="font-bold text-emerald-600">₹{profile.totalEarnings?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Jobs Done</span>
                <span className="font-bold text-gray-800">{profile.completedJobs || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Rating</span>
                <span className="font-bold text-amber-600">⭐ {profile.rating || 0}/5 ({profile.totalReviews || 0})</span>
              </div>
            </div>
          )}

          {/* Location */}
          <button onClick={handleUpdateLocation}
            className="w-full text-sm text-rose-600 border border-rose-200 hover:bg-rose-50 py-2 rounded-xl transition-colors flex items-center justify-center gap-2">
            📍 Update My Location
          </button>
        </div>

        {/* Right: Editable form */}
        <div className="md:col-span-2 space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Personal Information</h3>
              {!editing
                ? <button onClick={() => setEditing(true)} className="text-xs text-rose-600 font-medium hover:underline">Edit</button>
                : <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="text-xs text-gray-500 hover:underline">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="text-xs bg-rose-600 text-white px-3 py-1 rounded-lg hover:bg-rose-700">
                      {saving ? '...' : 'Save'}
                    </button>
                  </div>
              }
            </div>

            <div className="space-y-3">
              {[
                { label:'Full Name',  name:'name',  type:'text',  placeholder:'Your name' },
                { label:'Phone',      name:'phone', type:'tel',   placeholder:'+91 00000' },
                { label:'City',       name:'city',  type:'text',  placeholder:'Your city' },
                { label:'Bio',        name:'bio',   type:'text',  placeholder:'Tell customers about yourself' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  {editing
                    ? <input type={type} name={name} value={form[name] || ''} onChange={handleChange}
                        placeholder={placeholder} className="input-field text-sm" />
                    : <div className="text-sm text-gray-800 py-1">{profile[name] || <span className="text-gray-400 italic">Not set</span>}</div>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Skills (women only) */}
          {isWoman() && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-3">My Skills</h3>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map(skill => {
                  const active = (editing ? form.skills : profile.skills)?.includes(skill);
                  return (
                    <button key={skill} type="button"
                      onClick={() => editing && handleSkillToggle(skill)}
                      className={`badge transition-all ${
                        active
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      } ${editing ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}>
                      {skill.charAt(0) + skill.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
              {!editing && <p className="text-xs text-gray-400 mt-2">Click Edit to update your skills</p>}
            </div>
          )}

          {/* Emergency Contact */}
          {isWoman() && (
            <div className="card border-red-100">
              <h3 className="font-semibold text-gray-800 mb-3">🚨 Emergency Contact (SOS)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Contact Name</label>
                  {editing
                    ? <input type="text" name="emergencyContact" value={form.emergencyContact || ''} onChange={handleChange}
                        placeholder="e.g. Mom / Sister" className="input-field text-sm" />
                    : <div className="text-sm text-gray-800">{profile.emergencyContact || <span className="text-gray-400 italic">Not set</span>}</div>
                  }
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Emergency Phone</label>
                  {editing
                    ? <input type="tel" name="emergencyPhone" value={form.emergencyPhone || ''} onChange={handleChange}
                        placeholder="+91 00000" className="input-field text-sm" />
                    : <div className="text-sm text-gray-800">{profile.emergencyPhone || <span className="text-gray-400 italic">Not set</span>}</div>
                  }
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">This contact is notified when you press the SOS button</p>
            </div>
          )}

          {/* SOS History */}
          {isWoman() && sosHistory.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-3">SOS History</h3>
              <div className="space-y-2">
                {sosHistory.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600 truncate">{s.message}</span>
                    <span className={`badge ml-2 flex-shrink-0 ${s.status === 'ACTIVE' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
