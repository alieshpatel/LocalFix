import { useState, useEffect } from 'react'
import { Users, BookOpen, Wrench, TrendingUp, CheckCircle, Clock, X, AlertCircle } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import { getAdminStats, getAdminBookings, getAdminUsers, updateBookingStatus } from '../utils/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const TABS = ['Overview', 'Bookings', 'Users']

const STATUS_COLORS = {
  pending: 'tag-pending',
  confirmed: 'tag-active',
  completed: 'tag-completed',
  cancelled: 'tag-cancelled',
}

export default function AdminPage() {
  const [tab, setTab] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (tab === 'Overview') {
      getAdminStats()
        .then((res) => setStats(res.data))
        .catch(() => toast.error('Failed to load stats'))
        .finally(() => setLoading(false))
    } else if (tab === 'Bookings') {
      getAdminBookings({ limit: 20 })
        .then((res) => setBookings(res.data.bookings || res.data || []))
        .catch(() => setBookings([]))
        .finally(() => setLoading(false))
    } else if (tab === 'Users') {
      getAdminUsers({ limit: 20 })
        .then((res) => setUsers(res.data.users || res.data || []))
        .catch(() => setUsers([]))
        .finally(() => setLoading(false))
    }
  }, [tab])

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status)
      toast.success(`Booking ${status}`)
      setBookings((prev) => prev.map((b) =>
        (b._id || b.id) === id ? { ...b, status } : b
      ))
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="pt-28 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
          <AlertCircle size={24} className="text-amber-400" />
        </div>
        <div>
          <p className="text-amber-400 font-mono text-sm">Admin Access</p>
          <h1 className="section-title text-3xl">Admin Panel</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-10 bg-ink-900 border border-ink-700 rounded-2xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl font-body font-medium text-sm transition-all ${
              tab === t
                ? 'bg-ember-500 text-white shadow-lg shadow-ember-500/30'
                : 'text-cream/60 hover:text-cream'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-32 animate-pulse">
              <div className="h-4 bg-ink-700 rounded w-1/2 mb-3" />
              <div className="h-8 bg-ink-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : tab === 'Overview' && stats ? (
        <div className="space-y-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Users" value={stats.totalUsers ?? '—'} icon={Users} color="ember" />
            <StatsCard title="Total Bookings" value={stats.totalBookings ?? '—'} icon={BookOpen} color="jade" />
            <StatsCard title="Active Services" value={stats.totalServices ?? '—'} icon={Wrench} color="sky" />
            <StatsCard title="Revenue" value={stats.revenue ? `₹${Number(stats.revenue).toLocaleString()}` : '—'} icon={TrendingUp} color="amber" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Pending', value: stats.pendingBookings ?? 0, color: 'amber' },
              { label: 'Confirmed', value: stats.confirmedBookings ?? 0, color: 'jade' },
              { label: 'Completed', value: stats.completedBookings ?? 0, color: 'sky' },
              { label: 'Cancelled', value: stats.cancelledBookings ?? 0, color: 'ember' },
            ].map((s) => (
              <div key={s.label} className="card text-center">
                <p className="text-muted font-body text-xs mb-2 uppercase tracking-wider">{s.label}</p>
                <p className="text-cream font-display font-bold text-3xl">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

      ) : tab === 'Bookings' ? (
        <div className="card overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-ink-700 flex items-center justify-between">
            <h2 className="text-cream font-display font-bold text-lg">All Bookings</h2>
            <span className="text-muted font-mono text-sm">{bookings.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-700">
                  {['ID', 'Service', 'Customer', 'Date', 'Amount', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-mono text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800">
                {bookings.length > 0 ? bookings.map((b) => (
                  <tr key={b._id || b.id} className="hover:bg-ink-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted">
                      #{(b._id || b.id || '').slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-cream font-body text-sm">{b.service?.name || b.serviceName || '—'}</td>
                    <td className="px-6 py-4 text-cream/70 font-body text-sm">{b.user?.name || b.user?.email || '—'}</td>
                    <td className="px-6 py-4 text-muted font-body text-xs">
                      {b.scheduledDate ? format(new Date(b.scheduledDate), 'dd MMM yy') : '—'}
                    </td>
                    <td className="px-6 py-4 text-ember-400 font-mono text-sm font-bold">
                      {b.totalPrice ? `₹${Number(b.totalPrice).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={STATUS_COLORS[b.status] || 'tag-pending'}>{b.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(b._id || b.id, 'confirmed')}
                            className="p-1.5 rounded-lg bg-jade-500/10 text-jade-400 hover:bg-jade-500/20 transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate(b._id || b.id, 'cancelled')}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted font-body">No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      ) : tab === 'Users' ? (
        <div className="card overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-ink-700 flex items-center justify-between">
            <h2 className="text-cream font-display font-bold text-lg">All Users</h2>
            <span className="text-muted font-mono text-sm">{users.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-700">
                  {['Name', 'Email', 'Role', 'Joined', 'Bookings'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-mono text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800">
                {users.length > 0 ? users.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-ink-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-ember-500/20 border border-ember-500/30 flex items-center justify-center text-ember-400 font-mono text-xs font-bold">
                          {u.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-cream font-body text-sm">{u.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted font-body text-sm">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`tag ${u.role === 'admin' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-ink-700 text-muted border-ink-600'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted font-body text-xs">
                      {u.createdAt ? format(new Date(u.createdAt), 'dd MMM yyyy') : '—'}
                    </td>
                    <td className="px-6 py-4 text-cream font-mono text-sm">{u.bookingCount ?? '—'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted font-body">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}
