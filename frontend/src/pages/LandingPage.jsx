import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { icon: '🍳', name: 'Cooking',  count: '1.2k+' },
  { icon: '🧵', name: 'Stitching', count: '890+' },
  { icon: '📚', name: 'Teaching',  count: '2.1k+' },
  { icon: '💄', name: 'Beauty',    count: '750+' },
  { icon: '🎨', name: 'Crafts',    count: '430+' },
  { icon: '🏠', name: 'Cleaning',  count: '680+' },
];

const FEATURES = [
  { icon: '🤖', title: 'AI Skill Analyzer', desc: 'Upload a photo of your work. Our AI gives you a skill rating, price suggestions, and growth tips instantly.' },
  { icon: '⚡', title: 'Instant Job Matching', desc: 'Get matched to nearby gigs in seconds. No waiting, no middlemen. Just opportunity.' },
  { icon: '🛡️', title: 'Safety First', desc: 'SOS emergency button, verified user badges, and a rating system keeps every interaction safe.' },
  { icon: '📍', title: 'Near You', desc: 'All gigs are location-based. Find work within walking distance or reach customers nearby.' },
  { icon: '🎤', title: 'Voice Input', desc: 'Speak to search for jobs or post gigs. No typing needed — perfect for hands-free use.' },
  { icon: '💸', title: 'Get Paid Fast', desc: 'Track earnings, completed jobs, and reviews all in one dashboard. Your hustle, your numbers.' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', city: 'Jaipur', text: 'I went from selling food at home to earning ₹15,000/month in 3 months using SheEarn. It changed my life.', skill: 'Cooking' },
  { name: 'Meena R.', city: 'Lucknow', text: 'The AI told me I was "Intermediate" in stitching and suggested ₹400/hr. I never knew my work had that value!', skill: 'Stitching' },
  { name: 'Anita K.', city: 'Pune', text: 'I tutor 8 students a week now. The platform made it so easy to find families nearby who needed help.', skill: 'Teaching' },
];

const STEPS = [
  { num: '01', title: 'Sign Up Free', desc: 'Create your profile as a woman provider or customer in 2 minutes.' },
  { num: '02', title: 'Analyze Your Skill', desc: 'Use our AI tool to get your skill level and suggested price range.' },
  { num: '03', title: 'Get Matched', desc: 'Browse or accept nearby gigs that match your skills.' },
  { num: '04', title: 'Earn & Grow', desc: 'Complete jobs, collect reviews, and watch your income grow.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-violet-50 pt-16 pb-20 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 rounded-full filter blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-100 rounded-full filter blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            1,000+ Women Earning on SheEarn Today
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 leading-tight mb-6 animate-slide-up">
            Turn Skills into Income –{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-600">
              Empowering Women Everywhere
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you cook, stitch, teach, or create — SheEarn connects you with customers nearby,
            analyzes your skills with AI, and helps you earn on your own terms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup" className="btn-primary text-base py-3 px-8 shadow-lg shadow-rose-200">
              Start Earning Free →
            </Link>
            <Link to="/gigs" className="btn-secondary text-base py-3 px-8">
              Browse Jobs
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[['10,000+','Women Registered'],['25,000+','Gigs Completed'],['₹2Cr+','Total Earned'],['4.8★','Avg Rating']].map(([val,lbl]) => (
              <div key={lbl}>
                <div className="text-2xl font-bold text-rose-600">{val}</div>
                <div className="text-xs text-gray-500 mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-display font-bold text-center text-gray-800 mb-2">Popular Skill Categories</h2>
          <p className="text-gray-500 text-center text-sm mb-10">Find or offer services in these high-demand areas</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map(({ icon, name, count }) => (
              <Link to={`/gigs?category=${name.toUpperCase()}`} key={name}
                className="group card text-center hover:border-rose-200 hover:shadow-md transition-all cursor-pointer">
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">{name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{count} gigs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-display font-bold text-center text-gray-800 mb-2">Everything You Need to Succeed</h2>
          <p className="text-gray-500 text-center text-sm mb-12">Powerful tools built specifically for women skill-workers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="card hover:shadow-md transition-all group">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-rose-600 transition-colors">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-display font-bold text-center text-gray-800 mb-12">How SheEarn Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="text-center">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 font-bold text-lg rounded-xl flex items-center justify-center mx-auto mb-3 font-display">{num}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-violet-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-display font-bold text-center text-gray-800 mb-10">Real Women, Real Income</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, city, text, skill }) => (
              <div key={name} className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{name}</div>
                    <div className="text-xs text-gray-400">{city} · {skill}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{text}"</p>
                <div className="flex mt-3">{'★★★★★'.split('').map((s,i) => <span key={i} className="text-amber-400">{s}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-violet-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to Turn Your Skill into Income?</h2>
          <p className="text-rose-100 mb-8">Join thousands of women already earning on SheEarn. It's free to sign up.</p>
          <Link to="/signup" className="bg-white text-rose-600 font-bold py-3 px-10 rounded-xl hover:bg-rose-50 transition-all inline-block shadow-lg">
            Start Your Journey →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
        <div className="font-display text-white font-bold text-lg mb-2">SheEarn</div>
        <p>© 2024 SheEarn. Empowering Women Everywhere.</p>
        <p className="mt-1 text-xs">Built with ❤️ for a hackathon demo</p>
      </footer>
    </div>
  );
}
