/**
 * Profile Service
 * Handles API calls for profile data
 */

import api from "@/utils/axiosMiddleware";

export const getProfile = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (userId, data) => {
  try {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
