import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, DollarSign, CheckCircle } from 'lucide-react';
import api from '../utils/api';

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch a specific booking and its invoice
    // For now we'll fetch all my jobs and filter
    api.get('/bookings').then(res => {
      let b;
      if (res.data.myJobs) {
        b = res.data.myJobs.find(x => x._id === id);
      } else if (res.data.bookings) {
        b = res.data.bookings.find(x => x._id === id);
      }
      setBooking(b);
      setLoading(false);
    }).catch(console.error);
    
    // Mock get invoice check
    api.get('/invoices').then(res => {
        // If we implemented the endpoint exactly, we can attach invoice to UI
    }).catch(console.error);
  }, [id]);

  const updateStatus = async (status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBooking({ ...booking, status });
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handlePayment = async () => {
    alert("Payment successful! Redirecting to review...");
    // Update booking paymentStatus
    setBooking({ ...booking, paymentStatus: 'paid' });
  };

  if (loading) return <div className="p-8">Loading booking details...</div>;
  if (!booking) return <div className="p-8">Booking not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft size={16} className="mr-1"/> Back to Dashboard
      </button>

      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {booking.service?.name}
            </h1>
            <p className="text-gray-500 mt-1">Booking ID: {booking._id}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                  }`}>
            {booking.status}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                    <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">Location</h3>
                    <p className="text-gray-900 font-medium">{booking.address}</p>
                </div>
                <div>
                    <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">Schedule</h3>
                    <p className="text-gray-900 font-medium">{new Date(booking.scheduledDate).toLocaleString()}</p>
                </div>
                
                {booking.provider && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <User className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Service Provider</p>
                            <p className="font-semibold text-gray-900">{booking.provider.name}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign size={18} /> Transparent Invoice
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Base Service Fee</span>
                            <span className="font-medium">${booking.price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Taxes</span>
                            <span className="font-medium">${(booking.price * 0.1).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-extrabold text-blue-600">${(booking.price * 1.1).toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    {booking.status === 'accepted' && (
                        <button onClick={() => updateStatus('in-progress')} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
                            Mark In Progress
                        </button>
                    )}
                    {booking.status === 'in-progress' && (
                        <button onClick={() => updateStatus('completed')} className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition">
                            Mark Completed
                        </button>
                    )}
                    {booking.status === 'completed' && booking.paymentStatus !== 'paid' && (
                        <button onClick={handlePayment} className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2">
                             Pay Now
                        </button>
                    )}
                    {booking.paymentStatus === 'paid' && (
                        <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-3 text-center font-medium flex items-center justify-center gap-2">
                            <CheckCircle size={18} /> Invoice Paid
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;
