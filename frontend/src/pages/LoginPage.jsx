import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wrench, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { login as loginApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginApi(form)
      const { token, user } = res.data
      login(token, user)
      toast.success(`Welcome back, ${user.name || user.email}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-900 border-r border-ink-700 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-ember-500/8 blur-3xl" />
          <div className="absolute bottom-1/4 -right-10 w-80 h-80 rounded-full bg-jade-500/5 blur-3xl" />
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
            Good to have<br />you back.
          </h2>
          <p className="text-cream/50 font-body text-lg leading-relaxed max-w-sm">
            Sign in to manage your bookings, track service requests, and connect with local professionals.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          {[['12K+', 'Services Done'], ['500+', 'Professionals'], ['4.9★', 'Avg Rating']].map(([v, l]) => (
            <div key={l}>
              <p className="text-cream font-display font-bold text-2xl">{v}</p>
              <p className="text-muted font-body text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-ember-500 flex items-center justify-center">
              <Wrench size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold text-cream">Local<span className="text-gradient">Fix</span></span>
          </Link>

          <h1 className="font-display font-black text-3xl text-cream mb-2">Sign In</h1>
          <p className="text-muted font-body text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-ember-400 hover:underline font-medium">Create one</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Your password"
                  className="input-field pl-11 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-cream transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base font-semibold flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-muted text-xs font-body text-center mt-8">
            By signing in you agree to our{' '}
            <a href="#" className="text-ember-400/70 hover:text-ember-400">Terms</a> and{' '}
            <a href="#" className="text-ember-400/70 hover:text-ember-400">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
