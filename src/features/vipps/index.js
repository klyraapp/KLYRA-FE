/**
 * Vipps Feature — Public Index
 * Barrel export for all public Vipps feature exports.
 */

export { default as PaymentResultStatus } from './components/PaymentResultStatus';
export { default as VippsRedirectOverlay } from './components/VippsRedirectOverlay';
export { default as useVippsPolling } from './hooks/useVippsPolling';
export {
  clearVippsBookingId, fetchBookingStatus,
  persistVippsBookingId,
  retrieveVippsBookingId
} from './services/vippsService';
export {
  BookingPaymentStatus, PaymentMethodEnum, VIPPS_BOOKING_ID_KEY, VIPPS_MAX_POLL_ATTEMPTS, VIPPS_POLL_INTERVAL_MS
} from './types';

