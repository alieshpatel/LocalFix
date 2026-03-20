import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function ProviderDashboard() {
  const [jobs, setJobs] = useState({ myJobs: [], availableJobs: [] });

  useEffect(() => {
    api.get('/bookings')
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  const acceptJob = async (id) => {
    try {
      await api.put(`/bookings/${id}/accept`);
      const res = await api.get('/bookings');
      setJobs(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to accept job");
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-8">Provider Dashboard</h1>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-md text-sm">{jobs.availableJobs?.length || 0}</span> 
          Available Leads
        </h2>
        {jobs.availableJobs?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <p className="text-gray-500">No new jobs available in your area at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.availableJobs?.map(job => (
              <div key={job._id} className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-blue-500 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition">
                <div>
                  <h3 className="font-bold text-lg">{job.service?.name || 'Unknown'}</h3>
                  <div className="text-sm text-gray-600 mt-1 flex gap-4">
                    <span>📅 {new Date(job.scheduledDate).toLocaleDateString()}</span>
                    <span>📍 {job.address}</span>
                    <span className="font-semibold text-green-700">Earnings: ${job.price}</span>
                  </div>
                </div>
                <button 
                  onClick={() => acceptJob(job._id)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
                >
                  Accept Job
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6">My Active Jobs</h2>
        {jobs.myJobs?.length === 0 ? (
          <p className="text-gray-500">You have no active jobs.</p>
        ) : (
          <div className="grid gap-4">
             {jobs.myJobs?.map(job => (
              <div key={job._id} className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center hover:shadow-md transition">
                <div>
                  <h3 className="font-bold text-lg">{job.service?.name || 'Unknown'}</h3>
                  <p className="text-sm text-gray-600 mt-1">Customer: {job.customer?.name} • Status: <span className="font-medium">{job.status}</span></p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/booking/${job._id}`} className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-800 hover:bg-gray-200 transition">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;
