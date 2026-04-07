import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import api from '../utils/api';
import {
  CheckCircle, Briefcase, Calendar, MapPin, ChevronRight,
  Edit3, Settings, DollarSign, Activity, Star, Loader2,
  ToggleLeft, ToggleRight, Save, X
} from 'lucide-react';

function ProviderDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState({ myJobs: [], availableJobs: [] });
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ bio: '', hourlyRate: 0, skills: '', experienceYears: 0 });
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [togglingAvail, setTogglingAvail] = useState(false);

  const loadJobs = useCallback(async () => {
    try {
      const res = await api.get('/bookings');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/users/provider-profile/${user.id}`);
      setProfile(res.data);
      setProfileForm({
        bio: res.data.bio || '',
        hourlyRate: res.data.hourlyRate || 0,
        skills: res.data.skills ? res.data.skills.join(', ') : '',
        experienceYears: res.data.experienceYears || 0
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    loadJobs();
    loadProfile();
  }, [loadJobs, loadProfile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const skillsArray = profileForm.skills.split(',').map(s => s.trim()).filter(Boolean);
      await api.put('/users/provider-profile', {
        clerkId: user.id,
        bio: profileForm.bio,
        hourlyRate: Number(profileForm.hourlyRate),
        skills: skillsArray,
        experienceYears: Number(profileForm.experienceYears)
      });
      setIsEditingProfile(false);
      await loadProfile();
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleAvailability = async () => {
    if (!profile || togglingAvail) return;
    const newVal = !profile.isAvailable;
    // Optimistic update so UI feels instant
    setProfile(prev => ({ ...prev, isAvailable: newVal }));
    setTogglingAvail(true);
    try {
      await api.put('/users/availability', { isAvailable: newVal });
    } catch (err) {
      // Silently revert – no annoying alert
      console.error('Availability toggle failed:', err.response?.data || err.message);
      setProfile(prev => ({ ...prev, isAvailable: !newVal }));
    } finally {
      setTogglingAvail(false);
    }
  };

  const acceptJob = async (jobId) => {
    try {
      await api.put(`/bookings/${jobId}/accept`);
      await loadJobs();
    } catch (error) {
      alert('Failed to accept job: ' + (error.response?.data?.error || error.message));
    }
  };

  const stats = {
    active: jobs.myJobs?.filter(j => j.status === 'accepted' || j.status === 'in-progress').length || 0,
    completed: jobs.myJobs?.filter(j => j.status === 'completed').length || 0,
    leads: jobs.availableJobs?.length || 0,
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary-600" /> Provider Portal
          </h1>
          <p className="text-gray-500 mt-1">Manage your leads, jobs, and professional profile.</p>
        </div>
        {profile && (
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold ${profile.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
              {profile.isAvailable ? '🟢 Online & Accepting Jobs' : '⚫ Offline'}
            </span>
            <button
              type="button"
              onClick={toggleAvailability}
              disabled={togglingAvail}
              aria-label="Toggle availability"
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 disabled:opacity-60 shadow-inner ${
                profile.isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  profile.isAvailable ? 'translate-x-7' : 'translate-x-1'
                }`}
              >
                {togglingAvail && (
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute inset-1" />
                )}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active Jobs', value: stats.active, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Completed', value: stats.completed, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' },
          { label: 'New Leads', value: stats.leads, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 shadow-sm`}>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Profile Section */}
      <div className="mb-8 glass rounded-3xl p-6 border border-white/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <Settings className="w-5 h-5 text-gray-400" /> My Profile
          </h2>
          {!isEditingProfile ? (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 text-primary-700 font-bold bg-primary-50 px-4 py-2 rounded-full hover:bg-primary-100 transition shadow-sm text-sm"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : null}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 relative z-10">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Professional Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-primary-400 outline-none resize-none text-sm"
                rows="3"
                placeholder="Describe your expertise..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  value={profileForm.hourlyRate}
                  onChange={e => setProfileForm({ ...profileForm, hourlyRate: e.target.value })}
                  className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-primary-400 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  value={profileForm.experienceYears}
                  onChange={e => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                  className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-primary-400 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={profileForm.skills}
                  onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })}
                  className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:ring-2 focus:ring-primary-400 outline-none text-sm"
                  placeholder="e.g. Plumbing, HVAC, Electrical"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 bg-gray-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-black transition disabled:opacity-50"
              >
                {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
              <button
                type="button"
                onClick={() => { setIsEditingProfile(false); loadProfile(); }}
                className="flex items-center gap-2 text-gray-600 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            <div className="md:col-span-3">
              <p className="text-gray-700 leading-relaxed mb-4">
                {profile.bio || <span className="text-gray-400 italic">No bio yet. Add one to attract more clients.</span>}
              </p>
              {profile.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <span key={skill} className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-indigo-50 p-5 rounded-2xl border border-primary-100 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-500 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Rate
                </p>
                <p className="text-2xl font-black text-gray-900">${profile.hourlyRate || 0}<span className="text-sm font-medium text-gray-400">/hr</span></p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-500">Experience</p>
                <p className="text-lg font-bold text-gray-900">{profile.experienceYears || 0} yrs</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-500">Rating</p>
                <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {(profile.reliabilityScore || 5).toFixed(1)}
                  <span className="text-sm text-gray-400 font-normal">({profile.totalReviews || 0})</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse space-y-3 relative z-10">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        )}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Leads */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-sm font-bold border border-green-200">
              {jobs.availableJobs?.length || 0}
            </span>
            Available Leads
          </h2>

          {loadingJobs ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-primary-400 animate-spin" /></div>
          ) : jobs.availableJobs?.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center border border-white/50">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-500 font-medium">No new job leads right now.</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon for new requests.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.availableJobs.map(job => (
                <div key={job._id} className="glass p-5 rounded-2xl border-l-4 border-l-green-500 border border-white/60 shadow-sm hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900">{job.service?.name || 'Service'}</h3>
                    <span className="font-black text-green-700 text-lg">${job.price}</span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1 mb-4 font-medium">
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-green-500" /> {new Date(job.scheduledDate).toLocaleDateString()}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-500" /> {job.address}</p>
                    {job.customer && <p className="flex items-center gap-2 text-primary-600">Client: {job.customer.name}</p>}
                  </div>
                  <button
                    onClick={() => acceptJob(job._id)}
                    className="w-full bg-green-600 text-white py-2.5 rounded-xl font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Accept This Job
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Active Jobs */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <Activity className="w-5 h-5 text-primary-500" /> My Jobs
          </h2>

          {loadingJobs ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-primary-400 animate-spin" /></div>
          ) : jobs.myJobs?.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center border border-white/50">
              <div className="text-4xl mb-3">💼</div>
              <p className="text-gray-500 font-medium">No active jobs yet.</p>
              <p className="text-gray-400 text-sm mt-1">Accept a lead from the left to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.myJobs.map(job => {
                const statusColors = {
                  accepted: 'bg-blue-100 text-blue-700 border-blue-200',
                  'in-progress': 'bg-purple-100 text-purple-700 border-purple-200',
                  completed: 'bg-green-100 text-green-700 border-green-200',
                };
                return (
                  <div key={job._id} className="glass p-5 rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900">{job.service?.name || 'Service'}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wide ${statusColors[job.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {job.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1 mb-4 font-medium">
                      <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(job.scheduledDate).toLocaleDateString()}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.address}</p>
                      {job.customer && <p className="text-primary-600 font-semibold">Client: {job.customer.name}</p>}
                    </div>
                    <Link
                      to={`/booking/${job._id}`}
                      className="w-full bg-white border border-gray-200 text-gray-800 py-2.5 rounded-xl font-bold hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition flex items-center justify-center gap-2 text-sm"
                    >
                      Manage Job <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
