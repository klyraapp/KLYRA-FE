/**
 * Review Service
 * Handles API calls for booking reviews
 */

import api from "@/utils/axiosMiddleware";

export const createReview = async (bookingId, data) => {
  try {
    const response = await api.post(`/reviews/bookings/${bookingId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};
