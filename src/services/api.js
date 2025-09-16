import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper functions
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Request interceptor → attach accessToken
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to avoid multiple refresh requests at once
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// Response interceptor → handle expired accessToken
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and not retrying already
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.dispatchEvent(new CustomEvent('auth-error', { detail: { message: 'Please log in again' } }));
        return Promise.reject(error);
      }

      // Mark the request as retrying
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue the request until refresh finishes
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/refresh-token`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;
        setTokens(newAccessToken, newRefreshToken);

        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        onRefreshed(newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.dispatchEvent(new CustomEvent('auth-error', { detail: { message: 'Session expired, please log in again' } }));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
  login: async (credentials) => {
    const response = await api.post('/api/users/login', credentials);
    const { accessToken, refreshToken } = response.data;
    setTokens(accessToken, refreshToken);
    return response;
  },
  getUserProfile: () => api.get('/api/users/profile'),
  updateUserProfile: (userData) => api.put('/api/users/profile', userData),
};

export default api;
