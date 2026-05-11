import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Star, MapPin, Loader2, Search, CheckCircle } from 'lucide-react';

function StarRating({ score, total }) {
  const filled = Math.round(score);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i <= filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'
            }`}
          />
        ))}
      </div>
      {total > 0 ? (
        <span className="text-sm font-bold text-gray-700">
          {score.toFixed(1)}
          <span className="text-gray-400 font-normal ml-1">({total})</span>
        </span>
      ) : (
        <span className="text-xs text-gray-400">No reviews yet</span>
      )}
    </div>
  );
}

const ALL_SKILLS = ['Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Carpentry', 'Pest Control', 'Painting', 'Appliances'];

function Services() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.get('/users/providers')
      .then(res => setProviders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filters = ['All', 'Online', ...ALL_SKILLS];

  const filtered = providers.filter(p => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Online' && p.isAvailable) ||
      p.skills?.some(s => s.toLowerCase().includes(activeFilter.toLowerCase()));
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      p.bio?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-10 animate-fade-in">
      {/* Blobs */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
      <div className="fixed top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

      {/* Hero */}
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-5xl font-extrabold tracking-tight mb-3 text-gray-900">
          Find a <span className="text-gradient">Professional</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Browse verified local experts by their skills. See who's online and ready to help right now.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="relative z-10 mb-8 space-y-4">
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, skill, or expertise..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm font-medium transition"
          />
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${
                activeFilter === f
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
              } ${f === 'Online' ? (activeFilter !== 'Online' ? 'border-green-200 text-green-700 hover:border-green-400' : 'bg-green-600 border-green-600') : ''}`}
            >
              {f === 'Online' && <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1.5 mb-0.5"></span>}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No providers found</h3>
          <p className="text-gray-400">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div
              key={p._id}
              className="glass rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Top: avatar + name + online badge */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=6366f1&color=fff&size=80`}
                    alt={p.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow"
                  />
                  {p.isAvailable && (
                    <span className="absolute bottom-0 right-0 block w-4 h-4 bg-green-500 border-2 border-white rounded-full" title="Online" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-gray-900 truncate">{p.name}</h3>
                    {p.reliabilityScore >= 4 && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" title="Top Rated" />
                    )}
                  </div>
                  <StarRating score={p.reliabilityScore || 0} total={p.totalReviews || 0} />
                  <span className={`inline-flex items-center gap-1 text-xs font-bold mt-1 px-2 py-0.5 rounded-full border ${
                    p.isAvailable
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {p.isAvailable ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {p.bio && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{p.bio}</p>
              )}

              {/* Skills */}
              {p.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full border border-primary-100">
                      {skill}
                    </span>
                  ))}
                  {p.skills.length > 4 && (
                    <span className="text-xs text-gray-400 font-medium px-2 py-1">+{p.skills.length - 4} more</span>
                  )}
                </div>
              )}

              {/* Stats row */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Local Pro
                </span>
                {p.experienceYears > 0 && (
                  <span>{p.experienceYears} yr{p.experienceYears !== 1 ? 's' : ''} exp</span>
                )}
                {p.hourlyRate > 0 && (
                  <span className="ml-auto font-bold text-gray-700">${p.hourlyRate}/hr</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;
