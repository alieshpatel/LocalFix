import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';
import api from '../utils/api';

function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // We will stub this with an API call later. For now, static list or mock fetch.
    api.get('/services').then(res => setServices(res.data)).catch(() => {
      // Create some default services if API doesn't have any
      setServices([
        { _id: '1', name: 'Plumbing Repair', description: 'Fix leaks, install pipes.', basePrice: 50 },
        { _id: '2', name: 'Electrical Works', description: 'Wiring, fixtures, panels.', basePrice: 65 },
        { _id: '3', name: 'Home Cleaning', description: 'Deep cleaning, dusting.', basePrice: 80 }
      ]);
    });
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Section */}
      <section className="text-center mt-12">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Professional Home Services <br/>
          <span className="text-blue-600">On Demand</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-8">
          Book trusted, reliable professionals for your home repair and maintenance needs. Fast, transparent pricing with guaranteed quality.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/customer" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            Book a Service <ArrowRight size={20} />
          </Link>
          <Link to="/provider" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Become a Provider
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mt-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Top Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map(service => (
            <div key={service._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">From ${service.basePrice}</span>
                <Link to="/customer" className="text-blue-600 font-medium hover:underline">Book Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Features */}
      <section className="bg-blue-50 rounded-2xl p-12 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Star className="text-blue-600 h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Verified Pros</h3>
            <p className="text-gray-600">Every provider undergoes a strict background check.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Shield className="text-blue-600 h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Guarantee</h3>
            <p className="text-gray-600">We back every job with a 30-day workmanship guarantee.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Clock className="text-blue-600 h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600">Pick a time that works for you, including same-day service.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
