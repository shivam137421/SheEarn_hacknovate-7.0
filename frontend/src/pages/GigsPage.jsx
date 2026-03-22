import React, { useEffect, useState, useRef } from 'react';
import { gigAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const CATEGORIES = ['ALL','COOKING','STITCHING','TEACHING','BEAUTY','CRAFTS','CLEANING','OTHER'];
const CAT_ICONS  = { COOKING:'🍳', STITCHING:'🧵', TEACHING:'📚', BEAUTY:'💄', CRAFTS:'🎨', CLEANING:'🏠', OTHER:'✨', ALL:'🔍' };

const statusColor = {
  OPEN:'bg-emerald-100 text-emerald-700',
  ASSIGNED:'bg-amber-100 text-amber-700',
  IN_PROGRESS:'bg-violet-100 text-violet-700',
  COMPLETED:'bg-gray-100 text-gray-500'
};

function GigCard({ gig, onAccept, canAccept }) {
  return (
    <div className={`card hover:shadow-md transition-all relative ${gig.urgent ? 'border-red-200 bg-red-50/30' : ''}`}>
      {gig.urgent && (
        <div className="absolute top-3 right-3">
          <span className="badge bg-red-100 text-red-600 text-xs font-bold animate-pulse">⚡ URGENT</span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
          {CAT_ICONS[gig.category] || '✨'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`badge ${statusColor[gig.status]}`}>{gig.status}</span>
            <span className="text-xs text-gray-400">{gig.category}</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm truncate">{gig.title}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{gig.description}</p>
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">💰 <strong className="text-gray-700">₹{gig.price}</strong> {gig.priceType === 'HOURLY' ? '/hr' : ''}</span>
            <span className="flex items-center gap-1">⏱️ {gig.estimatedHours}h</span>
            {gig.city && <span className="flex items-center gap-1">📍 {gig.city}</span>}
            {gig.requiredSkillLevel !== 'ANY' && <span>🎯 {gig.requiredSkillLevel}</span>}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">Posted by {gig.customerName || 'Customer'}</span>
            {canAccept && gig.status === 'OPEN' && (
              <button onClick={() => onAccept(gig.id)}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                Accept Job →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GigsPage() {
  const { isWoman, isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const [gigs, setGigs]         = useState([]);
  const [urgent, setUrgent]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL');
  const [search, setSearch]     = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const loadGigs = async (cat = 'ALL') => {
    setLoading(true);
    try {
      const [gigsRes, urgentRes] = await Promise.all([
        cat === 'ALL' ? gigAPI.getAll() : gigAPI.getByCategory(cat),
        gigAPI.getUrgent(),
      ]);
      setGigs(gigsRes.data);
      setUrgent(urgentRes.data);
    } catch { toast.error('Could not load gigs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadGigs(category); }, [category]);

  const handleAccept = async (gigId) => {
    if (!isLoggedIn()) { toast.error('Please login to accept gigs'); return; }
    try {
      await gigAPI.accept(gigId);
      toast.success('Gig accepted! Check your dashboard.');
      loadGigs(category);
    } catch (err) { toast.error(err.response?.data?.error || 'Could not accept gig'); }
  };

  const handleNearby = () => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const res = await gigAPI.getNearby(pos.coords.latitude, pos.coords.longitude);
        setGigs(res.data);
        toast.success(`Found ${res.data.length} nearby gigs`);
      },
      () => toast.error('Could not get your location')
    );
  };

  // Voice search
  const handleVoiceSearch = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Voice not supported'); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setSearch(text);
      toast.success(`Searching for: "${text}"`);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend   = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  const filtered = gigs.filter(g =>
    search === '' ||
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Browse Gigs</h1>
          <p className="text-gray-500 text-sm">{filtered.length} opportunities available</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleNearby}
            className="flex items-center gap-1.5 text-sm border border-rose-200 text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors">
            📍 Near Me
          </button>
          <Link to="/post-gig" className="btn-primary text-sm py-2">+ Post Gig</Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by skill, title, or description..."
          className="input-field pr-12 py-3 text-sm"
        />
        <button onClick={handleVoiceSearch}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl transition-all ${listening ? 'animate-pulse text-rose-500 scale-125' : 'text-gray-400 hover:text-rose-500'}`}>
          🎤
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-300'
            }`}>
            <span>{CAT_ICONS[cat]}</span>
            <span>{cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}</span>
          </button>
        ))}
      </div>

      {/* Urgent section */}
      {urgent.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span>
            <h2 className="font-bold text-gray-800">Urgent Jobs – Available Now</h2>
            <span className="badge bg-red-100 text-red-600">{urgent.length} open</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgent.slice(0,4).map(gig => (
              <GigCard key={gig.id} gig={gig} onAccept={handleAccept} canAccept={isWoman()} />
            ))}
          </div>
        </div>
      )}

      {/* All gigs */}
      <div>
        <h2 className="font-bold text-gray-800 mb-4">
          {category === 'ALL' ? 'All Open Gigs' : `${category.charAt(0) + category.slice(1).toLowerCase()} Gigs`}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500">No gigs found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(gig => (
              <GigCard key={gig.id} gig={gig} onAccept={handleAccept} canAccept={isWoman()} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
