import { useState, useEffect } from 'react';
import { subscriptionsApi } from '../services/api';

/**
 * Custom hook for subscription management
 * Provides subscription status, limits, and validation functions
 */
export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only load subscription if user is authenticated
    const token = localStorage.getItem('ecotrade_token');
    if (token) {
      loadSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  const loadSubscription = async () => {
    try {
      const [activeSubscription, userLimits] = await Promise.all([
        subscriptionsApi.getActive(),
        subscriptionsApi.getLimits()
      ]);

      setSubscription(activeSubscription);
      setLimits(userLimits);
    } catch (error) {
      console.error('Error loading subscription:', error);
      // If subscription fetch fails (e.g., 401), just set defaults
      setSubscription(null);
      setLimits(null);
    } finally {
      setLoading(false);
    }
  };

  const canPublish = async () => {
    try {
      const response = await subscriptionsApi.canPublish();
      return response.canPublish;
    } catch (error) {
      console.error('Error checking publish permission:', error);
      return false;
    }
  };

  const canFeature = async () => {
    try {
      const response = await subscriptionsApi.canFeature();
      return response.canFeature;
    } catch (error) {
      console.error('Error checking feature permission:', error);
      return false;
    }
  };

  const hasAnalytics = async () => {
    try {
      const response = await subscriptionsApi.hasAnalytics();
      return response.hasAnalytics;
    } catch (error) {
      console.error('Error checking analytics access:', error);
      return false;
    }
  };

  const refresh = () => {
    loadSubscription();
  };

  return {
    subscription,
    limits,
    loading,
    canPublish,
    canFeature,
    hasAnalytics,
    refresh
  };
};
