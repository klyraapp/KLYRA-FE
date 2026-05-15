/**
 * Service Location API Service
 * Handles all service location-related API calls
 */

import api from "@/utils/axiosMiddleware";

const SERVICE_LOCATION_ENDPOINT = "/service-location";

/**
 * Fetches all active service locations.
 * @returns {Promise<Array>} List of active service locations.
 */
export const getActiveServiceLocations = () => {
  return api.get(`${SERVICE_LOCATION_ENDPOINT}/active`);
};
