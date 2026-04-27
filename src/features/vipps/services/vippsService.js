/**
 * Vipps Feature — Service Layer
 * Handles all Vipps-specific API interactions and localStorage management.
 * All API calls are centralised here; no component should call the API directly.
 */

import api from '@/utils/axiosMiddleware';
import { KLARNA_BOOKING_ID_KEY, VIPPS_BOOKING_ID_KEY } from '../types';

const BOOKINGS_ENDPOINT = '/bookings';

/**
 * Fetches the current status of a booking by its ID.
 * Used for polling after Vipps redirect.
 *
 * @param {string} bookingId - The booking UUID
 * @returns {Promise<Object>} The booking data object
 * @throws {Error} If the request fails or bookingId is missing
 */
export const fetchBookingStatus = async (bookingId) => {
  if (!bookingId) {
    throw new Error('bookingId is required to fetch booking status');
  }

  try {
    const response = await api.get(`${BOOKINGS_ENDPOINT}/${bookingId}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    // If we get an unauthorized error, we try the guest endpoint variant
    // as some bookings might be created without a persistent user session
    if (error.response?.status === 401) {
      try {
        const guestResponse = await api.get(`${BOOKINGS_ENDPOINT}/guest/${bookingId}`);
        return guestResponse.data?.data ?? guestResponse.data;
      } catch (guestError) {
        // If guest endpoint also fails, re-throw the original 401
        throw error;
      }
    }
    throw error;
  }
};

/**
 * Persists the bookingId in localStorage before redirecting to Vipps.
 * This survives the full-page redirect and allows the result page to
 * retrieve the bookingId on return.
 *
 * @param {string} bookingId - The booking UUID to persist
 */
export const persistVippsBookingId = (bookingId) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VIPPS_BOOKING_ID_KEY, bookingId);
};

/**
 * Retrieves the persisted Vipps bookingId from localStorage.
 *
 * @returns {string | null} The stored bookingId, or null if not found
 */
export const retrieveVippsBookingId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(VIPPS_BOOKING_ID_KEY);
};

/**
 * Clears the Vipps bookingId from localStorage after successful payment.
 */
export const clearVippsBookingId = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(VIPPS_BOOKING_ID_KEY);
};

/**
 * Persists the bookingId in localStorage before redirecting to Klarna.
 * Klarna (via Stripe) also appends `payment_intent_client_secret` to the
 * return URL, but localStorage guarantees we always have the bookingId
 * regardless of how the user gets back (query params stripped, new tab, etc).
 *
 * @param {string} bookingId - The booking UUID to persist
 */
export const persistKlarnaBookingId = (bookingId) => {
  if (typeof window === 'undefined' || !bookingId) return;
  localStorage.setItem(KLARNA_BOOKING_ID_KEY, bookingId);
};

/**
 * Retrieves the persisted Klarna bookingId from localStorage.
 * @returns {string | null} The stored bookingId, or null if not found
 */
export const retrieveKlarnaBookingId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KLARNA_BOOKING_ID_KEY);
};

/**
 * Clears the Klarna bookingId from localStorage after the result page
 * reaches a terminal state.
 */
export const clearKlarnaBookingId = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KLARNA_BOOKING_ID_KEY);
};
