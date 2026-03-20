import { useState, useEffect } from 'react';
import api from '../utils/api';

function ServiceRequestModal({ isOpen, onClose, onSuccess }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get('/services').then(res => setServices(res.data)).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selected = services.find(s => s._id === selectedService);
      await api.post('/bookings', {
        serviceId: selectedService,
        address,
        scheduledDate: new Date(date),
        price: selected ? selected.basePrice : 50
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Request a Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
            <select 
              required
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose a service --</option>
              {services.map(s => (
                <option key={s._id} value={s._id}>{s.name} - ${s.basePrice}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
            <input 
              required
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border-gray-300 rounded-md p-2 border focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 Main St, City, Zip"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
            <input 
              required
              type="datetime-local" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-gray-300 rounded-md p-2 border focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4 justify-end mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Confirm Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ServiceRequestModal;
