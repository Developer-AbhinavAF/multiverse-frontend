import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://multiverse-backend.onrender.com/api',
  timeout: 10000,
});

// Request interceptor
API.interceptors.request.use(config => {
  console.log(`Requesting: ${config.url}`);
  return config;
});

// Response interceptor
API.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config.url,
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const mediaAPI = {
  getAll: (type, params) => API.get(`/${type}`, { params }),
  getBySlug: (type, slug) => API.get(`/${type}/${slug}`),
  trackDownload: (type, slug, quality) => API.post(`/downloads/${type}/${slug}`, { quality }),
  addLike: (data) => API.post('/likes', data),
  addReview: (collection, slug, data) => API.post(`/reviews/${collection}/${slug}`, data)
};