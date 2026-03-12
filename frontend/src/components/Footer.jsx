import { Link } from 'react-router-dom'
import { Wrench, Github, Twitter, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-900/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-ember-500 flex items-center justify-center shadow-lg shadow-ember-500/30">
                <Wrench size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-bold text-cream">
                Local<span className="text-gradient">Fix</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed font-body">
              Connecting you with trusted local service professionals. Fast, reliable, and always nearby.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-cream font-body font-semibold text-sm mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              {[['/', 'Home'], ['/services', 'Browse Services'], ['/bookings', 'My Bookings'], ['/dashboard', 'Dashboard']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-muted hover:text-cream text-sm font-body transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-cream font-body font-semibold text-sm mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair'].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-muted hover:text-cream text-sm font-body transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-cream font-body font-semibold text-sm mb-4 uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3 mb-6">
              {[
                { icon: Github, href: 'https://github.com/alieshpatel/LocalFix' },
                { icon: Twitter, href: '#' },
                { icon: Mail, href: 'mailto:hello@localfix.com' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer"
                   className="w-9 h-9 rounded-xl bg-ink-800 border border-ink-600 flex items-center justify-center
                              text-muted hover:text-ember-400 hover:border-ember-500/50 transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <div className="bg-ink-800 rounded-xl p-4 border border-ink-700">
              <p className="text-xs text-muted font-body mb-2">API Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-jade-500 animate-pulse" />
                <span className="text-jade-400 text-xs font-mono">Operational</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm font-body">
            © {new Date().getFullYear()} LocalFix. All rights reserved.
          </p>
          <p className="text-muted text-sm font-body flex items-center gap-1.5">
            Built with <Heart size={13} className="text-ember-500 fill-ember-500" /> for local communities
          </p>
        </div>
      </div>
    </footer>
  )
}
