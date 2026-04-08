/**
 * Payment Result Page — /payment/result
 *
 * Entry point after Vipps redirects the user back to the frontend.
 * Responsibilities:
 *  1. Resolve bookingId from query params (bookingId / orderId / reference)
 *     or localStorage fallback — whichever is available first.
 *  2. Start polling the booking status API every 3 seconds.
 *  3. Render the appropriate UI for each poll state.
 *  4. Auto-redirect to /bookings on successful payment confirmation.
 */

import HeaderBar from '@/components/BookService/HeaderBar';
import {
  PaymentResultStatus,
  retrieveVippsBookingId,
  useVippsPolling,
} from '@/features/vipps';
import { useGTMPurchaseTracking } from '@/hooks/useGTM';
import { useTranslation } from "@/hooks/useTranslation";
import styles from '@/styles/payment/PaymentResult.module.css';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

const PaymentResultPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  /**
   * Resolve bookingId with a priority chain:
   *  1. ?bookingId=... (our own param embedded in returnUrl)
   *  2. ?orderId=...   (Vipps may append this)
   *  3. ?reference=... (Vipps alternative param name)
   *  4. localStorage   (set before redirect as a reliable fallback)
   */
  const bookingId = useMemo(() => {
    if (!router.isReady) return null;

    const { bookingId: qBookingId, orderId, reference } = router.query;
    return qBookingId ?? orderId ?? reference ?? retrieveVippsBookingId() ?? null;
  }, [router.isReady, router.query]);

  const { pollState, pollError, booking, startPolling } = useVippsPolling(bookingId);

  const purchaseData = useMemo(() => {
    if (!booking) return null;

    return {
      transaction_id: bookingId, // Use consistent ID
      value: parseFloat(booking?.totalAmount || 0),
      currency: booking?.currency || "NOK",
      tax: parseFloat(booking?.taxAmount || 0),
      shipping: 0,
      payment_method: 'vipps',
      items: [
        {
          item_id: booking?.service?.id || 'cleaning-service',
          item_name: booking?.service?.name || 'Cleaning Service',
          price: parseFloat(booking?.subtotal || 0),
          quantity: 1
        }
      ]
    };
  }, [booking, bookingId]);

  useGTMPurchaseTracking(
    pollState === 'paid' && !!booking?.id && !!purchaseData,
    purchaseData
  );

  // Begin polling as soon as bookingId is available.
  useEffect(() => {
    if (router.isReady && bookingId && pollState === 'idle') {
      console.log(`[ResultPage] Triggering startPolling for bookingId: ${bookingId}`);
      startPolling();
    }
  }, [router.isReady, bookingId, pollState, startPolling]);

  const handleGoToBookings = () => {
    router.push('/bookings');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleRetry = () => {
    router.push('/booking/payment');
  };

  return (
    <div className={styles.pageWrapper}>
      <HeaderBar currentStep={6} />

      <div className={styles.pageContainer}>
        {!bookingId ? (
          <div className={styles.noBookingContainer}>
            <p className={styles.noBookingText}>
              {t("bookingFlow.noBookingReference", { fallback: "No booking reference found. Please check your bookings or contact support." })}
            </p>
          </div>
        ) : (
          <PaymentResultStatus
            pollState={pollState}
            pollError={pollError}
            booking={booking}
            onGoToBookings={handleGoToBookings}
            onGoHome={handleGoHome}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentResultPage;
