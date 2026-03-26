import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ArrowRight, Star, Shield, Clock, Zap } from 'lucide-react';
import api from '../utils/api';

function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data)).catch(() => {
      setServices([
        { _id: '1', name: 'Plumbing Repair', description: 'Expert plumbing for any leak, pipe, or installation.', basePrice: 50 },
        { _id: '2', name: 'Electrical Services', description: 'Safe and certified electrical wiring and repairs.', basePrice: 65 },
        { _id: '3', name: 'Home Cleaning', description: 'Deep pristine cleaning for a sparkling home.', basePrice: 80 }
      ]);
    });
  }, []);

  return (
    <div className="flex flex-col relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse-slow"></div>
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-400/20 to-teal-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-32 px-4 sm:px-6 text-center max-w-5xl mx-auto flex flex-col items-center animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/20 text-primary-700 font-medium mb-8 text-sm shadow-sm backdrop-blur-md">
          <Zap size={16} className="text-primary-500" /> 
          Now available in 50+ cities across the country
        </div>
        
        <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-900 tracking-tighter mb-8 leading-[1.1]">
          Premium Home Services <br className="hidden sm:block"/>
          <span className="text-gradient">On Demand.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
          Book elite, background-checked professionals for all your home repair and maintenance needs. Transparent pricing. Guaranteed excellence.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <Link to="/services" className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg">
            Explore Services <ArrowRight size={20} />
          </Link>
          <SignedIn>
            <Link to="/provider" className="glass bg-white/50 text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-full font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center text-lg shadow-sm">
              Become a Pro
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="glass bg-white/50 text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-full font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center text-lg shadow-sm w-full sm:w-auto">
                Become a Pro
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative z-10 py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Our Elite Services</h2>
          <p className="text-gray-500 mt-4 text-lg">Top-tier professionals ready when you are.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((service, index) => (
            <div key={service._id} className="glass rounded-3xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group border border-white/50 relative overflow-hidden" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 z-0"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                   <Star className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.name}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed line-clamp-2">{service.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-gray-400 block mb-1">Starting at</span>
                    <span className="text-2xl font-black text-gray-900">${service.basePrice}</span>
                  </div>
                  <Link 
                    to="/services" 
                    className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-primary-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Premium Features */}
      <section className="relative z-10 max-w-7xl mx-auto w-full my-24 px-4">
        <div className="glass-dark bg-gray-900 rounded-[3rem] p-12 md:p-20 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full mix-blend-overlay filter blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-5 rounded-2xl mb-6 backdrop-blur-md border border-white/10 text-primary-400">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Verified Pros</h3>
              <p className="text-gray-400 leading-relaxed max-w-xs">Every provider undergoes a strict, comprehensive background check before joining.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-5 rounded-2xl mb-6 backdrop-blur-md border border-white/10 text-purple-400">
                <Star className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Quality Guarantee</h3>
              <p className="text-gray-400 leading-relaxed max-w-xs">We stand behind the work. Every job comes with our 30-day workmanship guarantee.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-5 rounded-2xl mb-6 backdrop-blur-md border border-white/10 text-teal-400">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Flexible Scheduling</h3>
              <p className="text-gray-400 leading-relaxed max-w-xs">Pick a precise time that works for your schedule, including emergency same-day service.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
