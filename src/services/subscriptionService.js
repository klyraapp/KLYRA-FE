/**
 * Service for handling subscription-related API calls.
 */

import instance from '@/utils/axiosMiddleware';

const subscriptionService = {
  /**
   * Fetches the list of subscriptions for the current user.
   * @returns {Promise<Array>} List of subscriptions.
   */
  getSubscriptions: async () => {
    try {
      const response = await instance.get('/subscription');
      return response.data?.[0] || response.data?.data?.[0] || [];
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },

  /**
   * Updates the payment method for a subscription.
   * @param {number|string} id - The ID of the subscription.
   * @param {string} paymentMethodId - The new payment method ID from Stripe.
   * @returns {Promise<Object>} Response object.
   */
  updatePaymentMethod: async (id, paymentMethodId) => {
    try {
      const response = await instance.patch(`/subscription/${id}/payment-method`, {
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating payment method for subscription ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetches specific subscription details.
   */
  getSubscriptionDetails: async (id) => {
    try {
      const response = await instance.get(`/subscription/${id}`);
      const data = response.data;
      
      // Map new structure to existing structure expected by components
      return {
        ...data,
        areaSqm: data.areaSqm || data.lastBookingAreaSqm,
        extraServices: data.associatedService?.extraServices || data.extraServices || [],
        service: data.associatedService || data.service
      };
    } catch (error) {
      console.error(`Error fetching subscription ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Updates subscription details (area, extras, recurring flag).
   */
  updateSubscription: async (id, data) => {
    try {
      const response = await instance.patch(`/subscription/${id}/update-subscriptions-future-bookings`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating subscription ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Resumes an expired subscription.
   * @param {number|string} id - The ID of the subscription.
   * @returns {Promise<Object>} Response object.
   */
  resumeSubscription: async (id) => {
    try {
      const response = await instance.patch(`/subscription/${id}/resume-subscription`);
      return response.data;
    } catch (error) {
      console.error(`Error resuming subscription ID ${id}:`, error);
      throw error;
    }
  },
};

export default subscriptionService;
