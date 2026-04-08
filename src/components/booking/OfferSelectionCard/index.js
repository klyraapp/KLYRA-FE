/**
 * OfferSelectionCard Component
 * Displays available offers with selection capability
 */

import { useTranslation } from "@/hooks/useTranslation";
import { TagOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import styles from "./OfferSelectionCard.module.css";

const OfferSelectionCard = ({
  offers,
  selectedOfferId,
  onSelect,
  disabled,
}) => {
  const { t } = useTranslation();
  if (!offers || offers.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('bookingFlow.availableOffers', { fallback: 'Available Offers' })}</h3>

      <div className={styles.offersList}>
        {Array.isArray(offers) && offers.map((offer) => {
          if (!offer) return null;
          const isSelected = selectedOfferId === offer.id;

          let discountText = "";
          let savedAmount = "";

          const discountValue = offer.discountValue || 0;
          if (offer.discountType === "PERCENTAGE") {
            discountText = `${discountValue}% off`;
            savedAmount = `${discountValue}%`;
          } else {
            discountText = `NOK ${discountValue} off`;
            savedAmount = `NOK ${discountValue}`;
          }

          const offerCode = (offer.name || "OFFER").toUpperCase().replace(/\s+/g, "");

          const offerCard = (
            <div
              key={offer.id || Math.random()}
              className={`${styles.offerCard} ${isSelected ? styles.selected : ""} ${disabled ? styles.disabled : ""}`}
              onClick={disabled ? undefined : () => onSelect(offer.id)}
            >
              <div className={styles.offerIcon}>
                <TagOutlined />
              </div>

              <div className={styles.offerContent}>
                <div className={styles.offerHeader}>
                  <span className={styles.offerName}>{offer.name || "Offer"}</span>
                  {isSelected && (
                    <span className={styles.appliedBadge}>
                      {t('bookingFlow.applied', { fallback: 'Applied' })}
                    </span>
                  )}
                </div>
                <div className={styles.offerDescription}>
                  {t('bookingFlow.youSave', {
                    amount: savedAmount,
                    discount: discountText,
                    code: offerCode,
                    fallback: `You save ${savedAmount} (${discountText}) Code: ${offerCode}`
                  })}
                </div>
              </div>
            </div>
          );

          if (disabled) {
            return (
              <Tooltip
                key={offer.id || Math.random()}
                title={t("messages.promoOrOfferLimit", { fallback: "You can only apply either a promo code or an offer" })}
                placement="top"
              >
                {offerCard}
              </Tooltip>
            );
          }

          return offerCard;
        })}
      </div>
    </div>
  );
};

export default OfferSelectionCard;
