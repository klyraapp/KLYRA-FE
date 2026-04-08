/**
 * Notifications Service
 * Handles API calls for notifications
 */

import api from "@/utils/axiosMiddleware";

const NOTIFICATIONS_ENDPOINT = "/notifications";

export const getNotifications = async (userId, params = {}) => {
  try {
    const response = await api.get(`${NOTIFICATIONS_ENDPOINT}/${userId}`, {
      params
    });
    return response.data || [];
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    console.error("Error fetching notifications:", error);
    throw error;
  }
};
