import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ServiceRequestModal from '../components/ServiceRequestModal';

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

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Customer Dashboard</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
        >
          + Request New Service
        </button>
      </div>
      
      <ServiceRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadBookings} 
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">My Bookings</h2>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <p className="text-gray-500 mb-4">No active bookings found.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-medium hover:underline">Create your first request</button>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map(b => (
              <div key={b._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{b.service?.name || 'Unknown Service'}</h3>
                  <p className="text-sm text-gray-600 mt-1">📅 {new Date(b.scheduledDate).toLocaleDateString()} &nbsp;•&nbsp; 📍 {b.address}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm ${
                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    b.status === 'accepted' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    b.status === 'in-progress' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                    b.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100'
                  }`}>
                    {b.status}
                  </span>
                  <Link to={`/booking/${b._id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-1.5 rounded-lg transition">View Details</Link>
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
