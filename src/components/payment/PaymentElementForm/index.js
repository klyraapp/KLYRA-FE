/**
 * PaymentElementForm Component
 * Renders Stripe PaymentElement and handles secure payment confirmation
 */

import { useTranslation } from "@/hooks/useTranslation";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Alert, Button, Spin } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./PaymentElementForm.module.css";

const PaymentElementForm = ({
  onSuccess,
  onError,
  bookingId,
  disabled
}) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation?bookingId=${bookingId}`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(
          error.type === "card_error" || error.type === "validation_error"
            ? error.message
            : "An unexpected error occurred. Please try again."
        );
        if (onError) {
          onError(error);
        }
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        if (onSuccess) {
          onSuccess(paymentIntent);
        }
      } else if (paymentIntent && paymentIntent.status === "requires_action") {
        // 3DS or additional authentication required - Stripe handles this automatically
      }
    } catch (err) {
      setErrorMessage("Payment failed. Please try again.");
      if (onError) {
        onError(err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReady = () => {
    setIsReady(true);
  };

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
          options={{
            layout: "tabs",
          }}
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
        {isProcessing
          ? t('bookingFlow.processing', { fallback: 'Behandler... / Processing' })
          : t('bookingFlow.payNowStripe', { fallback: 'Bekreft betaling' })}
      </Button>

      <p className={styles.secureNote}>
        🔒 {t('bookingFlow.securePaymentStripe', { fallback: 'Your payment is secured by Stripe' })}
      </p>
    </form>
  );
};

PaymentElementForm.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  bookingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
};

PaymentElementForm.defaultProps = {
  onSuccess: null,
  onError: null,
  bookingId: null,
  disabled: false,
};

export default PaymentElementForm;
