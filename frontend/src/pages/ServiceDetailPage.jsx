import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, Clock, MapPin, CheckCircle, ArrowLeft, User, Calendar } from 'lucide-react'
import { getServiceById, createBooking, getReviews } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({ scheduledDate: '', address: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getServiceById(id),
      getReviews(id).catch(() => ({ data: [] }))
    ])
      .then(([sRes, rRes]) => {
        setService(sRes.data.service || sRes.data)
        setReviews(rRes.data.reviews || rRes.data || [])
      })
      .catch(() => toast.error('Service not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!booking.scheduledDate || !booking.address) {
      toast.error('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    try {
      await createBooking({ serviceId: id, ...booking })
      toast.success('Booking confirmed! 🎉')
      navigate('/bookings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-28 min-h-screen max-w-7xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-ink-800 rounded w-1/4 mb-6" />
          <div className="h-12 bg-ink-800 rounded w-2/3 mb-4" />
          <div className="h-6 bg-ink-800 rounded w-full mb-3" />
          <div className="h-6 bg-ink-800 rounded w-5/6" />
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="text-cream font-display font-bold text-2xl mb-2">Service Not Found</h2>
          <Link to="/services" className="btn-primary mt-4 inline-block">Browse Services</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6">
      <Link to="/services" className="inline-flex items-center gap-2 text-muted hover:text-cream font-body text-sm mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Service Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-mono text-ember-400 uppercase tracking-wider">{service.category}</span>
                <h1 className="font-display font-black text-3xl text-cream mt-1">{service.name}</h1>
              </div>
              {service.price && (
                <div className="text-right">
                  <p className="text-muted text-xs font-body">Starting at</p>
                  <p className="text-ember-400 font-display font-bold text-3xl">₹{Number(service.price).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mb-5 pb-5 border-b border-ink-700">
              {service.rating !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Star size={15} className="text-amber-400 fill-amber-400" />
                  <span className="text-cream font-mono font-bold">{Number(service.rating).toFixed(1)}</span>
                  <span className="text-muted text-sm">({reviews.length} reviews)</span>
                </div>
              )}
              {service.duration && (
                <div className="flex items-center gap-1.5 text-muted text-sm">
                  <Clock size={14} className="text-ember-500/70" />
                  <span>{service.duration}</span>
                </div>
              )}
            </div>

            <p className="text-cream/70 font-body leading-relaxed">{service.description}</p>
          </div>

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div className="card">
              <h2 className="text-cream font-display font-bold text-xl mb-4">What's Included</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={16} className="text-jade-400 mt-0.5 flex-shrink-0" />
                    <span className="text-cream/70 font-body text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews */}
          <div className="card">
            <h2 className="text-cream font-display font-bold text-xl mb-6">Customer Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-5">
                {reviews.map((r, i) => (
                  <div key={i} className="pb-5 border-b border-ink-700 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-ink-700 border border-ink-600 flex items-center justify-center">
                          <User size={14} className="text-muted" />
                        </div>
                        <span className="text-cream font-body font-medium text-sm">{r.user?.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} size={12} className={s < r.rating ? 'text-amber-400 fill-amber-400' : 'text-ink-600'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-cream/60 font-body text-sm leading-relaxed">{r.comment}</p>
                    {r.createdAt && (
                      <p className="text-muted text-xs font-mono mt-2">
                        {format(new Date(r.createdAt), 'dd MMM yyyy')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-3xl mb-3">⭐</p>
                <p className="text-muted font-body text-sm">No reviews yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Booking Form */}
        <div className="lg:col-span-1">
          <div className="card-glow sticky top-28">
            <h2 className="text-cream font-display font-bold text-xl mb-6">Book This Service</h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="text-cream/60 font-body text-sm block mb-1.5">
                  Preferred Date & Time <span className="text-ember-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={booking.scheduledDate}
                  onChange={(e) => setBooking({ ...booking, scheduledDate: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="text-cream/60 font-body text-sm block mb-1.5">
                  Service Address <span className="text-ember-500">*</span>
                </label>
                <input
                  type="text"
                  value={booking.address}
                  onChange={(e) => setBooking({ ...booking, address: e.target.value })}
                  placeholder="Enter your full address"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="text-cream/60 font-body text-sm block mb-1.5">Additional Notes</label>
                <textarea
                  value={booking.notes}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  placeholder="Any specific requirements or details…"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {service.price && (
                <div className="bg-ink-800 rounded-xl p-4 border border-ink-700">
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-body text-sm">Service Fee</span>
                    <span className="text-cream font-mono font-bold">₹{Number(service.price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-ink-700">
                    <span className="text-cream font-body font-medium">Total</span>
                    <span className="text-ember-400 font-display font-bold text-xl">₹{Number(service.price).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-4 text-base font-semibold flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Booking…</>
                ) : (
                  <><Calendar size={17} /> {user ? 'Confirm Booking' : 'Sign In to Book'}</>
                )}
              </button>

              {!user && (
                <p className="text-center text-muted text-xs font-body">
                  <Link to="/login" className="text-ember-400 hover:underline">Sign in</Link> or{' '}
                  <Link to="/register" className="text-ember-400 hover:underline">create account</Link> to book
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
