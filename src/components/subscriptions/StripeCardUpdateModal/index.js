import { useTranslation } from "@/hooks/useTranslation";
import { getStripePromise, STRIPE_APPEARANCE } from "@/lib/stripe";
import { Elements } from '@stripe/react-stripe-js';
import { Modal, Spin } from 'antd';
import { useMemo } from 'react';
import StripeCardUpdate from '../StripeCardUpdate';

const StripeCardUpdateModal = ({ visible, onClose, subscriptionId, onSuccess }) => {
  const { t } = useTranslation();
  const stripePromise = useMemo(() => getStripePromise(), []);

  return (
    <Modal
      title={t("bookingFlow.updatePaymentMethodTitle", { fallback: "Update Payment Method" })}
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {!stripePromise ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '10px' }}>Loading payment system...</p>
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ appearance: STRIPE_APPEARANCE }}>
          <StripeCardUpdate
            subscriptionId={subscriptionId}
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        </Elements>
      )}
    </Modal>
  );
};

export default StripeCardUpdateModal;
