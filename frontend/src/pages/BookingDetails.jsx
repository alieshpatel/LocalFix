import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, DollarSign, CheckCircle, MapPin, Calendar, Activity, ShieldCheck, Star, Loader2 } from 'lucide-react';
import api from '../utils/api';

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCustomer, setIsCustomer] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBooking = async () => {
    try {
      // Fetch booking directly by ID
      const bookingRes = await api.get(`/bookings/${id}`);
      const b = bookingRes.data;
      setBooking(b);

      // Determine if current user is customer by checking their role
      const meRes = await api.get('/users/me');
      setIsCustomer(meRes.data.role === 'customer');
    } catch (err) {
      console.error('Failed to load booking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooking(); }, [id]);

  const updateStatus = async (status) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });
      setBooking(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayment = async () => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${id}/pay`);
      setBooking({ ...booking, paymentStatus: 'paid' });
    } catch (e) {
      console.error(e);
      alert('Payment failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const submitReview = async () => {
    if (reviewRating === 0) return alert('Please select a rating.');
    if (!booking?.provider?._id) return alert('No provider found for this booking.');
    setActionLoading(true);
    try {
      await api.post('/reviews', {
        bookingId: booking._id,
        toUserId: booking.provider._id,
        rating: reviewRating,
        comment: reviewComment
      });
      setHasReviewed(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setHasReviewed(true); // already reviewed
      } else {
        alert('Failed to submit review.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
    </div>
  );

  if (!booking) return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">📋</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
      <p className="text-gray-500 mb-6">This booking doesn't exist or you don't have permission to view it.</p>
      <button onClick={() => navigate(-1)} className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-600 font-semibold mb-8 group transition-colors gap-2"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      <div className="glass shadow-xl shadow-primary-500/5 border border-white/50 rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 p-8 text-white">
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNGMwIDItMiA0LTIgNHMtMi0yLTItNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <p className="text-white/70 text-sm font-mono mb-1">#{booking._id.slice(-8).toUpperCase()}</p>
              <h1 className="text-3xl font-extrabold">{booking.service?.name || 'Service Details'}</h1>
              <p className="text-white/80 mt-1">{booking.service?.category || 'Home Service'}</p>
            </div>
            <span className={`self-start px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${getStatusStyle(booking.status)}`}>
              {booking.status.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="bg-primary-50 p-3 rounded-xl shrink-0"><MapPin className="text-primary-600 w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{booking.address}</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="bg-purple-50 p-3 rounded-xl shrink-0"><Calendar className="text-purple-600 w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Scheduled</p>
                  <p className="font-semibold text-gray-900">{new Date(booking.scheduledDate).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* People */}
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900">
                <Activity className="w-5 h-5 text-gray-400" /> People Involved
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.provider && (
                  <button
                    onClick={() => navigate(`/provider-profile/${booking.provider._id}`)}
                    className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-100 flex items-center gap-4 hover:shadow-md transition text-left w-full"
                  >
                    <img
                      src={booking.provider.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.provider.name)}&background=6366f1&color=fff`}
                      alt={booking.provider.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Provider</p>
                      <p className="font-bold text-gray-900">{booking.provider.name}</p>
                      {booking.provider.reliabilityScore > 0 && (
                        <p className="text-xs text-yellow-600 flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 fill-current" /> {booking.provider.reliabilityScore.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </button>
                )}
                {!booking.provider && (
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <User className="text-amber-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Provider</p>
                      <p className="font-semibold text-gray-700">Awaiting Assignment</p>
                    </div>
                  </div>
                )}
                {booking.customer && (
                  <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-2xl border border-green-100 flex items-center gap-4">
                    <img
                      src={booking.customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.customer.name)}&background=22c55e&color=fff`}
                      alt={booking.customer.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-green-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-green-400 uppercase tracking-wider">Customer</p>
                      <p className="font-bold text-gray-900">{booking.customer.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Warranty Banner */}
            {booking.status === 'completed' && booking.warrantyEndsAt && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl shrink-0"><ShieldCheck className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Protected by Free Rework Warranty</h3>
                  <p className="text-blue-700 text-sm">
                    If issues arise, you are covered until <strong>{new Date(booking.warrantyEndsAt).toLocaleDateString()}</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Provider: Status Action Buttons */}
            {!isCustomer && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-400" /> Update Job Status
                </h3>
                <div className="flex flex-wrap gap-3">
                  {booking.status === 'accepted' && (
                    <button
                      onClick={() => updateStatus('in-progress')}
                      disabled={actionLoading}
                      className="flex-1 bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Start Job (In Progress)
                    </button>
                  )}
                  {booking.status === 'in-progress' && (
                    <button
                      onClick={() => updateStatus('completed')}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Mark as Completed ✓
                    </button>
                  )}
                  {(booking.status === 'completed' || booking.status === 'pending') && (
                    <p className="text-gray-500 text-sm font-medium py-3">
                      {booking.status === 'completed' ? 'This job is complete.' : 'Waiting to be accepted.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Customer: Review after payment */}
            {isCustomer && booking.paymentStatus === 'paid' && !hasReviewed && booking.provider && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" /> Rate Your Provider
                </h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                      <Star className={`w-9 h-9 transition-colors ${reviewRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share your experience (optional)..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 focus:ring-2 focus:ring-primary-500 outline-none resize-none text-sm"
                  rows="3"
                />
                <button
                  onClick={submitReview}
                  disabled={actionLoading || reviewRating === 0}
                  className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Submit Feedback
                </button>
              </div>
            )}
            {hasReviewed && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700 font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Thank you for your feedback!
              </div>
            )}
          </div>

          {/* Right: Invoice Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl sticky top-24">
              <h3 className="font-extrabold text-xl text-gray-900 mb-5 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-500" /> Invoice
              </h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-600">Base Fee</span>
                  <span className="font-semibold text-gray-900">${booking.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold text-gray-900">${(booking.price * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="font-bold text-gray-700 uppercase text-sm tracking-wider">Total Due</span>
                  <span className="text-3xl font-black text-gray-900">${(booking.price * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                {isCustomer && booking.status === 'completed' && booking.paymentStatus !== 'paid' && (
                  <button
                    onClick={handlePayment}
                    disabled={actionLoading}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <DollarSign className="w-5 h-5" />}
                    Pay Invoice Now
                  </button>
                )}
                {booking.paymentStatus === 'paid' && (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-center font-bold flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Payment Complete
                  </div>
                )}
                {booking.status === 'pending' && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-3 text-center text-sm font-medium">
                    Awaiting provider assignment
                  </div>
                )}
                {booking.status === 'accepted' && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-3 text-center text-sm font-medium">
                    Provider assigned — job starting soon
                  </div>
                )}
                {booking.status === 'in-progress' && (
                  <div className="bg-purple-50 border border-purple-200 text-purple-700 rounded-xl p-3 text-center text-sm font-medium">
                    Job is currently in progress
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;
