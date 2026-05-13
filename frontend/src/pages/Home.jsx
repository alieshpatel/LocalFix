import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ArrowRight, Star, Shield, Clock, Zap, Search, Calendar, Wrench, MessageSquare, CheckCircle, Users, Camera, FileText } from 'lucide-react';
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
    <div className="flex flex-col relative overflow-hidden bg-white">
      {/* Premium Animated Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse-slow"></div>
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-400/20 to-teal-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-24 px-4 sm:px-6 text-center max-w-5xl mx-auto flex flex-col items-center animate-slide-up">
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

      {/* Stats Section */}
      <section className="relative z-10 py-12 border-y border-gray-100 bg-white/60 backdrop-blur-md mb-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
          <div className="flex flex-col items-center text-center px-4 group hover:scale-105 transition-transform">
            <span className="text-4xl font-black text-primary-600 mb-2 group-hover:text-primary-500 transition-colors">500+</span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 justify-center"><Users size={16} /> Verified Pros</span>
          </div>
          <div className="flex flex-col items-center text-center px-4 group hover:scale-105 transition-transform">
            <span className="text-4xl font-black text-purple-600 mb-2 group-hover:text-purple-500 transition-colors">10k+</span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 justify-center"><CheckCircle size={16} /> Jobs Completed</span>
          </div>
          <div className="flex flex-col items-center text-center px-4 group hover:scale-105 transition-transform">
            <span className="text-4xl font-black text-blue-600 mb-2 group-hover:text-blue-500 transition-colors">4.9</span>
            <div className="flex items-center text-yellow-400 mb-1 justify-center">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Average Rating</span>
          </div>
          <div className="flex flex-col items-center text-center px-4 group hover:scale-105 transition-transform">
            <span className="text-4xl font-black text-teal-600 mb-2 group-hover:text-teal-500 transition-colors">50+</span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 justify-center"><Zap size={16} /> Cities Covered</span>
          </div>
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
            <div key={service._id} className="glass rounded-3xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group border border-white/50 relative overflow-hidden bg-white/80" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 z-0"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                   <Star className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.name}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed line-clamp-2">{service.description}</p>
                <div className="flex justify-end items-center mt-auto">
                  <Link 
                    to="/services" 
                    className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-primary-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm border border-gray-100"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 hover:gap-3 transition-all text-lg bg-primary-50 hover:bg-primary-100 px-8 py-3 rounded-full">
            View All Services <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* How It Works - Flowline */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto w-full bg-gradient-to-b from-gray-50/50 to-white rounded-[3rem] my-16 border border-gray-100 shadow-sm">
        <div className="text-center mb-20">
          <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2 block">Simple Process</span>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">How LocalFix Works</h2>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">From booking to a beautifully repaired home in 4 easy steps. We handle the complexity so you don't have to.</p>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-1 bg-gray-200 z-0 rounded-full">
             <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 via-purple-400 to-teal-400 w-full opacity-50"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-[6px] border-gray-50 group-hover:border-primary-100 group-hover:scale-110 transition-all duration-300 mb-6 relative z-10">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md">1</div>
                <Camera className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Describe & Snap</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Share details about your home issue and upload a quick photo so pros can see exactly what's needed.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-[6px] border-gray-50 group-hover:border-purple-100 group-hover:scale-110 transition-all duration-300 mb-6 relative z-10">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md">2</div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Receive Estimates</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Local verified professionals review your request and send custom price estimates based on your specific problem.</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-[6px] border-gray-50 group-hover:border-blue-100 group-hover:scale-110 transition-all duration-300 mb-6 relative z-10">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md">3</div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Accept & Book</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Compare quotes, choose the best professional for the job, and schedule a convenient time for the repair.</p>
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-[6px] border-gray-50 group-hover:border-teal-100 group-hover:scale-110 transition-all duration-300 mb-6 relative z-10">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md">4</div>
                <Wrench className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Pro Fixes & You Pay</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Your chosen professional completes the job with excellence. Pay securely only after the work is done.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Premium Features */}
      <section className="relative z-10 max-w-7xl mx-auto w-full my-16 px-4 mb-24">
        <div className="glass-dark bg-gray-900 rounded-[3rem] p-12 md:p-20 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full mix-blend-overlay filter blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full mix-blend-overlay filter blur-[60px] translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="relative z-10 text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">The LocalFix Guarantee</h2>
            <p className="text-gray-400 mt-4 text-lg">Why thousands of customers trust us with their homes.</p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center group">
              <div className="bg-white/10 p-5 rounded-2xl mb-6 backdrop-blur-md border border-white/10 text-primary-400 group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-300">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Verified Pros</h3>
              <p className="text-gray-400 leading-relaxed max-w-xs group-hover:text-gray-300 transition-colors">Every provider undergoes a strict, comprehensive background check before joining our elite network.</p>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="bg-white/10 p-5 rounded-2xl mb-6 backdrop-blur-md border border-white/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300">
                <Star className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Quality Guarantee</h3>
              <p className="text-gray-400 leading-relaxed max-w-xs group-hover:text-gray-300 transition-colors">We stand behind the work. Every job comes with our 30-day workmanship guarantee. Peace of mind included.</p>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="bg-white/10 p-5 rounded-2xl mb-6 backdrop-blur-md border border-white/10 text-teal-400 group-hover:bg-teal-500/20 group-hover:scale-110 transition-all duration-300">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Flexible Scheduling</h3>
              <p className="text-gray-400 leading-relaxed max-w-xs group-hover:text-gray-300 transition-colors">Pick a precise time that works for your schedule, including emergency same-day service when you need it most.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

