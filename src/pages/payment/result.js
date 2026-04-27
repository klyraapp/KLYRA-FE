/**
 * Payment Result Page — /payment/result
 *
 * Unified landing page for every redirect-based payment provider. Reached by:
 *   - Vipps:  after the user finishes (or abandons) the Vipps hosted flow.
 *   - Klarna: after Stripe-hosted Klarna sends the user back.
 *
 * Responsibilities:
 *   1. Resolve bookingId from query params or localStorage fallbacks.
 *   2. If Stripe appended `payment_intent_client_secret` (Klarna return),
 *      call `stripe.retrievePaymentIntent` for an immediate status so the
 *      user sees fast feedback without waiting a full poll cycle.
 *   3. Begin polling the authoritative booking status until a terminal state
 *      is reached (backend reconciles against Stripe webhooks).
 *   4. Render the appropriate UI for each poll state via PaymentResultStatus.
 *
 * Why keep polling even after retrievePaymentIntent?
 *   - PI status is the Stripe-side truth; our booking status is the
 *     business-side truth (updated by our backend webhook). Polling guarantees
 *     we don't confirm success to the user before our backend has processed
 *     the payment event.
 */

import HeaderBar from '@/components/BookService/HeaderBar';
import {
  PaymentResultStatus,
  retrieveKlarnaBookingId,
  retrieveVippsBookingId,
  useVippsPolling,
} from '@/features/vipps';
import { useGTMPurchaseTracking } from '@/hooks/useGTM';
import { useTranslation } from '@/hooks/useTranslation';
import { getStripePromise } from '@/lib/stripe';
import styles from '@/styles/payment/PaymentResult.module.css';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

const PaymentResultPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  /**
   * Fast-feedback status derived from `stripe.retrievePaymentIntent` for
   * Klarna returns. Not authoritative — polling is — but lets us show a
   * meaningful message immediately instead of the initial "verifying" spinner.
   */
  const [stripePiStatus, setStripePiStatus] = useState(null);

  /**
   * Resolve bookingId with a priority chain:
   *   1. ?bookingId=...           (our own param)
   *   2. ?orderId= / ?reference=  (Vipps variants)
   *   3. Klarna localStorage      (persisted pre-redirect)
   *   4. Vipps localStorage       (persisted pre-redirect)
   */
  const bookingId = useMemo(() => {
    if (!router.isReady) return null;

    const { bookingId: qBookingId, orderId, reference } = router.query;
    return (
      qBookingId ??
      orderId ??
      reference ??
      retrieveKlarnaBookingId() ??
      retrieveVippsBookingId() ??
      null
    );
  }, [router.isReady, router.query]);

  /**
   * Stripe-specific return query params. Present only when the user is
   * landing here from a Stripe-hosted redirect (Klarna).
   */
  const stripeReturn = useMemo(() => {
    if (!router.isReady) return null;
    const clientSecret = router.query.payment_intent_client_secret;
    if (!clientSecret) return null;
    return {
      clientSecret,
      redirectStatus: router.query.redirect_status ?? null,
    };
  }, [router.isReady, router.query]);

  const { pollState, pollError, booking, startPolling } = useVippsPolling(bookingId);

  /**
   * One-off Stripe PaymentIntent lookup for Klarna returns. Only runs when we
   * have a client_secret in the URL. Failures are non-fatal — polling still
   * drives the authoritative state.
   */
  useEffect(() => {
    if (!stripeReturn?.clientSecret) return;

    let cancelled = false;
    (async () => {
      try {
        const stripe = await getStripePromise();
        if (!stripe || cancelled) return;
        const { paymentIntent } = await stripe.retrievePaymentIntent(
          stripeReturn.clientSecret,
        );
        if (!cancelled && paymentIntent?.status) {
          setStripePiStatus(paymentIntent.status);
        }
      } catch (err) {
        // Fast-path lookup failed; polling will still resolve the final state.
        console.warn('[ResultPage] retrievePaymentIntent failed:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [stripeReturn?.clientSecret]);

  const purchaseData = useMemo(() => {
    if (!booking) return null;

    // Derive payment_method label from the booking — falls back to 'stripe'
    // which covers both Card and Klarna, or 'vipps' where applicable.
    const paymentMethod =
      (booking?.payment?.method || booking?.paymentMethod || '')
        .toString()
        .toLowerCase() || (stripeReturn ? 'stripe' : 'vipps');

    return {
      transaction_id: bookingId,
      value: parseFloat(booking?.totalAmount || 0),
      currency: booking?.currency || 'NOK',
      tax: parseFloat(booking?.taxAmount || 0),
      shipping: 0,
      payment_method: paymentMethod,
      items: [
        {
          item_id: booking?.service?.id || 'cleaning-service',
          item_name: booking?.service?.name || 'Cleaning Service',
          price: parseFloat(booking?.subtotal || 0),
          quantity: 1,
        },
      ],
    };
  }, [booking, bookingId, stripeReturn]);

  useGTMPurchaseTracking(
    pollState === 'paid' && !!booking?.id && !!purchaseData,
    purchaseData,
  );

  useEffect(() => {
    if (router.isReady && bookingId && pollState === 'idle') {
      startPolling();
    }
  }, [router.isReady, bookingId, pollState, startPolling]);

  const handleGoToBookings = () => router.push('/bookings');
  const handleGoHome = () => router.push('/');
  const handleRetry = () => router.push('/booking/payment');

  /**
   * Combined poll state: if Stripe already told us the PI failed or was
   * cancelled, surface that immediately instead of showing the generic
   * "Verifying your payment…" spinner — polling will confirm it shortly.
   * A succeeded PI does NOT short-circuit: we still wait for our backend
   * to register the payment before claiming success.
   */
  const effectivePollState = useMemo(() => {
    if (pollState === 'paid' || pollState === 'failed' || pollState === 'cancelled') {
      return pollState;
    }
    if (pollState === 'polling' || pollState === 'idle') {
      if (stripePiStatus === 'requires_payment_method') return 'failed';
      if (stripeReturn?.redirectStatus === 'failed') return 'failed';
    }
    return pollState;
  }, [pollState, stripePiStatus, stripeReturn?.redirectStatus]);

  return (
    <div className={styles.pageWrapper}>
      <HeaderBar currentStep={6} />

      <div className={styles.pageContainer}>
        {!bookingId ? (
          <div className={styles.noBookingContainer}>
            <p className={styles.noBookingText}>
              {t('bookingFlow.noBookingReference', {
                fallback:
                  'No booking reference found. Please check your bookings or contact support.',
              })}
            </p>
          </div>
        ) : (
          <PaymentResultStatus
            pollState={effectivePollState}
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
