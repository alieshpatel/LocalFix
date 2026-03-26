import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ServiceRequestModal from '../components/ServiceRequestModal';
import { PlusCircle, Calendar, MapPin, ChevronRight, Activity, CheckCircle, Clock, Loader2, FileText, Star } from 'lucide-react';

function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock, label: 'Pending' };
      case 'accepted': return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle, label: 'Accepted' };
      case 'in-progress': return { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Activity, label: 'In Progress' };
      case 'completed': return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Completed' };
      default: return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock, label: status };
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    active: bookings.filter(b => b.status === 'accepted' || b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="py-8 max-w-6xl mx-auto animate-fade-in px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Track and manage all your service requests.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 self-start"
        >
          <PlusCircle className="w-5 h-5" /> Request Service
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: stats.total, color: 'text-gray-900', bg: 'bg-white' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Active', value: stats.active, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Completed', value: stats.completed, color: 'text-green-700', bg: 'bg-green-50' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 border border-gray-100 shadow-sm`}>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { setIsModalOpen(false); loadBookings(); }}
      />

      {/* Bookings */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" /> All Bookings
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center border border-white/50 shadow-sm">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 mb-6">Request your first service to get started.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition shadow-md"
            >
              Request Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const statusCfg = getStatusConfig(b.status);
              const StatusIcon = statusCfg.icon;
              return (
                <div
                  key={b._id}
                  className="glass p-6 rounded-2xl shadow-sm border border-white/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-extrabold text-lg text-gray-900">{b.service?.name || 'Home Service'}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${statusCfg.color}`}>
                          <StatusIcon className="w-3 h-3" /> {statusCfg.label}
                        </span>
                        {b.paymentStatus === 'paid' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                            <Star className="w-3 h-3" /> Paid
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-primary-400" />
                          {new Date(b.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-primary-400" /> {b.address}
                        </span>
                        {b.provider && (
                          <span className="flex items-center gap-1.5 text-primary-600 font-semibold">
                            Provider: {b.provider.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-lg font-black text-gray-900">${(b.price * 1.1).toFixed(2)}</span>
                      <Link
                        to={`/booking/${b._id}`}
                        className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-primary-600 bg-gray-50 hover:bg-primary-50 px-4 py-2 rounded-xl transition-colors border border-gray-100"
                      >
                        Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
