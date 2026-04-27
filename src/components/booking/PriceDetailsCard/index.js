/**
 * PriceDetailsCard Component
 * Displays price breakdown with tax and total
 */

import { useTranslation } from "@/hooks/useTranslation";
import { formatExtraServiceName, getExtraServiceTotal } from "@/utils/pricing";
import styles from "./PriceDetailsCard.module.css";

const PriceDetailsCard = ({ calculation, loading, serviceName, isRecurring, recurringInterval }) => {
  const { t } = useTranslation();

  if (!calculation) return null;

  const {
    subtotal,
    taxRate,
    taxAmount,
    totalAmount,
    discountAmount,
    priceBreakdown,
    parkingCost,
    petCost,
    weekendSurcharge,
  } = calculation;

  const extras = priceBreakdown?.extras || [];
  const surcharges = priceBreakdown?.surcharges || {};
  const weekendSurchargeAmount = calculation?.surcharges?.weekendSurcharge || surcharges?.weekendSurcharge || weekendSurcharge;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        {t("bookingFlow.priceDetails", { fallback: "Price Details" })}
      </h3>

      <div className={styles.content}>
        {/* Base Price */}
        <div className={styles.priceRow}>
          <span className={styles.label}>
            {serviceName || t("bookingFlow.baseCleaning", { fallback: "Base Cleaning" })}
            {isRecurring && recurringInterval && (
              <>, {t(`bookingFlow.${recurringInterval.toLowerCase()}`, { fallback: recurringInterval }).toLowerCase()}.</>
            )}
          </span>
          <span className={styles.value}>
            {t('bookingFlow.currencyFormat', { price: parseFloat(priceBreakdown?.basePrice || 0).toFixed(2), fallback: `NOK ${parseFloat(priceBreakdown?.basePrice || 0).toFixed(2)}` })}
          </span>
        </div>

        {/* Extras */}
        {Array.isArray(extras) && extras.length > 0 &&
          extras.map((extra, index) => {
            const lineTotal = getExtraServiceTotal(extra);
            const formattedName = formatExtraServiceName(extra, t);

            return (
              <div className={styles.priceRow} key={extra?.id || index}>
                <span className={styles.label}>{formattedName}</span>
                <span className={styles.value}>
                  {t('bookingFlow.currencyFormatPlus', {
                    price: lineTotal.toFixed(2),
                    fallback: `+NOK ${lineTotal.toFixed(2)}`
                  })}
                </span>
              </div>
            );
          })}

        {/* Surcharges */}
        {parkingCost > 0 && (
          <div className={styles.priceRow}>
            <span className={styles.label}>
              {t("bookingFlow.parkingSurchargeLabel", {
                fallback: "Parking Surcharge",
              })}
            </span>
            <span className={styles.value}>
              {t('bookingFlow.currencyFormatPlus', { price: parseFloat(parkingCost || 0).toFixed(2), fallback: `+NOK ${parseFloat(parkingCost || 0).toFixed(2)}` })}
            </span>
          </div>
        )}

        {priceBreakdown?.drivingCharges > 0 && (
          <div className={styles.priceRow}>
            <span className={styles.label}>
              {t("bookingFlow.drivingFeeLabel", { fallback: "Driving Fee (One-Time)" })}
            </span>
            <span className={styles.value}>
              {t('bookingFlow.currencyFormatPlus', { price: parseFloat(priceBreakdown?.drivingCharges || 0).toFixed(2), fallback: `+NOK ${parseFloat(priceBreakdown?.drivingCharges || 0).toFixed(2)}` })}
            </span>
          </div>
        )}

        {petCost > 0 && (
          <div className={styles.priceRow}>
            <span className={styles.label}>
              {t("bookingFlow.petSurchargeLabel", {
                fallback: "Pet Surcharge",
              })}
            </span>
            <span className={styles.value}>
              {t('bookingFlow.currencyFormatPlus', { price: parseFloat(petCost || 0).toFixed(2), fallback: `+NOK ${parseFloat(petCost || 0).toFixed(2)}` })}
            </span>
          </div>
        )}

        {parseFloat(weekendSurchargeAmount) > 0 && (
          <div className={styles.priceRow}>
            <span className={styles.label}>
              {t("bookingFlow.weekendSurchargeLabel", {
                fallback: "Weekend Surcharge",
              })}
            </span>
            <span className={styles.value}>
              {t('bookingFlow.currencyFormatPlus', { price: parseFloat(weekendSurchargeAmount || 0).toFixed(2), fallback: `+NOK ${parseFloat(weekendSurchargeAmount || 0).toFixed(2)}` })}
            </span>
          </div>
        )}

        {/* Discount */}
        {discountAmount > 0 && (
          <div className={styles.priceRow}>
            <span className={styles.labelDiscount}>
              {t("table.discount", { fallback: "Discount" })}
            </span>
            <span className={styles.valueDiscount}>
              {t('bookingFlow.currencyFormatMinus', { price: parseFloat(discountAmount || 0).toFixed(2), fallback: `-NOK ${parseFloat(discountAmount || 0).toFixed(2)}` })}
            </span>
          </div>
        )}

        <div className={styles.divider} />

        <div className={styles.totalRowContainer}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>
              {t("bookingFlow.estimateTotal", { fallback: "Totalbeløp" })}
            </span>
            <span className={styles.totalValue}>
              {t('bookingFlow.currencyFormat', { price: parseFloat(totalAmount || 0).toFixed(2), fallback: `NOK ${parseFloat(totalAmount || 0).toFixed(2)}` })}
            </span>
          </div>
          <div className={styles.taxRow}>
            <span className={styles.taxLabel}>
              {t("bookingFlow.vatIncluded", { rate: taxRate, fallback: `Hvorav ${taxRate}% mva` })}
            </span>
            <span className={styles.taxValue}>
              {t('bookingFlow.currencyFormat', { price: parseFloat(taxAmount || 0).toFixed(2), fallback: `NOK ${parseFloat(taxAmount || 0).toFixed(2)}` })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDetailsCard;
