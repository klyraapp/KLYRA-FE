/**
 * PaymentResultStatus Component
 * Renders the appropriate UI panel for each terminal payment state:
 *   - polling  → spinner with status message
 *   - paid     → success confirmation
 *   - failed   → failure message with retry option
 *   - cancelled → cancellation message
 *   - timeout  → timeout message with retry option
 *   - error    → generic error with retry option
 *
 * This component is purely presentational; all logic lives in the page.
 */

import { useTranslation } from "@/hooks/useTranslation";
import { CheckCircleFilled, CloseCircleFilled, WarningFilled } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import styles from './PaymentResultStatus.module.css';

/**
 * @param {{
 *   pollState: string,
 *   pollError: string | null,
 *   onGoToBookings: () => void,
 *   onGoHome: () => void,
 *   onRetry: () => void,
 * }} props
 */
const PaymentResultStatus = ({
  pollState,
  pollError,
  booking,
  onGoToBookings,
  onGoHome,
  onRetry,
}) => {
  const { t } = useTranslation();

  // Extract specific failure reason from booking if available
  const failureReason = booking?.payment?.failureReason ??
    booking?.paymentErrorMessage ??
    booking?.statusMessage ??
    booking?.errorMessage ??
    null;
  if (pollState === 'polling') {
    return (
      <div className={styles.stateContainer}>
        <Spin size="large" />
        <h2 className={styles.title}>{t("bookingFlow.verifyingPayment", { fallback: "Verifying your payment…" })}</h2>
        <p className={styles.subtitle}>
          {t("bookingFlow.mayTakeSeconds", { fallback: "This may take a few seconds. Please do not close this page." })}
        </p>
        {pollError && (
          <p className={styles.errorNote}>
            {pollError} {t("bookingFlow.retryingAutomatically", { fallback: "— retrying automatically." })}
          </p>
        )}
      </div>
    );
  }

  if (pollState === 'paid') {
    const serviceName = booking?.service?.name || "";

    return (
      <div className={styles.stateContainer}>
        <CheckCircleFilled className={styles.iconSuccess} />
        <h2 className={styles.title}>{t("bookingFlow.paymentSuccessful", { fallback: "Payment Successful!" })}</h2>
        <p className={styles.prominentSubtitle}>
          {t("bookingFlow.bookingConfirmed", { 
            serviceName, 
            fallback: `Your ${serviceName || "cleaning"} service is confirmed!` 
          })}
        </p>
        <p className={styles.subtitleNote}>
          {t("bookingFlow.bookingConfirmedSubtitle", { 
            fallback: "You will receive a confirmation email shortly." 
          })}
        </p>
        <div className={styles.actions}>
          <Button
            type="primary"
            className={styles.primaryButton}
            onClick={onGoToBookings}
          >
            {t("bookingFlow.viewMyBookings", { fallback: "View My Bookings" })}
          </Button>
          <Button className={styles.secondaryButton} onClick={onGoHome}>
            {t("bookingFlow.backToHome", { fallback: "Back to Home" })}
          </Button>
        </div>
      </div>
    );
  }

  if (pollState === 'cancelled') {
    return (
      <div className={styles.stateContainer}>
        <WarningFilled className={styles.iconWarning} />
        <h2 className={styles.title}>{t("bookingFlow.paymentCancelled", { fallback: "Payment Cancelled" })}</h2>
        <p className={styles.subtitle}>
          {t("bookingFlow.cancelledPaymentMessage", { fallback: "You cancelled the Vipps payment. Your booking has not been confirmed." })}
        </p>
        <div className={styles.actions}>
          <Button type="primary" className={styles.primaryButton} onClick={onRetry}>
            {t("bookingFlow.tryAgain", { fallback: "Try Again" })}
          </Button>
          <Button className={styles.secondaryButton} onClick={onGoHome}>
            {t("bookingFlow.backToHome", { fallback: "Back to Home" })}
          </Button>
        </div>
      </div>
    );
  }

  if (pollState === 'failed') {
    return (
      <div className={styles.stateContainer}>
        <CloseCircleFilled className={styles.iconError} />
        <h2 className={styles.title}>{t("bookingFlow.paymentFailed", { fallback: "Payment Failed" })}</h2>
        <p className={styles.subtitle}>
          {failureReason ?? t("bookingFlow.paymentFailedMessage", { fallback: "Your payment could not be processed. Please try again or choose a different payment method." })}
        </p>
        <div className={styles.actions}>
          <Button type="primary" className={styles.primaryButton} onClick={onRetry}>
            {t("bookingFlow.tryAgain", { fallback: "Try Again" })}
          </Button>
          <Button className={styles.secondaryButton} onClick={onGoHome}>
            {t("bookingFlow.backToHome", { fallback: "Back to Home" })}
          </Button>
        </div>
      </div>
    );
  }

  // timeout or generic error
  return (
    <div className={styles.stateContainer}>
      <WarningFilled className={styles.iconWarning} />
      <h2 className={styles.title}>
        {pollError === 'UNAUTHORIZED'
          ? t("bookingFlow.sessionExpired", { fallback: "Session Expired" })
          : pollError === 'PENDING_ON_RETURN'
            ? t("bookingFlow.pendingOnReturn", { fallback: "Something went wrong" })
            : t("bookingFlow.verificationTimedOut", { fallback: "Verification Timed Out" })}
      </h2>
      <p className={styles.subtitle}>
        {pollError === 'UNAUTHORIZED'
          ? t("bookingFlow.sessionExpiredMessage", { fallback: "Your session has expired during the payment process. Please log in to view your booking status." })
          : pollError === 'PENDING_ON_RETURN'
            ? t("bookingFlow.pendingOnReturnMessage", { fallback: "Your payment is still pending. If you completed the payment in Vipps, please wait a few moments and check your bookings." })
            : t("bookingFlow.verificationTimedOutMessage", { fallback: "We could not verify your payment status. If you completed the payment in Vipps, please check your bookings — it may still be processing." })}
      </p>
      <div className={styles.actions}>
        {pollError === 'UNAUTHORIZED' ? (
          <Button type="primary" className={styles.primaryButton} onClick={() => window.location.href = '/login'}>
            {t("auth.login", { fallback: "Log In" })}
          </Button>
        ) : (
          <Button type="primary" className={styles.primaryButton} onClick={onGoToBookings}>
            {t("bookingFlow.checkMyBookings", { fallback: "Check My Bookings" })}
          </Button>
        )}
        <Button className={styles.secondaryButton} onClick={onGoHome}>
          {t("bookingFlow.backToHome", { fallback: "Back to Home" })}
        </Button>
      </div>
    </div>
  );
};

export default PaymentResultStatus;
