/**
 * PromoCodeSection Component
 * Expandable promo code input with apply functionality
 */

import { useTranslation } from "@/hooks/useTranslation";
import { Tooltip } from "antd";
import styles from "./PromoCodeSection.module.css";

const PromoCodeSection = ({
  visible,
  value,
  status,
  onToggle,
  onChange,
  onApply,
  onRemove,
  calculation,
  disabled,
}) => {
  const { t } = useTranslation();
  const hasPromoApplied = !!calculation?.promoCodeEntity;

  const renderContent = () => {
    if (!visible && !hasPromoApplied) {
      return (
        <Tooltip
          title={
            disabled ? t("messages.promoOrOfferLimit", { fallback: "You can only apply either a promo code or an offer" }) : ""
          }
          placement="top"
        >
          <div
            className={`${styles.toggleButton} ${disabled ? styles.disabled : ""}`}
            onClick={disabled ? undefined : onToggle}
          >
            <span className={styles.promoText}>
              {t("bookingFlow.promo", { fallback: "Promo Code" })}
            </span>
          </div>
        </Tooltip>
      );
    }

    return (
      <>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder={t('bookingFlow.enterPromoCode', { fallback: 'Enter promo code' })}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.input}
            disabled={hasPromoApplied || disabled}
          />
          {hasPromoApplied ? (
            <button
              onClick={onRemove}
              className={`${styles.applyButton} ${styles.removeButton}`}
              disabled={disabled}
            >
              {t('bookingFlow.remove', { fallback: 'Remove' })}
            </button>
          ) : (
            <button
              onClick={onApply}
              className={styles.applyButton}
              disabled={hasPromoApplied || disabled || !value.trim()}
            >
              {t('bookingFlow.apply', { fallback: 'Apply' })}
            </button>
          )}
        </div>

        {status === "success" && hasPromoApplied && (
          <div className={styles.successMessage}>
            {t('bookingFlow.promoCodeSuccess', { code: value, fallback: `Your promo code ${value} has been successfully applied, and it can be used only once.` })}
          </div>
        )}

        {status === "error" && !hasPromoApplied && (
          <div className={styles.errorMessage}>
            {t('bookingFlow.promoCodeNotFound', { fallback: 'Promo code not found' })}
          </div>
        )}
      </>
    );
  };

  return <div className={styles.container}>{renderContent()}</div>;
};

export default PromoCodeSection;
