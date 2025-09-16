import axios from 'axios';

// Create axios instance with browser-compatible configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 8000, // Reduced timeout for faster feedback
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate', // Enable compression
  },
  // Remove adapter specification to let axios auto-detect (browser vs node)
  withCredentials: false, // Enable if you need credentials
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if it exists (support both keys for compatibility)
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear both possible token keys and show appropriate message
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      
      // Log the authentication error for debugging
      console.error('Authentication failed:', error.response?.data?.message || 'Invalid token');
      
      // You can dispatch a global auth error event here if needed
      window.dispatchEvent(new CustomEvent('auth-error', { 
        detail: { message: error.response?.data?.message || 'Please log in again' }
      }));
    }

    // Retry strategy for timeouts and transient network issues
    const config = error.config || {};
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout');
    const isNetwork = error.message === 'Network Error';
    if (isTimeout || isNetwork) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < 2) {
        config.__retryCount += 1;
        const backoffMs = 500 * config.__retryCount;
        return new Promise((resolve) => setTimeout(resolve, backoffMs)).then(() => api(config));
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Quiz endpoints
  getQuizQuestions: (quizType) => api.get(`/api/quiz/${quizType}`),
  submitClass10Quiz: (answers) => api.post('/api/quiz/class10/submit', { answers }),
  submitClass12Quiz: (answers, stream) => api.post('/api/quiz/class12/submit', { answers, stream }),
  // New unified submit-quiz endpoint
  submitQuiz: (quizType, responses, stream = null) => {
    const payload = { quizType, responses };
    if (stream) payload.stream = stream;
    return api.post('/api/quiz/submit-quiz', payload);
  },
  getQuizAttempts: () => api.get('/api/quiz/attempts'),
  
  // Course endpoints
  getCourses: (filters = {}) => api.get('/api/courses', { params: filters }),
  getCourseStreams: () => api.get('/api/courses/streams'),
  getCourseById: (id) => api.get(`/api/courses/${id}`),
  searchCourses: (term) => api.get(`/api/courses/search/${term}`),
  
  // College endpoints
  getColleges: (filters = {}) => api.get('/api/colleges', { params: filters }),
  getCollegeLocations: () => api.get('/api/colleges/locations'),
  getCollegeTypes: () => api.get('/api/colleges/types'),
  getTopColleges: (count = 10) => api.get(`/api/colleges/top/${count}`),
  getCollegeById: (id) => api.get(`/api/colleges/${id}`),
  searchColleges: (term) => api.get(`/api/colleges/search/${term}`),
  
  // Timeline endpoints
  getTimeline: (filters = {}) => api.get('/api/timeline', { params: filters }),
  getUpcomingEvents: (limit = 10) => api.get(`/api/timeline/upcoming?limit=${limit}`),
  getMonthEvents: (year, month) => api.get(`/api/timeline/month/${year}/${month}`),
  searchEvents: (term) => api.get(`/api/timeline/search/${term}`),
  
  // User endpoints
  register: (userData) => api.post('/api/users/register', userData),
  login: (credentials) => api.post('/api/users/login', credentials),
  getUserProfile: () => api.get('/api/users/profile'),
  updateUserProfile: (userData) => api.put('/api/users/profile', userData),
};

export default api;
