import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Star, ArrowRight, Zap, Shield, Clock, CheckCircle } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import { getServices } from '../utils/api'

const CATEGORIES = [
  { name: 'Plumbing', emoji: '🔧', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20', key: 'plumbing' },
  { name: 'Electrical', emoji: '⚡', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20', key: 'electrical' },
  { name: 'Cleaning', emoji: '🧹', color: 'from-jade-500/20 to-jade-600/10 border-jade-500/20', key: 'cleaning' },
  { name: 'Carpentry', emoji: '🪚', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/20', key: 'carpentry' },
  { name: 'Painting', emoji: '🎨', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20', key: 'painting' },
  { name: 'AC Repair', emoji: '❄️', color: 'from-sky-500/20 to-sky-600/10 border-sky-500/20', key: 'ac' },
]

const FEATURES = [
  { icon: Zap, title: 'Instant Booking', desc: 'Book any service in under 2 minutes with live availability.', color: 'amber' },
  { icon: Shield, title: 'Verified Pros', desc: 'Every provider is background-checked and licensed.', color: 'jade' },
  { icon: Clock, title: 'On-Time Guarantee', desc: 'We promise punctuality or your next booking is free.', color: 'sky' },
  { icon: CheckCircle, title: 'Quality Assured', desc: '100% satisfaction guaranteed or full refund.', color: 'ember' },
]

// Floating orbs background
function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-ember-500/8 blur-3xl animate-float" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-jade-500/6 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-0 left-1/2 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#F5F0E8 1px, transparent 1px), linear-gradient(90deg, #F5F0E8 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </div>
  )
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [featured, setFeatured] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getServices({ limit: 6, sort: 'rating' })
      .then((res) => setFeatured(res.data.services || res.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoadingFeatured(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/services?q=${encodeURIComponent(query.trim())}`)
    else navigate('/services')
  }

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20">
        <BackgroundOrbs />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-ember-500/10 border border-ember-500/20
                            rounded-full px-4 py-2 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-ember-500 animate-pulse" />
              <span className="text-ember-400 font-mono text-xs font-medium tracking-wide">
                500+ Verified Professionals Ready
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-cream leading-[1.05] mb-6 animate-slide-up">
              Fix Anything,{' '}
              <span className="text-gradient">Anywhere</span>
              <br />
              <span className="text-cream/60">Near You.</span>
            </h1>

            <p className="text-cream/50 font-body text-lg sm:text-xl leading-relaxed mb-10 max-w-xl animate-slide-up animate-delay-100">
              Book trusted local professionals for home repairs, maintenance, and services — in minutes.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-8 animate-slide-up animate-delay-200">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you need fixed?"
                  className="input-field pl-11 h-14 text-base"
                />
              </div>
              <button type="submit" className="btn-primary h-14 px-8 text-base font-semibold whitespace-nowrap">
                Search
              </button>
            </form>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 animate-slide-up animate-delay-300">
              <span className="text-muted text-sm font-body mr-1">Popular:</span>
              {['Plumbing', 'AC Repair', 'Cleaning', 'Electrical'].map((s) => (
                <button
                  key={s}
                  onClick={() => navigate(`/services?q=${s}`)}
                  className="text-cream/60 hover:text-ember-400 text-sm font-body px-3 py-1 rounded-full
                             border border-ink-600 hover:border-ember-500/50 bg-ink-800/50 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Floating Stats */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 pr-4">
            {[
              { label: 'Services Done', value: '12,400+' },
              { label: 'Happy Clients', value: '8,900+' },
              { label: 'Avg. Rating', value: '4.9 ★' },
            ].map((stat, i) => (
              <div key={stat.label}
                className="glass rounded-2xl px-5 py-4 text-right animate-slide-up"
                style={{ animationDelay: `${400 + i * 100}ms` }}>
                <p className="text-cream font-display font-bold text-2xl">{stat.value}</p>
                <p className="text-muted text-xs font-body">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-ember-400 font-mono text-sm mb-2">Browse by Type</p>
            <h2 className="section-title">Service Categories</h2>
          </div>
          <Link to="/services" className="hidden sm:flex items-center gap-1.5 text-muted hover:text-ember-400 font-body text-sm transition-colors">
            View all <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.key}
              to={`/services?category=${cat.key}`}
              className={`group card bg-gradient-to-br ${cat.color} flex flex-col items-center justify-center 
                          gap-3 py-6 text-center hover:scale-105 transition-all duration-200 animate-slide-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
              <span className="text-cream/80 font-body font-medium text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED SERVICES ── */}
      <section className="py-20 bg-ink-900/30 border-y border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-ember-400 font-mono text-sm mb-2">Top Rated</p>
              <h2 className="section-title">Featured Services</h2>
            </div>
            <Link to="/services" className="hidden sm:flex items-center gap-1.5 text-muted hover:text-ember-400 font-body text-sm transition-colors">
              All services <ArrowRight size={15} />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-56 animate-pulse">
                  <div className="h-4 bg-ink-700 rounded w-1/3 mb-4" />
                  <div className="h-6 bg-ink-700 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-ink-700 rounded w-full mb-2" />
                  <div className="h-4 bg-ink-700 rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((service) => (
                <ServiceCard key={service._id || service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🛠️</p>
              <p className="text-muted font-body">No services available yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/services" className="btn-ghost inline-flex items-center gap-2 text-base">
              Explore All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY LOCALFIX ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-ember-400 font-mono text-sm mb-2">Why Choose Us</p>
          <h2 className="section-title">Built for Reliability</h2>
          <p className="text-muted font-body mt-3 max-w-lg mx-auto">
            We obsess over every detail to make sure your service experience is seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => {
            const colorMap = {
              amber: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
              jade: 'text-jade-400 bg-jade-500/15 border-jade-500/20',
              sky: 'text-sky-400 bg-sky-500/15 border-sky-500/20',
              ember: 'text-ember-400 bg-ember-500/15 border-ember-500/20',
            }
            return (
              <div key={f.title} className="card-glow text-center animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`w-12 h-12 rounded-2xl border mx-auto mb-5 flex items-center justify-center ${colorMap[f.color]}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="text-cream font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted font-body text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 mx-4 sm:mx-6 mb-10">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-ember-500/20 via-ember-600/10 to-ink-800
                        border border-ember-500/30 p-12 text-center relative overflow-hidden glow-ember">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #F5F0E8 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10">
            <h2 className="font-display text-4xl sm:text-5xl font-black text-cream mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-cream/60 font-body text-lg mb-10 max-w-lg mx-auto">
              Join thousands of happy customers who trust LocalFix for their home service needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services" className="btn-primary text-base px-10 py-4">
                Browse Services
              </Link>
              <Link to="/register" className="btn-ghost text-base px-10 py-4">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
