import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Clock, Star, ArrowRight, Plus } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import BookingCard from '../components/BookingCard'
import { getBookings } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBookings({ limit: 5 })
      .then((res) => setBookings(res.data.bookings || res.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: bookings.length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="pt-28 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6">
      {/* Welcome */}
      <div className="mb-10">
        <p className="text-ember-400 font-mono text-sm mb-1">{greeting} 👋</p>
        <h1 className="section-title text-4xl">{user?.name || user?.email || 'Welcome back'}</h1>
        <p className="text-muted font-body mt-2">Here's a summary of your activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatsCard title="Total Bookings" value={stats.total} icon={BookOpen} color="ember" />
        <StatsCard title="Completed" value={stats.completed} icon={CheckCircle} color="jade" />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} color="amber" />
        <StatsCard title="Avg. Rating" value="4.9" icon={Star} color="sky" subtitle="Based on reviews" />
      </div>

      {/* Recent Bookings */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-cream font-display font-bold text-2xl">Recent Bookings</h2>
          <Link to="/bookings" className="flex items-center gap-1.5 text-muted hover:text-ember-400 font-body text-sm transition-colors">
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card h-44 animate-pulse">
                <div className="h-4 bg-ink-700 rounded w-1/4 mb-4" />
                <div className="h-6 bg-ink-700 rounded w-1/2 mb-3" />
                <div className="h-4 bg-ink-700 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.slice(0, 4).map((b) => (
              <BookingCard key={b._id || b.id} booking={b} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-14">
            <p className="text-4xl mb-4">📋</p>
            <h3 className="text-cream font-display font-bold text-xl mb-2">No bookings yet</h3>
            <p className="text-muted font-body text-sm mb-6">Your booking history will appear here.</p>
            <Link to="/services" className="btn-primary inline-flex items-center gap-2 text-sm">
              <Plus size={15} /> Book Your First Service
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-cream font-display font-bold text-xl mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/services', label: 'Browse Services', emoji: '🔍' },
            { to: '/bookings', label: 'My Bookings', emoji: '📋' },
            { to: '/services?category=plumbing', label: 'Book Plumber', emoji: '🔧' },
            { to: '/services?category=cleaning', label: 'Book Cleaner', emoji: '🧹' },
          ].map((a) => (
            <Link key={a.to} to={a.to}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-ink-800 border border-ink-700
                         hover:border-ember-500/40 hover:bg-ink-700 transition-all text-center group">
              <span className="text-2xl group-hover:scale-110 transition-transform">{a.emoji}</span>
              <span className="text-cream/70 group-hover:text-cream font-body text-xs font-medium">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
