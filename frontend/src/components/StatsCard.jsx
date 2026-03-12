import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'ember' }) {
  const colorMap = {
    ember: 'text-ember-400 bg-ember-500/15 border-ember-500/20',
    jade: 'text-jade-400 bg-jade-500/15 border-jade-500/20',
    sky: 'text-sky-400 bg-sky-500/15 border-sky-500/20',
    amber: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/15 border-purple-500/20',
  }
  const cls = colorMap[color] || colorMap.ember

  return (
    <div className="card group hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${cls}`}>
          {Icon && <Icon size={20} />}
        </div>
        {trendValue !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full ${
            trend === 'up'
              ? 'bg-jade-500/15 text-jade-400'
              : 'bg-red-500/15 text-red-400'
          }`}>
            {trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-muted text-sm font-body mb-1">{title}</p>
      <p className="text-cream font-display font-bold text-3xl">{value}</p>
      {subtitle && <p className="text-muted text-xs font-body mt-1">{subtitle}</p>}
    </div>
  )
}
