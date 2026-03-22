import React, { useState, useEffect } from 'react';
import { skillAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value:'COOKING',  icon:'🍳', label:'Cooking' },
  { value:'STITCHING',icon:'🧵', label:'Stitching' },
  { value:'TEACHING', icon:'📚', label:'Teaching' },
  { value:'BEAUTY',   icon:'💄', label:'Beauty & Makeup' },
  { value:'CRAFTS',   icon:'🎨', label:'Crafts' },
  { value:'CLEANING', icon:'🏠', label:'Cleaning' },
  { value:'OTHER',    icon:'✨', label:'Other Skill' },
];

const LEVEL_COLORS = {
  BEGINNER:     { bg:'bg-blue-50',    text:'text-blue-700',    border:'border-blue-200',    label:'🌱 Beginner' },
  INTERMEDIATE: { bg:'bg-amber-50',   text:'text-amber-700',   border:'border-amber-200',   label:'🌟 Intermediate' },
  ADVANCED:     { bg:'bg-emerald-50', text:'text-emerald-700', border:'border-emerald-200', label:'🏆 Advanced' },
};

const DEMAND_COLORS = {
  LOW:    'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH:   'bg-emerald-100 text-emerald-700',
};

function AnalysisResult({ result }) {
  const level = LEVEL_COLORS[result.skillLevel] || LEVEL_COLORS.BEGINNER;
  const conf  = Math.round((result.confidence || 0.75) * 100);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Level + Score */}
      <div className={`${level.bg} ${level.border} border rounded-2xl p-6 text-center`}>
        <div className={`text-3xl font-display font-bold ${level.text} mb-1`}>{level.label}</div>
        <div className="text-sm text-gray-500">Overall Score: <strong>{result.overallScore}</strong></div>
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1">AI Confidence: {conf}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full bg-rose-500 transition-all`} style={{ width: `${conf}%` }} />
          </div>
        </div>
      </div>

      {/* Price recommendation */}
      <div className="card border-emerald-100 bg-emerald-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💰</span>
          <span className="font-semibold text-gray-800 text-sm">Suggested Price Range</span>
        </div>
        <div className="text-2xl font-bold text-emerald-700">
          {result.minPrice} – {result.maxPrice}
          <span className="text-sm font-normal text-gray-500 ml-1">per hour</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`badge ${DEMAND_COLORS[result.marketDemand]}`}>
            {result.marketDemand} Market Demand
          </span>
        </div>
      </div>

      {/* Strengths */}
      {result.strengths?.length > 0 && (
        <div className="card">
          <div className="font-semibold text-gray-800 text-sm mb-3">✅ Your Strengths</div>
          <div className="flex flex-wrap gap-2">
            {result.strengths.map((s, i) => (
              <span key={i} className="badge bg-green-50 text-green-700 border border-green-200">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions?.length > 0 && (
        <div className="card">
          <div className="font-semibold text-gray-800 text-sm mb-3">💡 Growth Tips</div>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-rose-400 mt-0.5">→</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SkillAnalyzerPage() {
  const { user } = useAuth();
  const [category, setCategory]     = useState('COOKING');
  const [imageUrl, setImageUrl]     = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [analyzing, setAnalyzing]   = useState(false);
  const [result, setResult]         = useState(null);
  const [history, setHistory]       = useState([]);

  useEffect(() => {
    skillAPI.getMine().then(r => setHistory(r.data)).catch(() => {});
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // For demo: create a local preview (in prod, upload to S3/Cloudinary first)
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    // Mock uploaded URL
    setImageUrl(`mock://uploaded/${file.name}`);
    toast.success('Image ready for analysis!');
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResult(null);
    try {
      // Simulate 2s "AI processing" delay for realism
      await new Promise(r => setTimeout(r, 2000));
      const res = await skillAPI.analyze({ category, imageUrl, additionalInfo: '' });
      setResult(res.data);
      setHistory(h => [res.data, ...h]);
      toast.success('Analysis complete!');
    } catch { toast.error('Analysis failed. Try again.'); }
    finally { setAnalyzing(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🤖</div>
        <h1 className="text-2xl font-display font-bold text-gray-900">AI Skill Analyzer</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
          Upload a photo or video of your work. Our AI will analyze your skill level
          and suggest the right price range for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-5">
          {/* Category select */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Select Your Skill</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(({ value, icon, label }) => (
                <button key={value} type="button"
                  onClick={() => { setCategory(value); setResult(null); }}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all ${
                    category === value
                      ? 'border-rose-400 bg-rose-50 text-rose-700 font-medium'
                      : 'border-gray-200 hover:border-rose-200 text-gray-600'
                  }`}>
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Upload Work Sample</label>
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                previewUrl ? 'border-rose-300 bg-rose-50' : 'border-gray-300 hover:border-rose-300'
              }`}>
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="w-full h-40 object-cover rounded-xl mx-auto" />
                ) : (
                  <>
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-sm text-gray-500">Click to upload photo of your work</div>
                    <div className="text-xs text-gray-400 mt-1">JPG, PNG, MP4 · max 10MB</div>
                  </>
                )}
              </div>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          {/* Analyze button */}
          <button onClick={handleAnalyze} disabled={analyzing}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base">
            {analyzing ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>AI is analyzing...</span>
              </>
            ) : '🔍 Analyze My Skill'}
          </button>

          {analyzing && (
            <div className="card bg-violet-50 text-center py-4">
              <div className="text-2xl mb-2 animate-bounce">🤖</div>
              <div className="text-sm font-medium text-violet-700">Analyzing your {category.toLowerCase()} skills...</div>
              <div className="text-xs text-violet-500 mt-1">Evaluating quality, technique, and market value</div>
            </div>
          )}
        </div>

        {/* Results panel */}
        <div>
          {result ? (
            <AnalysisResult result={result} />
          ) : (
            <div className="card text-center py-16 bg-gray-50 border-dashed">
              <div className="text-5xl mb-4">📊</div>
              <p className="text-gray-400 font-medium">Your analysis will appear here</p>
              <p className="text-xs text-gray-400 mt-1">Select a skill and click Analyze</p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display font-bold text-lg text-gray-800 mb-4">Previous Analyses</h2>
          <div className="space-y-3">
            {history.slice(0,5).map((h, i) => (
              <div key={i} className="card flex items-center gap-4">
                <div className="text-2xl">
                  {CATEGORIES.find(c => c.value === h.skillCategory)?.icon || '✨'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{h.skillCategory}</div>
                  <div className="text-xs text-gray-500">{h.skillLevel} · {h.overallScore} · {h.minPrice}–{h.maxPrice}/hr</div>
                </div>
                <span className={`badge ${LEVEL_COLORS[h.skillLevel]?.bg} ${LEVEL_COLORS[h.skillLevel]?.text}`}>
                  {h.skillLevel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
