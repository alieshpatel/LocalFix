import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import api from '../utils/api';
import { CheckCircle, Briefcase, Calendar, MapPin, ChevronRight, Edit3, Settings, DollarSign, Activity } from 'lucide-react';

function ProviderDashboard() {
  const { user } = useUser();
  const [jobs, setJobs] = useState({ myJobs: [], availableJobs: [] });
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ bio: '', hourlyRate: 0, skills: '', experienceYears: 0 });

  useEffect(() => {
    api.get('/bookings').then(res => setJobs(res.data)).catch(console.error);
    if (user?.id) loadProfile();
  }, [user?.id]);

  const loadProfile = () => {
    api.get(`/users/provider-profile/${user.id}`)
      .then(res => {
        setProfile(res.data);
        setProfileForm({
          bio: res.data.bio || '',
          hourlyRate: res.data.hourlyRate || 0,
          skills: res.data.skills ? res.data.skills.join(', ') : '',
          experienceYears: res.data.experienceYears || 0
        });
      })
      .catch(console.error);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
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
      loadProfile();
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

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
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 animate-fade-in relative">
      <h1 className="text-4xl font-extrabold flex items-center gap-3 tracking-tight mb-10 text-gray-900 border-b border-gray-200 pb-6">
        <Briefcase className="w-8 h-8 text-primary-600" /> Professional Dashboard
      </h1>

      {/* Profile Section */}
      <div className="mb-12 glass rounded-[2rem] p-8 border border-white/50 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <Settings className="w-6 h-6 text-gray-400" /> My Profile
          </h2>
          {!isEditingProfile && (
             <button 
               onClick={() => setIsEditingProfile(true)}
               className="flex items-center gap-2 text-primary-700 font-bold bg-primary-50 px-5 py-2.5 rounded-full hover:bg-primary-100 transition-colors shadow-sm"
             >
               <Edit3 className="w-4 h-4" /> Edit Profile
             </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-6 relative z-10 bg-white/50 p-6 rounded-2xl border border-gray-100 backdrop-blur-md">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Professional Bio</label>
              <textarea 
                value={profileForm.bio}
                onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                className="w-full border border-gray-200 bg-white rounded-xl p-4 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none resize-none"
                rows="3"
                placeholder="Share your expertise to attract more clients..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Hourly Rate ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <span className="text-gray-500 font-bold">$</span>
                  </div>
                  <input 
                    type="number" 
                    value={profileForm.hourlyRate}
                    onChange={e => setProfileForm({...profileForm, hourlyRate: e.target.value})}
                    className="w-full border border-gray-200 bg-white rounded-xl py-3 pl-8 pr-4 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Experience (Yrs)</label>
                <input 
                  type="number" 
                  value={profileForm.experienceYears}
                  onChange={e => setProfileForm({...profileForm, experienceYears: e.target.value})}
                  className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Skills (csv)</label>
                <input 
                  type="text" 
                  value={profileForm.skills}
                  onChange={e => setProfileForm({...profileForm, skills: e.target.value})}
                  className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
                  placeholder="e.g. Plumbing, HVAC"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50">
              <button 
                type="button" 
                onClick={() => { setIsEditingProfile(false); loadProfile(); }}
                className="px-6 py-2.5 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          profile ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              <div className="md:col-span-3">
                <p className="text-lg text-gray-700 leading-relaxed font-medium">{profile.bio || <span className="text-gray-400 italic">No bio added yet. Stand out by adding your expertise.</span>}</p>
                {profile.skills && profile.skills.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <span key={skill} className="bg-white border border-gray-200 text-gray-800 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 rounded-2xl flex flex-col justify-center border border-primary-100 shadow-inner">
                <div className="mb-4">
                  <span className="text-xs text-primary-600 uppercase font-black tracking-widest flex items-center gap-1">
                     <DollarSign className="w-3 h-3"/> Base Rate
                  </span>
                  <p className="text-3xl font-black text-gray-900">${profile.hourlyRate || 0}<span className="text-sm font-semibold text-gray-500">/hr</span></p>
                </div>
                <div>
                  <span className="text-xs text-primary-600 uppercase font-black tracking-widest">Experience</span>
                  <p className="text-xl font-bold text-gray-900">{profile.experienceYears || 0} Years</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Available Leads */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
              <span className="bg-green-100 text-green-700 py-1.5 px-3 rounded-xl text-sm border border-green-200 shadow-sm">{jobs.availableJobs?.length || 0}</span> 
              New Leads
            </h2>
            {jobs.availableJobs?.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center border border-white/50">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No new jobs in your area.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.availableJobs?.map(job => (
                  <div key={job._id} className="glass p-6 rounded-2xl shadow-sm border border-white/60 hover:shadow-lg transition flex flex-col gap-4 border-l-4 border-l-green-500">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{job.service?.name || 'Unknown'}</h3>
                      <div className="text-sm text-gray-600 mt-2 space-y-1 font-medium">
                        <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-green-600" /> {new Date(job.scheduledDate).toLocaleDateString()}</p>
                        <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-600" /> {job.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                       <span className="font-extrabold text-lg text-green-700">${job.price}</span>
                       <button 
                        onClick={() => acceptJob(job._id)}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4"/> Accept Lead
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Jobs */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              My Active Jobs
            </h2>
            {jobs.myJobs?.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center border border-white/50">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">You have no active projects.</p>
              </div>
            ) : (
              <div className="space-y-4">
                 {jobs.myJobs?.map(job => (
                  <div key={job._id} className="glass p-6 rounded-2xl shadow-sm border border-white/60 hover:shadow-lg transition flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-gray-900">{job.service?.name || 'Unknown'}</h3>
                          <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full border border-gray-200 uppercase tracking-widest">{job.status}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium"><span className="text-gray-400">Client:</span> {job.customer?.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/booking/${job._id}`} className="w-full bg-white border border-gray-200 text-center py-2.5 rounded-xl font-bold text-gray-800 hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2">
                          Manage Job <ChevronRight className="w-4 h-4"/>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
