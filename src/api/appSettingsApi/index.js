/**
 * App Settings API Service
 * Handles application-wide settings and configuration
 */

import api from "@/utils/axiosMiddleware";

const SETTINGS_ENDPOINT = "/app-settings";

/**
 * Fetches all application settings
 * @returns {Promise<any[]>}
 */
export const getAppSettings = () => {
  return api.get(SETTINGS_ENDPOINT);
};

/**
 * Fetches settings for a specific setting name
 * @param {string} name - Setting name to fetch (e.g. 'priceSettings')
 * @returns {Promise<any>}
 */
export const getAppSettingsByName = async (name) => {
  try {
    const res = await api.get(SETTINGS_ENDPOINT);
    const settings = Array.isArray(res.data) ? res.data : [];
    return settings.find((s) => s.name === name);
  } catch (error) {
    console.error("Error fetching app settings by name:", error);
    throw error;
  }
};
