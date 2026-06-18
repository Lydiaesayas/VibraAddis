import axios from "axios"


const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'https://vibraaddis-1.onrender.com'}/api`,
});

api.interceptors.request.use((config) => {
  // Try admin token first, then user token
  const adminToken = localStorage.getItem("token")
  const userToken = localStorage.getItem("userToken")
  const token = adminToken || userToken
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => { 
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("userToken")
      localStorage.removeItem("userRefreshToken")
      localStorage.removeItem("user")
      window.location.href = "/login"
      }
    return Promise.reject(error)
  }
)

// User authentication endpoints
export const userAuth = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  refresh: () => api.post('/users/refresh'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getFavorites: () => api.get('/users/favorites'),
  addFavorite: (venueId) => api.post(`/users/favorites/${venueId}`),
  removeFavorite: (venueId) => api.delete(`/users/favorites/${venueId}`)
}

// Payment endpoints
export const payments = {
  initialize: (data) => api.post('/payments/initialize', data),
  verify: (data) => api.post('/payments/verify', data),
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  getStats: () => api.get('/payments/stats'),
  refund: (id, data) => api.post(`/payments/${id}/refund`, data)
}

// Invoice endpoints
export const invoices = {
  create: (data) => api.post('/invoices', data),
  getAll: () => api.get('/invoices'),
  getById: (id) => api.get(`/invoices/${id}`),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  sendReminder: (id) => api.post(`/invoices/${id}/reminder`),
  getStats: () => api.get('/invoices/stats')
}

// Analytics endpoints
export const analytics = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRevenueByMonth: () => api.get('/analytics/revenue/monthly'),
  getSubscriptionTrends: () => api.get('/analytics/subscriptions/trends'),
  getVenuePerformance: () => api.get('/analytics/venues/performance'),
  getUserGrowth: () => api.get('/analytics/users/growth')
}

// Subscription expiration endpoints
export const subscriptionExpiration = {
  checkExpiring: () => api.post('/subscriptions/expiration/check'),
  getExpiringVenues: () => api.get('/subscriptions/expiration/expiring'),
  renewSubscription: (data) => api.post('/subscriptions/expiration/renew', data),
  getExpirationStats: () => api.get('/subscriptions/expiration/stats')
}

export default api