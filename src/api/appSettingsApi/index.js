/**
 * App Settings API Service
 * Handles application-wide settings and configuration
 */

import api from "@/utils/axiosMiddleware";

const SETTINGS_ENDPOINT = "/app-settings";

/**
 * Fetches application settings for a specific location
 * @param {number|string} serviceLocationId
 * @returns {Promise<any[]>}
 */
export const getAppSettings = (serviceLocationId) => {
  return api.get(`/v2${SETTINGS_ENDPOINT}/${serviceLocationId}`);
};

/**
 * Fetches settings for a specific setting name and location
 * @param {string} name - Setting name to fetch (e.g. 'priceSettings')
 * @param {number|string} serviceLocationId
 * @returns {Promise<any>}
 */
export const getAppSettingsByName = async (name, serviceLocationId) => {
  try {
    const res = await getAppSettings(serviceLocationId);
    const settings = Array.isArray(res.data) ? res.data : [];
    return settings.find((s) => s.name === name);
  } catch (error) {
    console.error("Error fetching app settings by name:", error);
    throw error;
  }
};
