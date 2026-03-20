import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Home as HomeIcon } from 'lucide-react';
import api from '../utils/api';

function Onboarding({ setUserRole }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectRole = async (role) => {
    setLoading(true);
    setError(null);
    try {
      await api.put('/users/profile', { role });
      setUserRole(role);
      navigate(`/${role}`);
    } catch (err) {
      console.error("Error setting role:", err);
      setError("Failed to update role. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Welcome to LocalFix!
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          How would you like to use our platform? Please select your account type below.
        </p>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleSelectRole('customer')}
            disabled={loading}
            className="flex flex-col items-center p-8 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-blue-600 hover:shadow-md transition-all group disabled:opacity-50"
          >
            <div className="bg-blue-50 p-6 rounded-full group-hover:bg-blue-100 transition-colors mb-6">
              <HomeIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">I need a Service</h2>
            <p className="text-gray-500 text-sm">
              I want to book professionals for home repairs and maintenance.
            </p>
          </button>

          <button
            onClick={() => handleSelectRole('provider')}
            disabled={loading}
            className="flex flex-col items-center p-8 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-blue-600 hover:shadow-md transition-all group disabled:opacity-50"
          >
            <div className="bg-blue-50 p-6 rounded-full group-hover:bg-blue-100 transition-colors mb-6">
              <Wrench className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">I provide Services</h2>
            <p className="text-gray-500 text-sm">
              I am a professional offering my services to customers.
            </p>
          </button>
        </div>
        
        <p className="mt-8 text-sm text-gray-400">
          You cannot easily change your role later, so please choose carefully!
        </p>
      </div>
    </div>
  );
}

export default Onboarding;
