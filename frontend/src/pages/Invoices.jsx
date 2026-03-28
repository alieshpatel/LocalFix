import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FileText, CheckCircle, Clock, Loader2, ExternalLink, TrendingUp } from 'lucide-react';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, meRes] = await Promise.all([
          api.get('/invoices'),
          api.get('/users/me')
        ]);
        setInvoices(invoiceRes.data);
        setRole(meRes.data.role);
      } catch (err) {
        console.error('Failed to load invoices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isProvider = role === 'provider';

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    totalAmount: invoices.reduce((sum, i) => sum + (i.amount || 0), 0),
    earnings: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0),
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary-600" />
          {isProvider ? 'Payment Receipts' : 'My Invoices'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isProvider
            ? 'Payments your customers have made for completed jobs.'
            : 'Track all your billing history in one place.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {isProvider ? (
          <>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm col-span-2 md:col-span-1">
              <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Total Receipts</p>
              <p className="text-3xl font-black text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 shadow-sm col-span-2 md:col-span-3">
              <p className="text-xs font-bold uppercase text-green-500 tracking-wider mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Total Earnings Received
              </p>
              <p className="text-3xl font-black text-green-700">${stats.earnings.toFixed(2)}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Total</p>
              <p className="text-3xl font-black text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 shadow-sm">
              <p className="text-xs font-bold uppercase text-green-500 tracking-wider mb-1">Paid</p>
              <p className="text-3xl font-black text-green-700">{stats.paid}</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 shadow-sm">
              <p className="text-xs font-bold uppercase text-amber-500 tracking-wider mb-1">Pending</p>
              <p className="text-3xl font-black text-amber-700">{stats.pending}</p>
            </div>
            <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100 shadow-sm">
              <p className="text-xs font-bold uppercase text-primary-500 tracking-wider mb-1">Total Spent</p>
              <p className="text-3xl font-black text-primary-700">${stats.totalAmount.toFixed(0)}</p>
            </div>
          </>
        )}
      </div>

      {/* Invoice List */}
      {invoices.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/50 shadow-sm">
          <div className="text-6xl mb-4">{isProvider ? '💰' : '🧾'}</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {isProvider ? 'No Payments Yet' : 'No Invoices Yet'}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {isProvider
              ? 'Payments from customers will appear here once invoices are paid.'
              : 'Invoices are generated automatically when a job is marked complete.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map(invoice => (
            <div
              key={invoice._id}
              className="glass rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  {/* ID + Status */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                      #{invoice._id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                      {invoice.status === 'paid'
                        ? <><CheckCircle className="w-3 h-3" /> Paid</>
                        : <><Clock className="w-3 h-3" /> Pending</>}
                    </span>
                  </div>

                  {/* People */}
                  <div className="text-sm text-gray-500 font-medium space-y-1">
                    {isProvider ? (
                      invoice.customer && (
                        <p className="flex items-center gap-2">
                          <span className="text-gray-400">Paid by:</span>
                          <img
                            src={invoice.customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(invoice.customer.name)}&size=24&background=6366f1&color=fff`}
                            className="w-5 h-5 rounded-full"
                            alt=""
                          />
                          <span className="font-semibold text-gray-800">{invoice.customer.name}</span>
                        </p>
                      )
                    ) : (
                      invoice.provider && (
                        <p className="flex items-center gap-2">
                          <span className="text-gray-400">Provider:</span>
                          <img
                            src={invoice.provider.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(invoice.provider.name)}&size=24&background=22c55e&color=fff`}
                            className="w-5 h-5 rounded-full"
                            alt=""
                          />
                          <span className="font-semibold text-gray-800">{invoice.provider.name}</span>
                        </p>
                      )
                    )}
                    {invoice.booking?.scheduledDate && (
                      <p>Service date: <span className="text-gray-700">{new Date(invoice.booking.scheduledDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                    )}
                    {invoice.booking?.address && (
                      <p>Location: <span className="text-gray-700">{invoice.booking.address}</span></p>
                    )}
                    <p>Invoice issued: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                    {invoice.paidAt && (
                      <p className="text-green-600 font-semibold">✓ Paid on {new Date(invoice.paidAt).toLocaleDateString()}</p>
                    )}
                  </div>

                  {/* Breakdown */}
                  {invoice.breakdown?.length > 0 && (
                    <div className="mt-3 bg-gray-50 rounded-xl p-3 space-y-1">
                      {invoice.breakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-500">{item.description}</span>
                          <span className="font-semibold text-gray-900">${item.cost?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amount + View Link */}
                <div className="flex flex-col items-end gap-3 self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                      {isProvider ? 'Received' : 'Amount'}
                    </p>
                    <p className="text-2xl font-black text-gray-900">${invoice.amount?.toFixed(2)}</p>
                  </div>
                  {(invoice.booking?._id || invoice.booking) && (
                    <Link
                      to={`/booking/${invoice.booking?._id || invoice.booking}`}
                      className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-800 transition bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100"
                    >
                      View Job <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Invoices;
