import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import api, { setupInterceptors } from './utils/api';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import BookingDetails from './pages/BookingDetails';

function App() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setupInterceptors(getToken);
  }, [getToken]);

  useEffect(() => {
    if (isSignedIn) {
      api.post('/users/sync')
        .then(res => {
          if (res.data && res.data.role) {
            setUserRole(res.data.role);
          }
        })
        .catch(err => console.error("Sync error:", err));
    }
  }, [isSignedIn]);

  if (!isLoaded) return <div className="flex h-screen items-center justify-center text-xl text-gray-500">Loading LocalFix...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar userRole={userRole} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
