/**
 * PaymentMethodSelector Component
 * Radio-style payment method selection. Supports Vipps, Klarna, and Card.
 *
 * Business rules:
 *   - Vipps and Klarna are only available for one-time bookings.
 *   - Recurring bookings hide both (parent passes hiddenMethods accordingly).
 *
 * The list of methods is defined declaratively so adding a new option is a
 * single-config change — no JSX duplication.
 */

import { useTranslation } from "@/hooks/useTranslation";
import { PaymentMethodEnum } from "@/features/vipps";
import { CreditCardOutlined } from "@ant-design/icons";
import { Radio } from "antd";
import styles from "./PaymentMethodSelector.module.css";

/**
 * Descriptor for each payment method option shown in the selector.
 * `render` returns the icon JSX so we keep the markup declarative.
 */
const PAYMENT_METHOD_OPTIONS = [
  {
    id: PaymentMethodEnum.VIPPS,
    labelKey: 'bookingFlow.payWithVipps',
    labelFallback: 'Pay with Vipps',
    renderIcon: () => (
      <img src="/images/vipps.svg" alt="Vipps" className={styles.providerLogo} />
    ),
  },
  {
    id: PaymentMethodEnum.KLARNA,
    labelKey: 'bookingFlow.payWithKlarna',
    labelFallback: 'Pay with Klarna',
    renderIcon: () => (
      <img src="/images/klarna.svg" alt="Klarna" className={styles.providerLogo} />
    ),
  },
  {
    id: PaymentMethodEnum.CARD,
    labelKey: 'bookingFlow.cardPayment',
    labelFallback: 'Card Payment',
    renderIcon: () => <CreditCardOutlined />,
  },
];

const PaymentMethodSelector = ({ selectedMethod, onChange, hiddenMethods = [] }) => {
  const { t } = useTranslation();

  const visibleOptions = PAYMENT_METHOD_OPTIONS.filter(
    (option) => !hiddenMethods.includes(option.id),
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        {t('bookingFlow.choosePaymentMethod', { fallback: 'Choose payment method' })}
      </h3>

      <div className={styles.methodsContainer}>
        {visibleOptions.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <div
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className={`${styles.methodCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => onChange(option.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(option.id);
                }
              }}
            >
              <div className={styles.methodIcon}>{option.renderIcon()}</div>
              <span className={styles.methodLabel}>
                {t(option.labelKey, { fallback: option.labelFallback })}
              </span>
              <Radio checked={isSelected} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
