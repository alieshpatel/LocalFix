import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Wrench } from 'lucide-react';

function Navbar({ userRole }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-primary-500/10 p-2 rounded-xl group-hover:bg-primary-500/20 transition-colors">
                <Wrench className="h-6 w-6 text-primary-600 group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gradient">LocalFix</span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {/* Services: visible to guests and customers only */}
              {userRole !== 'provider' && (
                <Link to="/services" className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive('/services') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                  Services
                </Link>
              )}
              <SignedIn>
                {userRole === 'customer' && (
                  <Link to="/customer" className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive('/customer') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                    Dashboard
                  </Link>
                )}
                {userRole === 'provider' && (
                  <Link to="/provider" className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive('/provider') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                    Provider Portal
                  </Link>
                )}
                {userRole && (
                  <Link to="/invoices" className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive('/invoices') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                    Invoices
                  </Link>
                )}
              </SignedIn>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all">
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="bg-white p-1 rounded-full shadow-sm border border-gray-100 hidden sm:block">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10 ring-2 ring-primary-100" } }} />
              </div>
              <div className="sm:hidden">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
