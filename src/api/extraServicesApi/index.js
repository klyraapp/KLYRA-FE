/**
 * Extra Services API
 * Handles all extra service-related API calls
 */

import api from "@/utils/axiosMiddleware";

const EXTRA_SERVICES_ENDPOINT = "/extra-services";

export const getExtraServices = () => {
  return api.get(EXTRA_SERVICES_ENDPOINT);
};

export const getExtraServiceById = (id) => {
  return api.get(`${EXTRA_SERVICES_ENDPOINT}/${id}`);
};

export const createExtraService = (data) => {
  return api.post(EXTRA_SERVICES_ENDPOINT, data);
};

export const updateExtraService = (id, data) => {
  return api.patch(`${EXTRA_SERVICES_ENDPOINT}/${id}`, data);
};

export const deleteExtraService = (id) => {
  return api.delete(`${EXTRA_SERVICES_ENDPOINT}/${id}`);
};
