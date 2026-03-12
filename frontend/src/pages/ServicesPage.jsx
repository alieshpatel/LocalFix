import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import { getServices } from '../utils/api'

const CATEGORIES = ['all', 'plumbing', 'electrical', 'cleaning', 'carpentry', 'painting', 'ac']
const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
]

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'rating'
  const page = Number(searchParams.get('page')) || 1

  const [localQuery, setLocalQuery] = useState(query)

  useEffect(() => {
    setLoading(true)
    const params = { page, limit: 9, sort }
    if (query) params.q = query
    if (category !== 'all') params.category = category

    getServices(params)
      .then((res) => {
        setServices(res.data.services || res.data || [])
        setTotalPages(res.data.totalPages || 1)
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [query, category, sort, page])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    next.delete('page')
    setSearchParams(next)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setParam('q', localQuery)
  }

  const clearFilters = () => {
    setLocalQuery('')
    setSearchParams({})
  }

  const hasFilters = query || category !== 'all' || sort !== 'rating'

  return (
    <div className="pt-28 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <p className="text-ember-400 font-mono text-sm mb-2">Explore</p>
        <h1 className="section-title text-4xl mb-3">All Services</h1>
        <p className="text-muted font-body">Find the right professional for any job.</p>
      </div>

      {/* Search + Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search services…"
            className="input-field pl-11 h-12"
          />
          {localQuery && (
            <button type="button" onClick={() => { setLocalQuery(''); setParam('q', '') }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-cream">
              <X size={15} />
            </button>
          )}
        </form>

        <div className="flex gap-3">
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="input-field h-12 w-48 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`btn-ghost h-12 px-4 flex items-center gap-2 ${filtersOpen ? 'border-ember-500 text-ember-400' : ''}`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
            {hasFilters && <span className="w-2 h-2 rounded-full bg-ember-500" />}
          </button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setParam('category', cat)}
            className={`px-4 py-2 rounded-xl font-body font-medium text-sm transition-all capitalize ${
              category === cat
                ? 'bg-ember-500 text-white shadow-lg shadow-ember-500/30'
                : 'bg-ink-800 border border-ink-600 text-cream/60 hover:text-cream hover:border-ink-500'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl font-body font-medium text-sm text-red-400/70 hover:text-red-400
                       bg-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all flex items-center gap-1.5"
          >
            <X size={13} /> Clear All
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="card h-56 animate-pulse">
              <div className="h-4 bg-ink-700 rounded w-1/3 mb-4" />
              <div className="h-6 bg-ink-700 rounded w-2/3 mb-3" />
              <div className="h-4 bg-ink-700 rounded w-full mb-2" />
              <div className="h-4 bg-ink-700 rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : services.length > 0 ? (
        <>
          <p className="text-muted font-body text-sm mb-6">
            Showing {services.length} result{services.length !== 1 ? 's' : ''}
            {query ? ` for "${query}"` : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id || service.id} service={service} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-24">
          <p className="text-5xl mb-6">🔍</p>
          <h3 className="text-cream font-display font-bold text-2xl mb-3">No services found</h3>
          <p className="text-muted font-body mb-8">Try adjusting your filters or search term.</p>
          <button onClick={clearFilters} className="btn-primary">Browse All Services</button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-14">
          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1
            return (
              <button
                key={p}
                onClick={() => {
                  const next = new URLSearchParams(searchParams)
                  next.set('page', p)
                  setSearchParams(next)
                }}
                className={`w-10 h-10 rounded-xl font-mono text-sm transition-all ${
                  page === p
                    ? 'bg-ember-500 text-white shadow-lg shadow-ember-500/30'
                    : 'bg-ink-800 border border-ink-700 text-muted hover:text-cream hover:border-ink-500'
                }`}
              >
                {p}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
