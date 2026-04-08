/**
 * Vipps Feature — Type Constants
 * Defines enums and status constants for the Vipps payment flow.
 */

/** Payment method options for booking payload */
export const PaymentMethodEnum = {
  VIPPS: 'VIPPS',
  CARD: 'CARD',
};

/** Booking payment status values returned by the backend */
export const BookingPaymentStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

/** localStorage key for persisting bookingId across Vipps redirect */
export const VIPPS_BOOKING_ID_KEY = 'vipps_pending_booking_id';

/** Polling interval in milliseconds */
export const VIPPS_POLL_INTERVAL_MS = 3000;

/** Maximum number of polling attempts before giving up */
export const VIPPS_MAX_POLL_ATTEMPTS = 40;
