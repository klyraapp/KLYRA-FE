/**
 * Subscriptions API Service
 * Handles all subscription-related API calls
 */

import api from "@/utils/axiosMiddleware";

const SUBSCRIPTION_ENDPOINT = "/subscription";

export const getSubscriptions = (params = {}) => {
  return api.get(SUBSCRIPTION_ENDPOINT, { params });
};

export const updatePaymentMethod = (subscriptionId, paymentMethodId) => {
  return api.patch(`${SUBSCRIPTION_ENDPOINT}/${subscriptionId}/payment-method`, { paymentMethodId });
};
