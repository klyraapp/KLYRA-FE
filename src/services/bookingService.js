/**
 * Service for handling booking-related API calls.
 */

import instance from '@/utils/axiosMiddleware';

const bookingService = {
  /**
   * Fetches the list of bookings for the current user.
   * @returns {Promise<Array>} List of bookings.
   */
  getBookings: async () => {
    try {
      const response = await instance.get('/bookings');
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  /**
   * Fetches the details of a specific booking by ID.
   * @param {string|number} id - The ID of the booking.
   * @returns {Promise<Object>} Booking details.
   */
  getBookingDetails: async (id) => {
    try {
      const response = await instance.get(`/bookings/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error fetching booking details for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Retries the payment for a pending booking.
   * @param {string|number} id - The ID of the booking.
   * @returns {Promise<Object>} Response data.
   */
  retryBookingPayment: async (id) => {
    if (!id) throw new Error("Booking ID is required for retry");
    try {
      const response = await instance.patch(`bookings/${id}/retry-booking-payment`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error retrying booking payment for ID ${id}:`, error);
      throw error;
    }
  },
};

export default bookingService;
