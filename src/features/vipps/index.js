/**
 * Payment Feature — Public Index
 * Barrel export for all public redirect-based payment utilities
 * (Vipps, Klarna — share the same polling + result plumbing).
 */

export { default as PaymentRedirectOverlay } from './components/PaymentRedirectOverlay';
export { default as PaymentResultStatus } from './components/PaymentResultStatus';
export { default as VippsRedirectOverlay } from './components/VippsRedirectOverlay';
export { default as useVippsPolling } from './hooks/useVippsPolling';
export {
  clearKlarnaBookingId,
  clearVippsBookingId,
  fetchBookingStatus,
  persistKlarnaBookingId,
  persistVippsBookingId,
  retrieveKlarnaBookingId,
  retrieveVippsBookingId,
} from './services/vippsService';
export {
  BookingPaymentStatus,
  KLARNA_BOOKING_ID_KEY,
  ONE_TIME_ONLY_PAYMENT_METHODS,
  PaymentMethodEnum,
  REDIRECT_PAYMENT_METHODS,
  VIPPS_BOOKING_ID_KEY,
  VIPPS_MAX_POLL_ATTEMPTS,
  VIPPS_POLL_INTERVAL_MS,
} from './types';
