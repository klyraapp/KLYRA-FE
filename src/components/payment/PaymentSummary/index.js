/**
 * PaymentSummary Component
 * Displays read-only booking price breakdown
 */

import { useTranslation } from "@/hooks/useTranslation";
import { formatExtraServiceName, getExtraServiceTotal } from "@/utils/pricing";
import PropTypes from "prop-types";
import styles from "./PaymentSummary.module.css";

const PaymentSummary = ({ calculation, serviceName, isRecurring, recurringInterval }) => {
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
        <div className={styles.row}>
          <span className={styles.label}>
            {serviceName || t("bookingFlow.baseCleaning", { fallback: "Base Cleaning" })}
            {isRecurring && recurringInterval && (
              <>, {t(`bookingFlow.${recurringInterval.toLowerCase()}`, { fallback: recurringInterval }).toLowerCase()}.</>
            )}
          </span>
          <span className={styles.value}>
            {t('bookingFlow.currencyFormat', { price: priceBreakdown?.basePrice?.toFixed(2) || "0.00", fallback: `NOK ${priceBreakdown?.basePrice?.toFixed(2) || "0.00"}` })}
          </span>
        </div>

        {/* Extra Services */}
        {extras.length > 0 &&
          extras.map((extra, index) => {
            const lineTotal = getExtraServiceTotal(extra);
            const formattedName = formatExtraServiceName(extra, t);

            return (
              <div className={styles.row} key={index}>
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

        {/* Parking Surcharge */}
        {parkingCost > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>
              {t("bookingFlow.parkingSurchargeLabel", {
                fallback: "Parking Surcharge",
              })}
            </span>
            <span className={styles.value}>
              {t('bookingFlow.currencyFormatPlus', { price: parkingCost.toFixed(2), fallback: `+NOK ${parkingCost.toFixed(2)}` })}
            </span>
          </div>
        )}

        {priceBreakdown?.drivingCharges > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>
              {t("bookingFlow.drivingFeeLabel", { fallback: "Driving Fee (One-Time)" })}
            </span>
            <span className={styles.value}>
              {t('bookingFlow.currencyFormatPlus', { price: priceBreakdown.drivingCharges.toFixed(2), fallback: `+NOK ${priceBreakdown.drivingCharges.toFixed(2)}` })}
            </span>
          </div>
        )}

        {/* Pet Surcharge */}
        {petCost > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>
              {t("bookingFlow.petSurchargeLabel", {
                fallback: "Pet Surcharge",
              })}
            </span>
            <span className={styles.value}>
              {t('bookingFlow.currencyFormatPlus', { price: petCost.toFixed(2), fallback: `+NOK ${petCost.toFixed(2)}` })}
            </span>
          </div>
        )}

        {/* weekend Surcharge */}
        {parseFloat(weekendSurchargeAmount) > 0 && (
          <div className={styles.row}>
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
          <div className={styles.row}>
            <span className={styles.discountLabel}>
              {t("table.discount", { fallback: "Discount" })}
            </span>
            <span className={styles.discountValue}>
              {t('bookingFlow.currencyFormatMinus', { price: discountAmount.toFixed(2), fallback: `-NOK ${discountAmount.toFixed(2)}` })}
            </span>
          </div>
        )}

        <div className={styles.divider} />

        {/* Total */}
        <div className={styles.totalRowContainer}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>
              {t("bookingFlow.estimateTotal", { fallback: "Totalbeløp" })}
            </span>
            <span className={styles.totalValue}>
              {t('bookingFlow.currencyFormat', { price: totalAmount?.toFixed(2) || "0.00", fallback: `NOK ${totalAmount?.toFixed(2) || "0.00"}` })}
            </span>
          </div>
          <div className={styles.taxRow}>
            <span className={styles.taxLabel}>
              {t("bookingFlow.vatIncluded", { rate: taxRate, fallback: `Hvorav ${taxRate}% mva` })}
            </span>
            <span className={styles.taxValue}>
              {t('bookingFlow.currencyFormat', { price: taxAmount?.toFixed(2) || "0.00", fallback: `NOK ${taxAmount?.toFixed(2) || "0.00"}` })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentSummary.propTypes = {
  calculation: PropTypes.shape({
    subtotal: PropTypes.number,
    taxRate: PropTypes.number,
    taxAmount: PropTypes.number,
    totalAmount: PropTypes.number,
    discountAmount: PropTypes.number,
    petCost: PropTypes.number,
  }),
  serviceName: PropTypes.string,
  isRecurring: PropTypes.bool,
  recurringInterval: PropTypes.string,
};

PaymentSummary.defaultProps = {
  calculation: null,
  serviceName: "",
};

export default PaymentSummary;
