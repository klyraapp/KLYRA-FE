/**
 * Services API
 * Handles all service-related API calls
 */

import api from "@/utils/axiosMiddleware";

const SERVICES_ENDPOINT = "/services";

export const getServices = (params = {}) => {
  return api.get(SERVICES_ENDPOINT, { params });
};

export const getServicesAdmin = (params = {}) => {
  return api.get(`${SERVICES_ENDPOINT}/admin`, { params });
};

export const getServiceById = (id) => {
  return api.get(`${SERVICES_ENDPOINT}/${id}`);
};

export const createService = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  return api.post(SERVICES_ENDPOINT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateService = (id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  return api.patch(`${SERVICES_ENDPOINT}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteService = (id) => {
  return api.delete(`${SERVICES_ENDPOINT}/${id}`);
};
