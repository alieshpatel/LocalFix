import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Wrench } from 'lucide-react';

function Navbar({ userRole }) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">LocalFix</span>
            </Link>
            
            <SignedIn>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {userRole === 'customer' && (
                  <Link to="/customer" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    My Dashboard
                  </Link>
                )}
                {userRole === 'provider' && (
                  <Link to="/provider" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Provider Portal
                  </Link>
                )}
              </div>
            </SignedIn>
          </div>
          
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
