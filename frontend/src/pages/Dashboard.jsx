import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, gigAPI, sosAPI } from '../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`card ${color} border-0`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
    </div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500 mt-0.5">{label}</div>
  </div>
);

export default function Dashboard() {
  const { user, isWoman } = useAuth();
  const [stats, setStats]   = useState(null);
  const [gigs, setGigs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [sosActive, setSosActive] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, gigRes] = await Promise.all([
          userAPI.getDashboard(),
          gigAPI.getMine(isWoman() ? 'provider' : 'customer'),
        ]);
        setStats(dashRes.data);
        setGigs(gigRes.data);
      } catch { toast.error('Could not load dashboard'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSOS = async () => {
    setSosActive(true);
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        await sosAPI.trigger({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, message: 'Emergency!' });
        toast.error('🚨 SOS SENT! Emergency contacts notified!', { duration: 8000 });
        setSosActive(false);
      },
      async () => {
        await sosAPI.trigger({ latitude: 0, longitude: 0, message: 'Emergency!' });
        toast.error('🚨 SOS SENT!', { duration: 8000 });
        setSosActive(false);
      }
    );
  };

  const handleGigAction = async (gigId, action) => {
    try {
      if (action === 'start')    await gigAPI.start(gigId);
      if (action === 'complete') await gigAPI.complete(gigId);
      toast.success(`Gig ${action === 'start' ? 'started' : 'completed'}!`);
      const res = await gigAPI.getMine(isWoman() ? 'provider' : 'customer');
      setGigs(res.data);
    } catch { toast.error('Action failed'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
    </div>
  );

  const statusColor = { OPEN:'bg-blue-50 text-blue-700', ASSIGNED:'bg-amber-50 text-amber-700', IN_PROGRESS:'bg-violet-50 text-violet-700', COMPLETED:'bg-emerald-50 text-emerald-700', CANCELLED:'bg-gray-100 text-gray-500' };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isWoman() ? 'Your skill dashboard — keep earning!' : 'Manage your service requests'}
          </p>
        </div>
        <div className="flex gap-3">
          {isWoman() && (
            <button onClick={handleSOS} disabled={sosActive}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl transition-all animate-pulse-slow">
              🚨 {sosActive ? 'Sending...' : 'SOS'}
            </button>
          )}
          <Link to="/gigs" className="btn-primary py-2">Browse Gigs</Link>
        </div>
      </div>

      {/* Stats */}
      {isWoman() && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon="💰" label="Total Earnings" value={`₹${stats.totalEarnings?.toLocaleString() || 0}`} color="bg-emerald-50" />
          <StatCard icon="✅" label="Completed Jobs"  value={stats.completedJobs || 0}   color="bg-blue-50" />
          <StatCard icon="⭐" label="Your Rating"     value={`${stats.rating || 0}/5`}    color="bg-amber-50" />
          <StatCard icon="💬" label="Total Reviews"   value={stats.totalReviews || 0}     color="bg-violet-50" />
        </div>
      )}

      {/* Verification banner */}
      {isWoman() && !stats?.isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🔐</span>
          <div>
            <div className="font-semibold text-amber-800 text-sm">Get Verified for More Trust</div>
            <div className="text-xs text-amber-600">Verified women get 3x more bookings. Upload your ID to get started.</div>
          </div>
          <button className="ml-auto text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600">Verify Now</button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label:'Browse Gigs',   icon:'🔍', to:'/gigs' },
          { label:'Post a Gig',    icon:'📝', to:'/post-gig' },
          ...(isWoman() ? [{ label:'AI Skill Check', icon:'🤖', to:'/ai-skill' }] : []),
          { label:'My Profile',    icon:'👤', to:'/profile' },
        ].map(({ label, icon, to }) => (
          <Link key={label} to={to} className="card hover:shadow-md transition-all text-center group">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xs font-medium text-gray-600 group-hover:text-rose-600">{label}</div>
          </Link>
        ))}
      </div>

      {/* Gigs list */}
      <div>
        <h2 className="font-display font-bold text-lg text-gray-800 mb-4">
          {isWoman() ? 'My Jobs' : 'My Posted Gigs'}
        </h2>

        {gigs.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500 font-medium">No gigs yet</p>
            <p className="text-sm text-gray-400 mt-1">
              {isWoman() ? 'Browse open gigs and start applying' : 'Post your first gig to find help'}
            </p>
            <Link to={isWoman() ? '/gigs' : '/post-gig'} className="btn-primary inline-block mt-4 text-sm">
              {isWoman() ? 'Find Gigs →' : 'Post Gig →'}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {gigs.map(gig => (
              <div key={gig.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${statusColor[gig.status] || 'bg-gray-100 text-gray-500'}`}>{gig.status}</span>
                    {gig.urgent && <span className="badge bg-red-100 text-red-600">⚡ URGENT</span>}
                    <span className="text-xs text-gray-400">{gig.category}</span>
                  </div>
                  <div className="font-semibold text-gray-800">{gig.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    ₹{gig.price} · {gig.estimatedHours}h · {gig.city || 'Remote'}
                    {gig.providerName && ` · Provider: ${gig.providerName}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isWoman() && gig.status === 'ASSIGNED' && (
                    <button onClick={() => handleGigAction(gig.id, 'start')}
                      className="text-xs bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-200 font-medium">
                      Start Job
                    </button>
                  )}
                  {gig.status === 'IN_PROGRESS' && (
                    <button onClick={() => handleGigAction(gig.id, 'complete')}
                      className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-200 font-medium">
                      Mark Done
                    </button>
                  )}
                  {gig.status === 'COMPLETED' && !gig.reviewGiven && !isWoman() && (
                    <button className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-200 font-medium">
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
