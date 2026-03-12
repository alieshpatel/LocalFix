import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Wrench, Menu, X, User, LogOut, LayoutDashboard, Shield, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setUserMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/services', label: 'Services' },
    ...(user ? [{ to: '/bookings', label: 'My Bookings' }, { to: '/dashboard', label: 'Dashboard' }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-xl shadow-ink-950/50 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-ember-500 flex items-center justify-center
                          group-hover:bg-ember-400 transition-colors shadow-lg shadow-ember-500/30">
            <Wrench size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold text-cream">
            Local<span className="text-gradient">Fix</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `nav-link px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-ember-400 bg-ember-500/10'
                    : 'hover:text-cream hover:bg-ink-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 bg-ink-800 hover:bg-ink-700 border border-ink-600
                           hover:border-ink-500 rounded-xl px-3 py-2 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-lg bg-ember-500/20 border border-ember-500/30 flex items-center justify-center">
                  <span className="text-ember-400 font-mono text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-cream/80 font-body text-sm font-medium max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-ink-800 border border-ink-600
                                rounded-xl shadow-2xl shadow-ink-950/50 overflow-hidden animate-slide-up">
                  <div className="px-4 py-3 border-b border-ink-700">
                    <p className="text-cream text-sm font-medium truncate">{user.name}</p>
                    <p className="text-muted text-xs truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                                 text-cream/70 hover:text-cream hover:bg-ink-700 transition-all text-sm">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link to="/bookings" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                                 text-cream/70 hover:text-cream hover:bg-ink-700 transition-all text-sm">
                      <BookOpen size={15} /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                                   text-amber-400/70 hover:text-amber-400 hover:bg-ink-700 transition-all text-sm">
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                                 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost py-2 px-4 text-sm">Sign In</Link>
              <Link to="/register" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-cream/70 hover:text-cream hover:bg-ink-800 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-4 shadow-2xl animate-slide-up">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl font-body font-medium text-sm transition-all ${
                    isActive ? 'text-ember-400 bg-ember-500/10' : 'text-cream/70 hover:text-cream hover:bg-ink-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-col gap-2 border-t border-ink-700 pt-4">
            {user ? (
              <button onClick={handleLogout} className="btn-ghost text-sm flex items-center justify-center gap-2">
                <LogOut size={15} /> Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost text-sm text-center">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(menuOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => { setMenuOpen(false); setUserMenuOpen(false) }}
        />
      )}
    </header>
  )
}
