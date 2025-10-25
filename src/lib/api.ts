import axios from 'axios'
import { store } from '../redux/store'
import { API_URL } from '../redux/urls'
import { resetAccessToken } from '@/redux/auth/authSlice'

const api = axios.create({
  baseURL: API_URL,
})

// Automatically add the Authorization header with JWT token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken || localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle 401 and retry the request
api.interceptors.response.use(
  // If the response is successful, just return it
  (response) => response,

  async (error) => {
    const originalRequest = error.config
    // Check for 401 and if it's not the retry request
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newToken = localStorage.getItem('accessToken')
      if (newToken) {
        store.dispatch(resetAccessToken());
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        try {
          return api(originalRequest)
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
