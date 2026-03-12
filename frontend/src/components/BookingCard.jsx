import { Calendar, Clock, MapPin, ChevronRight, X } from 'lucide-react'
import { format } from 'date-fns'

const STATUS_MAP = {
  pending: { label: 'Pending', cls: 'tag-pending' },
  confirmed: { label: 'Confirmed', cls: 'tag-active' },
  completed: { label: 'Completed', cls: 'tag-completed' },
  cancelled: { label: 'Cancelled', cls: 'tag-cancelled' },
  active: { label: 'Active', cls: 'tag-active' },
}

export default function BookingCard({ booking, onCancel }) {
  const status = STATUS_MAP[booking.status] || { label: booking.status, cls: 'tag-pending' }

  const formatDate = (d) => {
    try { return format(new Date(d), 'dd MMM yyyy, hh:mm a') }
    catch { return d }
  }

  return (
    <div className="card-glow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={status.cls}>{status.label}</span>
          <h3 className="text-cream font-display font-bold text-lg mt-2">
            {booking.service?.name || booking.serviceName || 'Service'}
          </h3>
        </div>
        <span className="text-muted font-mono text-xs bg-ink-800 px-2 py-1 rounded-lg border border-ink-700">
          #{(booking._id || booking.id || '').slice(-6).toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-5">
        {booking.scheduledDate && (
          <div className="flex items-center gap-2 text-muted text-sm">
            <Calendar size={14} className="text-ember-500/70" />
            <span className="font-body">{formatDate(booking.scheduledDate)}</span>
          </div>
        )}
        {booking.address && (
          <div className="flex items-center gap-2 text-muted text-sm">
            <MapPin size={14} className="text-ember-500/70" />
            <span className="font-body line-clamp-1">{booking.address}</span>
          </div>
        )}
        {booking.service?.duration && (
          <div className="flex items-center gap-2 text-muted text-sm">
            <Clock size={14} className="text-ember-500/70" />
            <span className="font-body">{booking.service.duration}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-ink-700">
        <div>
          {booking.totalPrice && (
            <p className="text-ember-400 font-display font-bold text-xl">
              ₹{Number(booking.totalPrice).toLocaleString()}
            </p>
          )}
        </div>
        {booking.status === 'pending' && onCancel && (
          <button
            onClick={() => onCancel(booking._id || booking.id)}
            className="flex items-center gap-1.5 text-red-400/70 hover:text-red-400
                       hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-sm font-body transition-all"
          >
            <X size={14} /> Cancel
          </button>
        )}
      </div>
    </div>
  )
}
