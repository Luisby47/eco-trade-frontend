/**
 * Utility functions for the EcoTrade application
 */

/**
 * Create page URL - simple function to handle routing
 * In a real app, this would integrate with React Router
 */
export const createPageUrl = (page) => {
  const pageMap = {
    Home: '/',
    Browse: '/browse',
    ProductDetail: '/product',
    PostProduct: '/post',
    Profile: '/profile',
    Chat: '/chat',
    Login: '/login',
    Register: '/register',
  };
  
  const basePath = pageMap[page.split('?')[0]] || '/';
  const params = page.includes('?') ? '?' + page.split('?')[1] : '';
  
  return basePath + params;
};

/**
 * Format price in Costa Rican colones
 */
export const formatPrice = (price) => {
  if (!price) return '₡0';
  return `₡${price.toLocaleString('es-CR')}`;
};

/**
 * Format date for display
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get condition label in Spanish
 */
export const getConditionLabel = (condition) => {
  const labels = {
    nuevo: 'Nuevo',
    poco_uso: 'Poco Uso',
    usado: 'Usado'
  };
  return labels[condition] || condition;
};

/**
 * Get category label in Spanish
 */
export const getCategoryLabel = (category) => {
  const labels = {
    camisas: 'Camisas',
    pantalones: 'Pantalones', 
    vestidos: 'Vestidos',
    zapatos: 'Zapatos',
    chaquetas: 'Chaquetas',
    accesorios: 'Accesorios',
    deportiva: 'Deportiva',
    otro: 'Otro'
  };
  return labels[category] || category;
};

/**
 * Get placeholder image URL
 */
export const getPlaceholderImage = (width = 400, height = 400) => {
  return `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=No+Image`;
};
