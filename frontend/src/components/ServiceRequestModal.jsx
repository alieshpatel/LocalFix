import { useState, useEffect } from 'react';
import { Calendar, MapPin, X, Loader2, Star, CheckCircle, ChevronLeft } from 'lucide-react';
import api from '../utils/api';

const JOB_TYPES = [
  { label: 'Plumber', skill: 'Plumbing', emoji: '🔧' },
  { label: 'Electrician', skill: 'Electrical', emoji: '⚡' },
  { label: 'HVAC Technician', skill: 'HVAC', emoji: '❄️' },
  { label: 'Cleaner', skill: 'Cleaning', emoji: '🧹' },
  { label: 'Carpenter', skill: 'Carpentry', emoji: '🪚' },
  { label: 'Pest Control', skill: 'Pest Control', emoji: '🪲' },
  { label: 'Painter', skill: 'Painting', emoji: '🖌️' },
  { label: 'Appliance Repair', skill: 'Appliances', emoji: '🔌' },
];

function ServiceRequestModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [jobType, setJobType] = useState(null);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [problemImageFile, setProblemImageFile] = useState(null);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setJobType(null);
      setProviders([]);
      setSelectedProvider(null);
      setAddress('');
      setDate('');
      setProblemDescription('');
      setProblemImageFile(null);
    }
  }, [isOpen]);

  const handlePickJobType = async (jt) => {
    setJobType(jt);
    setStep(2);
    setLoadingProviders(true);
    try {
      const res = await api.get(`/users/providers?skill=${jt.skill}&online=true`);
      setProviders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProviders(false);
    }
  };

  const handlePickProvider = (provider) => {
    setSelectedProvider(provider);
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProvider) return;
    setSubmitting(true);
    try {
      let problemImage = '';
      if (problemImageFile) {
        const formData = new FormData();
        formData.append('image', problemImageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        problemImage = uploadRes.data.url;
      }

      // Fetch services and find a match
      const servicesRes = await api.get('/services');
      const servicesList = servicesRes.data;

      const matchedService = servicesList.find(s =>
        s.category?.toLowerCase() === jobType.skill.toLowerCase()
      ) || servicesList[0];

      // Guard: no services in DB at all
      if (!matchedService || !matchedService._id) {
        alert('No services are set up yet. Please contact support.');
        setSubmitting(false);
        return;
      }

      await api.post('/bookings', {
        serviceId: matchedService._id,
        address,
        scheduledDate: new Date(date),
        problemDescription,
        problemImage,
        providerId: selectedProvider._id,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-gray-100 flex-shrink-0 flex items-center gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-gray-400 hover:text-gray-700 transition bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? 'bg-primary-500' : 'bg-gray-200'}`} />
              ))}
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {step === 1 && 'What do you need?'}
              {step === 2 && `Available ${jobType?.label}s`}
              {step === 3 && 'Schedule Your Visit'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {step === 1 && 'Choose the type of professional you need'}
              {step === 2 && `${providers.length} pro${providers.length !== 1 ? 's' : ''} online right now`}
              {step === 3 && `Booking with ${selectedProvider?.name}`}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7">

          {/* Step 1: Job type grid */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {JOB_TYPES.map(jt => (
                <button
                  key={jt.skill}
                  onClick={() => handlePickJobType(jt)}
                  className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-100 hover:border-primary-400 hover:bg-primary-50 transition-all group text-left font-semibold text-gray-800 hover:text-primary-700 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                >
                  <span className="text-2xl">{jt.emoji}</span>
                  <span className="text-sm font-bold">{jt.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Online providers */}
          {step === 2 && (
            <div className="space-y-3">
              {loadingProviders ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                  <p className="text-gray-400 text-sm">Finding available {jobType?.label}s...</p>
                </div>
              ) : providers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">😔</div>
                  <h3 className="font-bold text-gray-700 mb-1">No {jobType?.label}s Online</h3>
                  <p className="text-gray-400 text-sm">All {jobType?.label}s are currently busy. Try again shortly or pick another type.</p>
                  <button onClick={() => setStep(1)} className="mt-4 text-primary-600 font-bold text-sm hover:underline">
                    ← Pick different job type
                  </button>
                </div>
              ) : (
                providers.map(p => (
                  <button
                    key={p._id}
                    onClick={() => handlePickProvider(p)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-primary-400 hover:bg-primary-50 transition-all text-left hover:-translate-y-0.5 hover:shadow-md group"
                  >
                    <img
                      src={p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=6366f1&color=fff`}
                      alt={p.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-gray-900 truncate">{p.name}</span>
                        <span className="flex items-center gap-0.5 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full border border-green-200">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span> Online
                        </span>
                      </div>
                      {p.reliabilityScore > 0 && (
                        <span className="flex items-center gap-1 text-xs text-yellow-600 font-semibold">
                          <Star className="w-3 h-3 fill-current" /> {p.reliabilityScore.toFixed(1)} · {p.totalReviews} reviews
                        </span>
                      )}
                      {p.skills?.length > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{p.skills.join(', ')}</p>
                      )}
                    </div>
                    <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-primary-500 rotate-180 transition-colors flex-shrink-0" />
                  </button>
                ))
              )}
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {selectedProvider && (
                <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-2xl p-4">
                  <img
                    src={selectedProvider.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedProvider.name)}&background=6366f1&color=fff`}
                    alt={selectedProvider.name}
                    className="w-10 h-10 rounded-full ring-2 ring-white"
                  />
                  <div>
                    <p className="font-bold text-primary-800">{selectedProvider.name}</p>
                    <p className="text-xs text-primary-500">{jobType?.label} · {jobType?.emoji}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-primary-500 ml-auto" />
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  <MapPin className="w-4 h-4 text-primary-500" /> Your Address
                </label>
                <input
                  required
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none text-sm font-medium transition"
                  placeholder="Where do you need the service?"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  <Calendar className="w-4 h-4 text-primary-500" /> Date & Time
                </label>
                <input
                  required
                  type="datetime-local"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none text-sm font-medium transition"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Problem Description
                </label>
                <textarea
                  required
                  value={problemDescription}
                  onChange={e => setProblemDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none text-sm font-medium transition resize-none"
                  placeholder="Describe your issue in detail..."
                  rows="3"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Attach an Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setProblemImageFile(e.target.files[0])}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 text-base mt-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {submitting ? 'Confirming...' : 'Request Estimate'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceRequestModal;