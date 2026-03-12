import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Plus } from 'lucide-react'
import BookingCard from '../components/BookingCard'
import { getBookings, cancelBooking } from '../utils/api'
import toast from 'react-hot-toast'

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchBookings = () => {
    setLoading(true)
    const params = filter !== 'all' ? { status: filter } : {}
    getBookings(params)
      .then((res) => setBookings(res.data.bookings || res.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [filter])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await cancelBooking(id)
      toast.success('Booking cancelled')
      fetchBookings()
    } catch {
      toast.error('Failed to cancel booking')
    }
  }

  return (
    <div className="pt-28 pb-20 min-h-screen max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-ember-400 font-mono text-sm mb-2">Your Account</p>
          <h1 className="section-title">My Bookings</h1>
        </div>
        <Link to="/services" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> New Booking
        </Link>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-body font-medium text-sm capitalize transition-all ${
              filter === f
                ? 'bg-ember-500 text-white shadow-lg shadow-ember-500/30'
                : 'bg-ink-800 border border-ink-600 text-cream/60 hover:text-cream hover:border-ink-500'
            }`}
          >
            {f === 'all' ? 'All Bookings' : f}
          </button>
        ))}
      </div>

      {/* Content */}
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
          {bookings.map((b) => (
            <BookingCard
              key={b._id || b.id}
              booking={b}
              onCancel={handleCancel}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} className="text-muted" />
          </div>
          <h3 className="text-cream font-display font-bold text-2xl mb-3">
            {filter === 'all' ? 'No Bookings Yet' : `No ${filter} bookings`}
          </h3>
          <p className="text-muted font-body mb-8">
            {filter === 'all' ? "You haven't booked any services yet." : `You have no ${filter} bookings.`}
          </p>
          <Link to="/services" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Book a Service
          </Link>
        </div>
      )}
    </div>
  )
}
