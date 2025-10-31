import axios from 'axios';

/**
 * Base API configuration for EcoTrade backend communication
 */
const API_BASE_URL = 'http://localhost:3005/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecotrade_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ecotrade_token');
      localStorage.removeItem('ecotrade_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API
 */
export const authApi = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('ecotrade_token', response.data.access_token);
      localStorage.setItem('ecotrade_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('ecotrade_token', response.data.access_token);
      localStorage.setItem('ecotrade_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('ecotrade_token');
    localStorage.removeItem('ecotrade_user');
  }
};

/**
 * Products API
 */
export const productsApi = {
  async getAll(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getFeatured(limit = 6) {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getMyProducts() {
    const response = await api.get('/products/my-products');
    return response.data;
  },

  async getBySeller(sellerId) {
    const response = await api.get(`/products/seller/${sellerId}`);
    return response.data;
  },

  async create(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  async update(id, productData) {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/products/categories');
    return response.data;
  }
};

/**
 * Users API
 */
export const usersApi = {
  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.put('/users/profile', userData);
    // Update localStorage with new user data
    if (response.data) {
      const currentUser = getCurrentUser();
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('ecotrade_user', JSON.stringify(updatedUser));
    }
    return response.data;
  }
};

/**
 * Questions API
 */
export const questionsApi = {
  async create(questionData) {
    const response = await api.post('/questions', questionData);
    return response.data;
  },

  async getByProduct(productId) {
    const response = await api.get(`/questions/product/${productId}`);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  }
};

/**
 * Answers API
 */
export const answersApi = {
  async create(answerData) {
    const response = await api.post('/answers', answerData);
    return response.data;
  },

  async getByQuestion(questionId) {
    const response = await api.get(`/answers/question/${questionId}`);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/answers/${id}`);
    return response.data;
  }
};

/**
 * Purchases API
 */
export const purchasesApi = {
  async create(purchaseData) {
    const response = await api.post('/purchases', purchaseData);
    return response.data;
  },

  async getAll(params = {}) {
    const response = await api.get('/purchases', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  },

  async update(id, updateData) {
    const response = await api.patch(`/purchases/${id}`, updateData);
    return response.data;
  },

  async cancel(id) {
    const response = await api.delete(`/purchases/${id}`);
    return response.data;
  }
};

/**
 * Reviews API
 */
export const reviewsApi = {
  async create(reviewData) {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  async getByUser(userId, params = {}) {
    const response = await api.get(`/reviews/user/${userId}`, { params });
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }
};

/**
 * Chat API
 */
export const chatApi = {
  async sendMessage(messageData) {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
  },

  async getAllChats() {
    const response = await api.get('/chat');
    return response.data;
  },

  async getMessagesByPurchase(purchaseId) {
    const response = await api.get(`/chat/purchase/${purchaseId}`);
    return response.data;
  },

  async deleteMessage(id) {
    const response = await api.delete(`/chat/messages/${id}`);
    return response.data;
  }
};

/**
 * Subscriptions API
 */
export const subscriptionsApi = {
  async create(subscriptionData) {
    const response = await api.post('/subscriptions', subscriptionData);
    return response.data;
  },

  async getMySubscriptions() {
    const response = await api.get('/subscriptions/my-subscriptions');
    return response.data;
  },

  async getActive() {
    const response = await api.get('/subscriptions/active');
    return response.data;
  },

  async getLimits() {
    const response = await api.get('/subscriptions/limits');
    return response.data;
  },

  async canPublish() {
    const response = await api.get('/subscriptions/can-publish');
    return response.data;
  },

  async canFeature() {
    const response = await api.get('/subscriptions/can-feature');
    return response.data;
  },

  async hasAnalytics() {
    const response = await api.get('/subscriptions/has-analytics');
    return response.data;
  },

  async getOne(id) {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },

  async update(id, updateData) {
    const response = await api.patch(`/subscriptions/${id}`, updateData);
    return response.data;
  },

  async cancel(id) {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  }
};

/**
 * Utility functions
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('ecotrade_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('ecotrade_token');
};

export default api;
