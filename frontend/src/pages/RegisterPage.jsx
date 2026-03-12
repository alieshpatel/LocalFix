import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wrench, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { register as registerApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await registerApi({ name: form.name, email: form.email, password: form.password })
      const { token, user } = res.data
      login(token, user)
      toast.success('Account created! Welcome to LocalFix 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6) s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return Math.min(s, 4)
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', 'bg-red-500', 'bg-amber-400', 'bg-jade-400', 'bg-jade-500']

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-900 border-r border-ink-700 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-jade-500/8 blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-ember-500/5 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#F5F0E8 1px, transparent 1px), linear-gradient(90deg, #F5F0E8 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-ember-500 flex items-center justify-center shadow-lg shadow-ember-500/30">
              <Wrench size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-bold text-cream">
              Local<span className="text-gradient">Fix</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-5xl font-black text-cream leading-tight mb-6">
            Join the<br /><span className="text-gradient-green">community.</span>
          </h2>
          <p className="text-cream/50 font-body text-lg leading-relaxed max-w-sm">
            Get access to 500+ verified service professionals in your area. Fast, reliable, and always nearby.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {['Free to join, no hidden fees', 'Instant booking confirmation', '100% satisfaction guarantee'].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-jade-500/20 border border-jade-500/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-jade-500" />
              </div>
              <span className="text-cream/60 font-body text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-ember-500 flex items-center justify-center">
              <Wrench size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold text-cream">Local<span className="text-gradient">Fix</span></span>
          </Link>

          <h1 className="font-display font-black text-3xl text-cream mb-2">Create Account</h1>
          <p className="text-muted font-body text-sm mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-ember-400 hover:underline font-medium">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-cream/60 font-body text-sm block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-cream/60 font-body text-sm block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-cream/60 font-body text-sm block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="input-field pl-11 pr-12"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-cream transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= strength ? strengthColor[strength] : 'bg-ink-700'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-muted">{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-cream/60 font-body text-sm block mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Repeat password"
                  className={`input-field pl-11 ${form.confirm && form.password !== form.confirm ? 'border-red-500/50' : ''}`}
                  required
                />
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="text-red-400 text-xs font-body mt-1.5">Passwords don't match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base font-semibold flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-muted text-xs font-body text-center mt-8">
            By registering you agree to our{' '}
            <a href="#" className="text-ember-400/70 hover:text-ember-400">Terms</a> and{' '}
            <a href="#" className="text-ember-400/70 hover:text-ember-400">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
