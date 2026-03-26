import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Briefcase, Clock, ChevronRight, Star } from 'lucide-react';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services')
      .then(res => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="py-12 animate-fade-in relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
          Professional <span className="text-gradient">Services</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose from our top-rated local professionals. Quality work, guaranteed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 bg:grid-cols-3 gap-8 relative z-10 px-4 sm:px-0">
        {services.map((service, index) => (
          <div 
            key={service._id} 
            className="glass rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group cursor-pointer border border-gray-100"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => {/* Implementation depends on how we book, maybe to customer dashboard */ navigate('/customer')}}
          >
            <div className="bg-primary-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
              <Briefcase className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-6 line-clamp-2">{service.description}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>Base Price: ${service.basePrice}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
