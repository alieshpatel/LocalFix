import { Link } from 'react-router-dom'
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react'

const CATEGORY_COLORS = {
  plumbing: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
  electrical: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20',
  cleaning: 'from-jade-500/20 to-jade-600/10 border-jade-500/20',
  carpentry: 'from-amber-500/20 to-amber-600/10 border-amber-500/20',
  painting: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
  ac: 'from-sky-500/20 to-sky-600/10 border-sky-500/20',
  default: 'from-ember-500/20 to-ember-600/10 border-ember-500/20',
}

const CATEGORY_EMOJIS = {
  plumbing: '🔧',
  electrical: '⚡',
  cleaning: '🧹',
  carpentry: '🪚',
  painting: '🎨',
  ac: '❄️',
  default: '🛠️',
}

export default function ServiceCard({ service }) {
  const key = service.category?.toLowerCase() || 'default'
  const color = CATEGORY_COLORS[key] || CATEGORY_COLORS.default
  const emoji = CATEGORY_EMOJIS[key] || CATEGORY_EMOJIS.default

  return (
    <Link
      to={`/services/${service._id || service.id}`}
      className="card-glow group block animate-slide-up"
    >
      {/* Header gradient */}
      <div className={`h-2 rounded-t-xl -mt-6 -mx-6 mb-5 bg-gradient-to-r ${color}`} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} border flex items-center justify-center text-xl`}>
            {emoji}
          </div>
          <div>
            <span className="text-xs font-mono text-muted uppercase tracking-wider">{service.category}</span>
            <h3 className="text-cream font-display font-bold text-lg leading-tight">{service.name}</h3>
          </div>
        </div>
        <ChevronRight size={18} className="text-muted group-hover:text-ember-400 group-hover:translate-x-1 transition-all mt-1" />
      </div>

      <p className="text-muted text-sm font-body leading-relaxed mb-5 line-clamp-2">
        {service.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-ink-700">
        <div className="flex items-center gap-3">
          {service.rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-cream text-sm font-mono font-bold">{Number(service.rating).toFixed(1)}</span>
              {service.reviewCount && (
                <span className="text-muted text-xs">({service.reviewCount})</span>
              )}
            </div>
          )}
          {service.duration && (
            <div className="flex items-center gap-1 text-muted">
              <Clock size={12} />
              <span className="text-xs font-body">{service.duration}</span>
            </div>
          )}
        </div>

        <div className="text-right">
          {service.price && (
            <>
              <span className="text-xs text-muted font-body">Starting at</span>
              <p className="text-ember-400 font-display font-bold text-lg leading-tight">
                ₹{Number(service.price).toLocaleString()}
              </p>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
