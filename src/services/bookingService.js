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
};

export default bookingService;
