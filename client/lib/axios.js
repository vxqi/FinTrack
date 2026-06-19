import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('fintrack_user')
    if (user) {
      // Token is in httpOnly cookie — no need to attach manually
      // This interceptor is here for future extension
    }
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('fintrack_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api