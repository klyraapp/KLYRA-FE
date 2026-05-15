/**
 * Payment Service
 * Handles booking creation and payment-related API calls
 */

import api from "@/utils/axiosMiddleware";

const BOOKINGS_ENDPOINT = "/bookings";

/**
 * Creates a booking and initiates payment
 * Returns booking, payment info, and clientSecret for Stripe
 */
export const createBookingWithPayment = async (bookingData, isGuest = false) => {
  try {
    const endpoint = isGuest ? `${BOOKINGS_ENDPOINT}/guest` : BOOKINGS_ENDPOINT;
    const response = await api.post(
      endpoint,
      { ...bookingData, webFlow: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a booking with Vipps as the payment method.
 * Returns the redirectUrl that the frontend must navigate to.
 *
 * @param {Object} bookingData - Full booking payload with paymentMethod: 'VIPPS'
 * @param {boolean} isGuest - Whether the user is a guest
 * @returns {Promise<{ redirectUrl: string, bookingId: string }>}
 * @throws {Error} If the API call fails or redirectUrl is absent
 */
export const createVippsBooking = async (bookingData, isGuest = false) => {
  const endpoint = isGuest ? `${BOOKINGS_ENDPOINT}/guest` : BOOKINGS_ENDPOINT;
  const response = await api.post(
    endpoint,
    { ...bookingData, webFlow: true }
  );

  const data = response.data?.data ?? response.data;
  const redirectUrl = data?.redirectUrl ?? null;
  const bookingId = data?.id ?? data?.bookingId ?? null;

  if (!redirectUrl) {
    throw new Error(
      "Vipps redirect URL was not returned by the server. Cannot proceed with payment."
    );
  }

  return { redirectUrl, bookingId };
};

/**
 * Starts the booking process (alternative endpoint)
 */
export const startBookingProcess = async (bookingData) => {
  try {
    const response = await api.post(
      `${BOOKINGS_ENDPOINT}/start`,
      { ...bookingData, webFlow: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error starting booking process:", error);
    throw error;
  }
};

/**
 * Confirms payment status after Stripe redirect
 */
export const confirmPaymentStatus = async (bookingId, paymentIntentId) => {
  try {
    const response = await api.post(
      `${BOOKINGS_ENDPOINT}/${bookingId}/confirm-payment`,
      { paymentIntentId }
    );
    return response.data;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

/**
 * Gets booking details by ID
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`${BOOKINGS_ENDPOINT}/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};
