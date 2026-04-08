import useToast from "@/hooks/useToast";
import { useTranslation } from "@/hooks/useTranslation";
import subscriptionService from '@/services/subscriptionService';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from 'antd';
import { useState } from 'react';
import styles from "./StripeCardUpdate.module.css";

const StripeCardUpdate = ({ subscriptionId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      toast.error(error.message); // stripe error
      setLoading(false);
      return;
    }

    try {
      await subscriptionService.updatePaymentMethod(subscriptionId, paymentMethod.id);
      toast.success("messages.paymentMethodUpdated");
      cardElement.clear();
      if (onSuccess) onSuccess();
    } catch (apiError) {
      toast.error("messages.paymentMethodUpdateFailed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.cardElementContainer}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }} />
      </div>
      <div className={styles.actionButtons}>
        <Button onClick={onCancel}>{t("common.cancel", { fallback: "Cancel" })}</Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!stripe}
          className={styles.updateButton}
        >
          {t("buttons.updateCard", { fallback: "Update Card" })}
        </Button>
      </div>
    </form>
  );
};

export default StripeCardUpdate;
