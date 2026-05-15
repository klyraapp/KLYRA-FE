/**
 * PaymentElementForm Component
 *
 * Single reusable Stripe PaymentElement form. Works for every Stripe payment
 * method that our PaymentIntent allows — Card (no redirect), Klarna (redirect),
 * and anything else Stripe enables in the future.
 *
 * Why a single component handles both sync (Card) and redirect (Klarna) flows:
 *   - `stripe.confirmPayment({ ..., redirect: "if_required" })` is the canonical
 *     Stripe pattern: methods that can settle synchronously (cards) resolve the
 *     promise locally; methods that require a hosted page (Klarna/iDEAL/etc.)
 *     perform a full-page redirect to the return URL automatically.
 *   - Parents pass a `returnUrl` that's valid for either case. For redirect
 *     methods the parent should also use `onRedirecting` to show a branded
 *     overlay while the browser is navigating away.
 *
 * Props (all optional except the Stripe context from <Elements>):
 *   onSuccess        - Fired when a sync-settled payment succeeds (Cards).
 *                      Not called for redirect methods; the return URL page is.
 *   onError          - Fired on confirmPayment error (validation / decline).
 *   onRedirecting    - Fired the moment Stripe is about to redirect the browser
 *                      to an external provider. Use this to show a full-screen
 *                      "Redirecting to …" overlay. The promise never resolves
 *                      on that path — the browser navigates away.
 *   bookingId        - Appended to the default return URL for identification.
 *   returnUrl        - Full URL Stripe should return the user to after redirect
 *                      methods. Defaults to /booking/confirmation?bookingId=...
 *                      which is only used for Cards (unused, but kept for back-
 *                      compat). Pass /payment/result?bookingId=... for Klarna
 *                      so the result page can poll + reconcile.
 *   billingDetails   - Object matching Stripe's PaymentMethodData.billing_details
 *                      shape. REQUIRED for Klarna (name, email, address.country).
 *                      Stripe merges this into whichever method the user picks.
 *   submitLabel      - Optional override for the primary button copy.
 *   processingLabel  - Optional override for the loading button copy.
 *   disabled         - External disabled flag.
 */

import { useTranslation } from "@/hooks/useTranslation";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Alert, Button, Spin } from "antd";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import styles from "./PaymentElementForm.module.css";

const PaymentElementForm = ({
  onSuccess,
  onError,
  onRedirecting,
  notifyRedirectOnSubmit,
  bookingId,
  returnUrl,
  billingDetails,
  submitLabel,
  processingLabel,
  disabled,
}) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const submissionLockRef = useRef(false);

  /**
   * Build the return URL passed to Stripe. Consumers can fully override it;
   * otherwise we fall back to the legacy confirmation URL (only meaningful for
   * methods that actually redirect — Cards never use it).
   */
  const resolveReturnUrl = () => {
    if (returnUrl) return returnUrl;
    return `${window.location.origin}/booking/confirmation?bookingId=${bookingId ?? ''}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Hard guard against accidental double-submit (double click, Enter key
    // spam, or race before React state disables the button).
    if (submissionLockRef.current || isProcessing || disabled) {
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    submissionLockRef.current = true;
    setIsProcessing(true);
    setErrorMessage(null);

    // Stripe-recommended pre-submit step for the Payment Element.
    // This validates element data (and any required internal state) before
    // attempting PaymentIntent confirmation. If this fails, confirmPayment is
    // never called.
    const { error: elementSubmitError } = await elements.submit();
    if (elementSubmitError) {
      const elementErrorMessage =
        elementSubmitError.message ||
        t("messages.paymentFailed", {
          fallback: "Payment failed. Please try again.",
        });
      setErrorMessage(elementErrorMessage);
      if (onError) onError(elementSubmitError);
      setIsProcessing(false);
      submissionLockRef.current = false;
      return;
    }

    // Only attach payment_method_data if the parent actually supplied billing
    // details. Stripe rejects empty objects for some methods, so we omit the
    // key entirely when there is nothing to send.
    const paymentMethodData =
      billingDetails && Object.keys(billingDetails).length > 0
        ? { billing_details: billingDetails }
        : undefined;

    const confirmParams = {
      return_url: resolveReturnUrl(),
      ...(paymentMethodData ? { payment_method_data: paymentMethodData } : {}),
    };

    // Notify parent that a redirect-based confirmation is about to start.
    // For Klarna, stripe.confirmPayment may cause browser navigation before
    // a response body is visible in devtools; that is expected behavior.
    if (notifyRedirectOnSubmit && onRedirecting) {
      onRedirecting();
    }

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams,
        redirect: "if_required",
      });

      if (error) {
        const userFacingMessage =
          error.type === "card_error" || error.type === "validation_error"
            ? error.message
            : t("messages.paymentUnexpectedError", {
                fallback: "An unexpected error occurred. Please try again.",
              });
        setErrorMessage(userFacingMessage);
        if (onError) onError(error);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        if (onSuccess) onSuccess(paymentIntent);
      } else if (paymentIntent && paymentIntent.status === "requires_action") {
        // 3DS / additional authentication — Stripe handles automatically.
      }
      // Note: for redirect-based methods (Klarna, iDEAL, …) Stripe navigates
      // away before this promise ever resolves. Any code placed after this
      // line will not execute on that path.
    } catch (err) {
      setErrorMessage(
        t("messages.paymentFailed", {
          fallback: "Payment failed. Please try again.",
        }),
      );
      if (onError) onError(err);
    } finally {
      setIsProcessing(false);
      submissionLockRef.current = false;
    }
  };

  const handleReady = () => setIsReady(true);

  const buttonLabel = isProcessing
    ? processingLabel ??
      t("bookingFlow.processing", {
        fallback: "Behandler... / Processing",
      })
    : submitLabel ??
      t("bookingFlow.payNowStripe", { fallback: "Bekreft betaling" });

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.paymentElementContainer}>
        {!isReady && (
          <div className={styles.loadingOverlay}>
            <Spin size="default" />
          </div>
        )}
        <PaymentElement
          onReady={handleReady}
          options={{ layout: "tabs" }}
        />
      </div>

      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          showIcon
          className={styles.errorAlert}
        />
      )}

      <Button
        type="primary"
        htmlType="submit"
        className={styles.submitButton}
        loading={isProcessing}
        disabled={!stripe || !elements || !isReady || disabled || isProcessing}
        block
      >
        {buttonLabel}
      </Button>

      <p className={styles.secureNote}>
        🔒{' '}
        {t("bookingFlow.securePaymentStripe", {
          fallback: "Your payment is secured by Stripe",
        })}
      </p>
    </form>
  );
};

PaymentElementForm.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onRedirecting: PropTypes.func,
  notifyRedirectOnSubmit: PropTypes.bool,
  bookingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  returnUrl: PropTypes.string,
  billingDetails: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.shape({
      line1: PropTypes.string,
      line2: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      postal_code: PropTypes.string,
      country: PropTypes.string,
    }),
  }),
  submitLabel: PropTypes.string,
  processingLabel: PropTypes.string,
  disabled: PropTypes.bool,
};

PaymentElementForm.defaultProps = {
  onSuccess: null,
  onError: null,
  onRedirecting: null,
  notifyRedirectOnSubmit: false,
  bookingId: null,
  returnUrl: null,
  billingDetails: null,
  submitLabel: null,
  processingLabel: null,
  disabled: false,
};

export default PaymentElementForm;
