import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser, SignedIn } from '@clerk/clerk-react';
import api from '../utils/api';
import { Star, MapPin, Clock, Award, CheckCircle, MessageSquare } from 'lucide-react';

function ProviderDetails() {
  const { id } = useParams();
  const { user } = useUser();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/users/provider-profile/${id}`),
      api.get(`/reviews/provider/${id}`).catch(() => ({ data: [] }))
    ])
    .then(([profileRes, reviewsRes]) => {
      setProvider(profileRes.data);
      setReviews(reviewsRes.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;
    setSubmitLoading(true);
    try {
      // Assuming serviceId is not strictly required or we use a dummy one if not tied to a specific booking in this UI
      const res = await api.post('/reviews', { 
        providerId: id, 
        rating: reviewForm.rating, 
        comment: reviewForm.comment 
      });
      setReviews([res.data, ...reviews]);
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to submit review');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!provider) return <div className="text-center py-12 text-xl text-gray-500">Provider not found.</div>;

  return (
    <div className="py-8 animate-fade-in max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="glass rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left border border-white/40 shadow-xl shadow-primary-500/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        
        <img 
          src={provider.avatar || `https://ui-avatars.com/api/?name=${provider.name}&background=6366f1&color=fff`} 
          alt={provider.name} 
          className="w-32 h-32 rounded-full ring-4 ring-white shadow-lg object-cover relative z-10"
        />
        
        <div className="flex-1 relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2 justify-center md:justify-start">
                {provider.name} {provider.reliabilityScore >= 4.0 && <CheckCircle className="w-6 h-6 text-green-500" />}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-gray-600 justify-center md:justify-start">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Local Pro</span>
                <span className="flex items-center gap-1 text-primary-600 font-medium">
                  <Star className="w-4 h-4 fill-current"/> {(provider.reliabilityScore || 5).toFixed(1)} ({provider.totalReviews || 0} reviews)
                </span>
              </div>
            </div>
            
            <Link 
              to="/customer" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5"
            >
              Book Now
            </Link>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">{provider.bio || "This professional brings reliable, high-quality service to every job."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Facts</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-700">
                <div className="bg-primary-50 p-2 rounded-lg"><Clock className="w-5 h-5 text-primary-600"/></div>
                <div>
                  <p className="text-sm text-gray-500">Rate</p>
                  <p className="font-semibold">${provider.hourlyRate || 50}/hr</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <div className="bg-primary-50 p-2 rounded-lg"><Award className="w-5 h-5 text-primary-600"/></div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-semibold">{provider.experienceYears || 1}+ Years</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {provider.skills && provider.skills.length > 0 ? (
                provider.skills.map((skill, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">General Handyman</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Col - Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-gray-900">
              <MessageSquare className="w-6 h-6 text-primary-500" /> Customer Reviews
            </h2>

            <SignedIn>
              {user?.publicMetadata?.role === 'customer' && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-semibold mb-3">Write a Review</h4>
                  <div className="flex items-center gap-2 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-6 h-6 cursor-pointer hover:scale-110 transition-transform ${reviewForm.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      />
                    ))}
                  </div>
                  <textarea 
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="Share your experience working with this professional..."
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white resize-none"
                    rows="3"
                  />
                  <div className="mt-3 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={submitLoading}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50"
                    >
                      {submitLoading ? 'Posting...' : 'Post Review'}
                    </button>
                  </div>
                </form>
              )}
            </SignedIn>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to leave one!</p>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold text-gray-900 block">{review.fromUser?.name || "Customer"}</span>
                        <div className="flex text-yellow-400 text-sm mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDetails;
