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
