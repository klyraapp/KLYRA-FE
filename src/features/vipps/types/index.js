/**
 * Payment Feature — Type Constants
 * Shared enums/constants for redirect-based payment flows (Vipps & Klarna).
 *
 * Kept in the `vipps` feature folder for backwards-compatibility with
 * existing imports. New redirect-based Stripe methods (Klarna) are added
 * here because they reuse the same polling/result plumbing.
 */

/** Payment method options for booking payload */
export const PaymentMethodEnum = {
  VIPPS: 'VIPPS',
  CARD: 'CARD',
  KLARNA: 'KLARNA',
};

/**
 * Payment methods that require a full-page browser redirect to an external
 * provider (Vipps hosted page / Klarna hosted checkout). These all share the
 * same polling + result-page plumbing.
 */
export const REDIRECT_PAYMENT_METHODS = [
  PaymentMethodEnum.VIPPS,
  PaymentMethodEnum.KLARNA,
];

/**
 * Payment methods that are only valid for one-time (non-recurring) bookings.
 * Recurring bookings are Card-only because they require a reusable payment
 * method attached to a Customer/Subscription.
 */
export const ONE_TIME_ONLY_PAYMENT_METHODS = [
  PaymentMethodEnum.VIPPS,
  PaymentMethodEnum.KLARNA,
];

/** Booking payment status values returned by the backend */
export const BookingPaymentStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

/** localStorage key for persisting bookingId across a Vipps redirect */
export const VIPPS_BOOKING_ID_KEY = 'vipps_pending_booking_id';

/** localStorage key for persisting bookingId across a Klarna (Stripe) redirect */
export const KLARNA_BOOKING_ID_KEY = 'klarna_pending_booking_id';

/** Polling interval in milliseconds */
export const VIPPS_POLL_INTERVAL_MS = 3000;

/** Maximum number of polling attempts before giving up */
export const VIPPS_MAX_POLL_ATTEMPTS = 40;
