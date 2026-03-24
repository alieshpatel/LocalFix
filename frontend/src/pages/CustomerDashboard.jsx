import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ServiceRequestModal from '../components/ServiceRequestModal';
import { PlusCircle, Calendar, MapPin, ChevronRight, Activity } from 'lucide-react';

function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const loadBookings = () => {
    api.get('/bookings')
      .then(res => setBookings(res.data.bookings || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="py-8 max-w-6xl mx-auto animate-fade-in relative z-10 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary-600" /> Customer Hub
          </h1>
          <p className="text-lg text-gray-500 mt-2">Manage your service requests and bookings.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Request Service
        </button>
      </div>
      
      <ServiceRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadBookings} 
      />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Active Bookings
          <span className="bg-primary-100 text-primary-800 text-sm py-1 px-3 rounded-full">{bookings.length}</span>
        </h2>
        
        {bookings.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center border border-white/50 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
            <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <PlusCircle className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">No Active Bookings</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6 relative z-10">You haven't requested any services yet. Create your first request to get started.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-primary-600 font-bold hover:text-primary-800 underline transition-colors relative z-10">Request a service now</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map(b => (
              <div key={b._id} className="glass p-6 rounded-2xl shadow-sm border border-white/60 flex flex-col sm:flex-row justify-between sm:items-center gap-6 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex-1">
                  <h3 className="font-extrabold text-xl text-gray-900 mb-2">{b.service?.name || 'Home Service'}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-500" /> {new Date(b.scheduledDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary-500" /> {b.address}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border shadow-sm ${getStatusColor(b.status)}`}>
                    {b.status}
                  </span>
                  <Link 
                    to={`/booking/${b._id}`} 
                    className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-primary-600 bg-gray-50 hover:bg-primary-50 px-4 py-2 rounded-xl transition-colors border border-gray-100"
                  >
                    Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
