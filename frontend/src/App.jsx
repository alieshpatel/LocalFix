import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import api, { setupInterceptors } from './utils/api';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import BookingDetails from './pages/BookingDetails';
import Onboarding from './pages/Onboarding';

function App() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setupInterceptors(getToken);
  }, [getToken]);

  useEffect(() => {
    if (isSignedIn && user) {
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddresses: user.emailAddresses ? user.emailAddresses.map(e => ({ emailAddress: e.emailAddress })) : [],
        imageUrl: user.imageUrl
      };

      api.post('/users/sync', userData)
        .then(res => {
          if (res.data && res.data.role) {
            setUserRole(res.data.role);
            if (res.data.role === 'pending') {
              navigate('/onboarding');
            }
          }
        })
        .catch(err => console.error("Sync error:", err));
    }
  }, [isSignedIn, user, navigate]);

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
          <Route path="/onboarding" element={<Onboarding setUserRole={setUserRole} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
