import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('localfix_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('localfix_token')
      localStorage.removeItem('localfix_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)
export const getProfile = () => api.get('/auth/profile')

// Services
export const getServices = (params) => api.get('/services', { params })
export const getServiceById = (id) => api.get(`/services/${id}`)
export const createService = (data) => api.post('/services', data)

// Bookings / Requests
export const getBookings = (params) => api.get('/bookings', { params })
export const getBookingById = (id) => api.get(`/bookings/${id}`)
export const createBooking = (data) => api.post('/bookings', data)
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status })
export const cancelBooking = (id) => api.delete(`/bookings/${id}`)

// Providers
export const getProviders = (params) => api.get('/providers', { params })
export const getProviderById = (id) => api.get(`/providers/${id}`)

// Reviews
export const getReviews = (serviceId) => api.get(`/services/${serviceId}/reviews`)
export const createReview = (serviceId, data) => api.post(`/services/${serviceId}/reviews`, data)

// Admin
export const getAdminStats = () => api.get('/admin/stats')
export const getAdminUsers = (params) => api.get('/admin/users', { params })
export const getAdminBookings = (params) => api.get('/admin/bookings', { params })

export default api
