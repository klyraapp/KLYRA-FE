/**
 * Booking Details Page
 * Displays full information about a specific booking and — for PENDING
 * bookings — lets the user retry the Stripe payment (Card or Klarna).
 *
 * Retry architecture:
 *   - Backend `/bookings/:id/retry-booking-payment` returns a fresh Stripe
 *     `clientSecret` for the SAME payment method the booking was originally
 *     created with.
 *   - We render the shared StripeProvider + PaymentElementForm inside a Modal.
 *   - For Card, `confirmPayment({ redirect: 'if_required' })` settles locally.
 *   - For Klarna, Stripe full-page-redirects to Klarna, then back to
 *     /payment/result?bookingId=<id> where our polling hook reconciles status.
 *
 * This reuses 100% of the existing Stripe plumbing — no new payment or retry
 * components are introduced.
 */

import BookingDetailSection from '@/components/bookings/BookingDetailSection';
import BookingsLayout from '@/components/bookings/BookingsLayout';
import PriceDetails from '@/components/bookings/PriceDetails';
import PrimaryNavigationButtons from '@/components/common/Booking/PrimaryNavigationButtons';
import PaymentElementForm from '@/components/payment/PaymentElementForm';
import StripeProvider from '@/components/payment/StripeProvider';
import {
  PaymentMethodEnum,
  PaymentRedirectOverlay,
  persistKlarnaBookingId,
} from '@/features/vipps';
import useToast from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import bookingService from '@/services/bookingService';
import styles from '@/styles/bookings/BookingDetailPage.module.css';
import { Alert, Modal, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ISO_COUNTRY_BY_NAME = {
  NORWAY: 'NO',
  SWEDEN: 'SE',
  DENMARK: 'DK',
  FINLAND: 'FI',
  GERMANY: 'DE',
  FRANCE: 'FR',
  NETHERLANDS: 'NL',
  BELGIUM: 'BE',
  AUSTRIA: 'AT',
  SWITZERLAND: 'CH',
  SPAIN: 'ES',
  ITALY: 'IT',
  PORTUGAL: 'PT',
  POLAND: 'PL',
  CZECHIA: 'CZ',
  GREECE: 'GR',
  IRELAND: 'IE',
  ROMANIA: 'RO',
  'UNITED KINGDOM': 'GB',
  UK: 'GB',
  'GREAT BRITAIN': 'GB',
  'UNITED STATES': 'US',
  USA: 'US',
  CANADA: 'CA',
  AUSTRALIA: 'AU',
  'NEW ZEALAND': 'NZ',
};

const normalizeCountryCode = (country) => {
  if (!country) return 'NO';
  const trimmed = String(country).trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  return ISO_COUNTRY_BY_NAME[trimmed.toUpperCase()] || 'NO';
};

/**
 * Extracts a canonical payment method identifier from any of the plausible
 * shapes the backend may use for the field (it's evolved over time across
 * subscriptions, bookings, and legacy records).
 */
const resolveBookingPaymentMethod = (booking) => {
  const raw =
    booking?.paymentMethod ||
    booking?.payment?.method ||
    booking?.payment?.methodName ||
    booking?.payment?.type ||
    null;

  if (!raw) return null;
  const upper = String(raw).toUpperCase();
  if (upper.includes('KLARNA')) return PaymentMethodEnum.KLARNA;
  if (upper.includes('VIPPS')) return PaymentMethodEnum.VIPPS;
  return PaymentMethodEnum.CARD;
};

/**
 * Builds the Stripe billing_details object for Klarna retry from the booking
 * record. Klarna requires at minimum `name`, `email`, and `address.country`.
 */
const buildBillingDetailsFromBooking = (booking) => {
  if (!booking) return null;

  const name =
    [booking.contactFirstName, booking.contactLastName]
      .filter(Boolean)
      .join(' ')
      .trim() || undefined;

  return {
    name,
    email: booking.contactEmail || undefined,
    phone: booking.contactPhone || undefined,
    address: {
      line1: booking.serviceStreetAddress || undefined,
      city: booking.serviceCity || undefined,
      postal_code: booking.servicePostalCode || undefined,
      country: normalizeCountryCode(booking.serviceCountry),
    },
  };
};

const BookingDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryLoading, setRetryLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isRedirectingToKlarna, setIsRedirectingToKlarna] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const fetchBookingDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingService.getBookingDetails(id);
      setBooking(data);
    } catch (err) {
      console.error('Failed to fetch booking details:', err);
      setError('Could not load booking details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchBookingDetails();
  }, [id, fetchBookingDetails]);

  const paymentMethod = useMemo(
    () => resolveBookingPaymentMethod(booking),
    [booking],
  );
  const isKlarnaRetry = paymentMethod === PaymentMethodEnum.KLARNA;

  /**
   * Stripe config for the retry form. Klarna needs a return URL that lands on
   * the result page (for polling) and billing details built from the booking.
   * Card retries use the default — the return URL is never actually visited
   * because Cards don't redirect.
   */
  const stripeFormConfig = useMemo(() => {
    if (!isKlarnaRetry) return { returnUrl: undefined, billingDetails: undefined };

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return {
      returnUrl: `${origin}/payment/result?bookingId=${id ?? ''}`,
      billingDetails: buildBillingDetailsFromBooking(booking),
    };
  }, [isKlarnaRetry, booking, id]);

  const handleRetryPayment = async () => {
    if (!id) {
      toast.error(t('messages.bookingIdMissing', { fallback: 'Booking ID is missing' }));
      return;
    }
    setRetryLoading(true);
    try {
      const response = await bookingService.retryBookingPayment(id);

      const secret =
        response?.client_secret ||
        response?.clientSecret ||
        response?.payment?.clientSecret ||
        response?.intent?.client_secret;

      if (secret) {
        setClientSecret(secret);
        setIsPaymentModalVisible(true);
      } else {
        console.error('No client secret found in response:', response);
        toast.error(
          t('messages.paymentRetryFailed', {
            fallback: 'Failed to initiate payment retry. No secret received.',
          }),
        );
      }
    } catch (err) {
      console.error('Failed to retry payment:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Network error';
      toast.error(
        `${t('messages.paymentRetryFailed', { fallback: 'Failed to retry payment' })}: ${errorMessage}`,
      );
    } finally {
      setRetryLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsRedirectingToKlarna(false);
    setIsPaymentModalVisible(false);
    setClientSecret(null);
    toast.success(t('bookingFlow.paymentSuccessful', { fallback: 'Payment successful!' }));
    fetchBookingDetails();
  };

  const handlePaymentError = (err) => {
    setIsRedirectingToKlarna(false);
    toast.error(
      err?.message || t('messages.paymentFailed', { fallback: 'Payment failed. Please try again.' }),
    );
  };

  /**
   * Klarna redirect is imminent — persist bookingId for the result page and
   * show the Klarna-branded overlay so the user isn't confused about the
   * brief white-screen while the browser navigates to Klarna.
   */
  const handleStripeRedirecting = () => {
    if (!isKlarnaRetry) return;
    if (id) persistKlarnaBookingId(String(id));
    setIsRedirectingToKlarna(true);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className={styles.errorContainer}>
        <Alert message="Error" description={error || 'Booking not found'} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {isRedirectingToKlarna && <PaymentRedirectOverlay provider="klarna" />}

      <div className={styles.contentSection}>
        {booking.status === 'PENDING' && booking.payment?.failureReason && (
          <div className={styles.alertContainer} style={{ marginBottom: '24px' }}>
            <Alert
              message={t('bookingFlow.paymentFailed', { fallback: 'Payment Failed' })}
              description={booking.payment.failureReason}
              type="error"
              showIcon
            />
          </div>
        )}
        <div className={styles.detailsContainer}>
          <BookingDetailSection booking={booking} />
          <PriceDetails booking={booking} />
        </div>

        {booking.status === 'PENDING' && (
          <div style={{ marginTop: '24px' }}>
            <PrimaryNavigationButtons
              onBack={() => router.back()}
              onNext={handleRetryPayment}
              nextLoading={retryLoading}
              nextText={t('buttons.retry', { fallback: 'Retry' })}
            />
          </div>
        )}
      </div>

      <Modal
        title={
          isKlarnaRetry
            ? t('bookingFlow.confirmKlarnaPayment', { fallback: 'Confirm Klarna Payment' })
            : t('bookingFlow.completePayment', { fallback: 'Fullfør betaling' })
        }
        open={isPaymentModalVisible}
        onCancel={() => {
          setIsRedirectingToKlarna(false);
          setIsPaymentModalVisible(false);
        }}
        footer={null}
        destroyOnClose
        width={500}
      >
        {clientSecret && (
          <StripeProvider clientSecret={clientSecret}>
            <PaymentElementForm
              bookingId={id}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onRedirecting={handleStripeRedirecting}
              notifyRedirectOnSubmit={isKlarnaRetry}
              returnUrl={stripeFormConfig.returnUrl}
              billingDetails={stripeFormConfig.billingDetails}
              submitLabel={
                isKlarnaRetry
                  ? t('bookingFlow.payWithKlarna', { fallback: 'Pay with Klarna' })
                  : undefined
              }
            />
          </StripeProvider>
        )}
      </Modal>
    </div>
  );
};

BookingDetailPage.getLayout = (page) => <BookingsLayout>{page}</BookingsLayout>;

export default BookingDetailPage;
