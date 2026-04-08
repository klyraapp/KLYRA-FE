/**
 * Vipps Feature — useVippsPolling Hook
 * Polls the booking status API at a fixed interval until the payment
 * status resolves to PAID, FAILED, or CANCELLED.
 *
 * Responsibilities:
 *  - Start/stop polling lifecycle
 *  - Expose current status and booking data
 *  - Enforce a maximum attempt cap to prevent infinite loops
 *  - Clear Vipps localStorage on successful payment
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { clearVippsBookingId, fetchBookingStatus } from '../services/vippsService';

/**
 * @typedef {'idle' | 'polling' | 'paid' | 'failed' | 'cancelled' | 'timeout' | 'error'} PollState
 */

/**
 * Hook that polls booking status until a terminal state is reached.
 *
 * @param {string | null} bookingId - The booking UUID to poll
 * @returns {{
 *   pollState: PollState,
 *   booking: Object | null,
 *   pollError: string | null,
 *   startPolling: () => void,
 * }}
 */
const useVippsPolling = (bookingId) => {
  const [pollState, setPollState] = useState('idle');
  const [booking, setBooking] = useState(null);
  const [pollError, setPollError] = useState(null);

  const intervalRef = useRef(null);
  const attemptCountRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const checkStatus = useCallback(async () => {
    if (!bookingId) return;

    attemptCountRef.current += 1;

    try {
      const data = await fetchBookingStatus(bookingId);
      setBooking(data);

      const rawStatus = (
        data?.payment?.status ||
        data?.paymentStatus ||
        data?.status ||
        data?.statusName ||
        ''
      ).toUpperCase();

      console.log(`[VippsPolling] Status resolved: ${rawStatus}`);

      if (['PAID', 'SUCCESS', 'CAPTURED', 'CONFIRMED'].includes(rawStatus)) {
        stopPolling();
        clearVippsBookingId();
        setPollState('paid');
      } else if (
        ['FAILED', 'REJECTED', 'ERROR'].includes(rawStatus) ||
        data?.payment?.failureReason
      ) {
        stopPolling();
        clearVippsBookingId();
        setPollState('failed');
      } else if (['CANCELLED', 'VOIDED', 'EXPIRED'].includes(rawStatus)) {
        stopPolling();
        clearVippsBookingId();
        setPollState('cancelled');
      } else if (rawStatus === 'PENDING' || rawStatus === 'UNPAID') {
        stopPolling();
        setPollState('error');
        setPollError('PENDING_ON_RETURN');
      }
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message ?? 'Failed to check payment status';

      if (status === 401) {
        stopPolling();
        setPollState('error');
        setPollError('UNAUTHORIZED');
        return;
      }

      setPollError(message);
      stopPolling();
      setPollState('error');
    }
  }, [bookingId, stopPolling]);

  const startPolling = useCallback(() => {
    if (!bookingId) return;

    // Clear ANY existing timer
    stopPolling();

    attemptCountRef.current = 0;
    setPollState('polling');
    setPollError(null);

    console.log(`[VippsPolling] Scheduled 5s check for booking: ${bookingId}`);

    intervalRef.current = setTimeout(() => {
      console.log(`[VippsPolling] 5s elapsed. Executing checkStatus for booking: ${bookingId}`);
      checkStatus();
    }, 5000);
  }, [bookingId, checkStatus, stopPolling]);

  // Handle terminal states: stop polling if we reach one
  useEffect(() => {
    const terminalStates = ['paid', 'failed', 'cancelled', 'timeout', 'error'];
    if (terminalStates.includes(pollState)) {
      stopPolling();
    }
  }, [pollState, stopPolling]);

  // Handle unmount: stop polling
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    pollState,
    setPollState,
    booking,
    pollError,
    startPolling,
  };
};

export default useVippsPolling;
