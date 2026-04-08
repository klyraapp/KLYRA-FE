/**
 * PaymentMethodSelector Component
 * Radio-style payment method selection (Vipps/Card)
 */

import { useTranslation } from "@/hooks/useTranslation";
import { CreditCardOutlined } from "@ant-design/icons";
import { Radio } from "antd";
import styles from "./PaymentMethodSelector.module.css";

const PaymentMethodSelector = ({ selectedMethod, onChange, hiddenMethods = [] }) => {
  const { t } = useTranslation();
  const showVipps = !hiddenMethods.includes("VIPPS");
  const showCard = !hiddenMethods.includes("CARD");

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('bookingFlow.choosePaymentMethod', { fallback: 'Choose payment method' })}</h3>

      <div className={styles.methodsContainer}>
        {showVipps && (
          <div
            className={`${styles.methodCard} ${selectedMethod === "VIPPS" ? styles.selected : ""}`}
            onClick={() => onChange("VIPPS")}
          >
            <div className={styles.methodIcon}>
              <img src="/images/vipps.svg" alt="Vipps" className={styles.vippsLogo} />
            </div>
            <span className={styles.methodLabel}>{t('bookingFlow.payWithVipps', { fallback: 'Pay with Vipps' })}</span>
            <Radio checked={selectedMethod === "VIPPS"} />
          </div>
        )}

        {showCard && (
          <div
            className={`${styles.methodCard} ${selectedMethod === "CARD" ? styles.selected : ""}`}
            onClick={() => onChange("CARD")}
          >
            <div className={styles.methodIcon}>
              <CreditCardOutlined />
            </div>
            <span className={styles.methodLabel}>{t('bookingFlow.cardPayment', { fallback: 'Card Payment' })}</span>
            <Radio checked={selectedMethod === "CARD"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
