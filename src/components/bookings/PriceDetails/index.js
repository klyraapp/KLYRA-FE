/**
 * PriceDetails component showing the breakdown of booking costs.
 */

import { useTranslation } from "@/hooks/useTranslation";
import styles from '@/styles/bookings/PriceDetails.module.css';

const PriceDetails = ({ booking }) => {
  const { t } = useTranslation();
  if (!booking) return null;

  const {
    taxRate,
    taxAmount,
    discountAmount,
    totalAmount,
    priceBreakdown,
    parkingSurcharge,
    petSurcharge
  } = booking;

  const extras = priceBreakdown?.extras || [];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{t("bookingFlow.priceDetails", { fallback: "Prisdetaljer" })}</h3>

      {/* Base Price */}
      <div className={styles.detailRow}>
        <span className={styles.label}>
          {booking.service?.name || t("bookingFlow.baseCleaning", { fallback: "Base Cleaning" })}
          {booking.subscription?.recurringIntervalType && (
            <>, {t(`bookingFlow.${booking.subscription.recurringIntervalType.toLowerCase()}`, { fallback: booking.subscription.recurringIntervalType }).toLowerCase()}.</>
          )}
        </span>
        <span className={styles.value}>
          {t('bookingFlow.currencyFormat', { price: parseFloat(priceBreakdown?.basePrice || booking.service?.basePrice || 0).toFixed(2), fallback: `NOK ${parseFloat(priceBreakdown?.basePrice || booking.service?.basePrice || 0).toFixed(2)}` })}
        </span>
      </div>

      {/* Extras */}
      {extras.length > 0 && extras.map((extra, index) => (
        <div className={styles.detailRow} key={index}>
          <span className={styles.label}>{extra.name || t("bookingFlow.extraServiceLabel", { fallback: 'Extra Service' })}</span>
          <span className={styles.value}>
            {t('bookingFlow.currencyFormatPlus', { price: parseFloat(extra.price).toFixed(2), fallback: `+NOK ${parseFloat(extra.price).toFixed(2)}` })}
          </span>
        </div>
      ))}

      {/* Surcharges */}
      {(parseFloat(parkingSurcharge) > 0) && (
        <div className={styles.detailRow}>
          <span className={styles.label}>{t("bookingFlow.parkingSurchargeLabel", { fallback: "Parkeringsgebyr" })}</span>
          <span className={styles.value}>
            {t('bookingFlow.currencyFormatPlus', { price: parseFloat(parkingSurcharge).toFixed(2), fallback: `+NOK ${parseFloat(parkingSurcharge).toFixed(2)}` })}
          </span>
        </div>
      )}

      {(parseFloat(petSurcharge) > 0) && (
        <div className={styles.detailRow}>
          <span className={styles.label}>{t("bookingFlow.petSurchargeLabel", { fallback: "Ekstra kostnad for dyr" })}</span>
          <span className={styles.value}>
            {t('bookingFlow.currencyFormatPlus', { price: parseFloat(petSurcharge).toFixed(2), fallback: `+NOK ${parseFloat(petSurcharge).toFixed(2)}` })}
          </span>
        </div>
      )}

      {parseFloat(priceBreakdown?.drivingCharges || 0) > 0 && (
        <div className={styles.detailRow}>
          <span className={styles.label}>{t("bookingFlow.drivingFeeLabel", { fallback: "Driving Fee (One-Time)" })}</span>
          <span className={styles.value}>
            {t('bookingFlow.currencyFormatPlus', { price: parseFloat(priceBreakdown.drivingCharges).toFixed(2), fallback: `+NOK ${parseFloat(priceBreakdown.drivingCharges).toFixed(2)}` })}
          </span>
        </div>
      )}

      {/* Discount */}
      {parseFloat(discountAmount || 0) > 0 && (
        <div className={styles.detailRow}>
          <span className={styles.label}>{t("table.discount", { fallback: "Discount" })}</span>
          <span className={styles.discountValue}>
            {t('bookingFlow.currencyFormatMinus', { price: parseFloat(discountAmount).toFixed(2), fallback: `-NOK ${parseFloat(discountAmount).toFixed(2)}` })}
          </span>
        </div>
      )}

      {/* Total and Tax */}
      <div className={styles.totalRow}>
        <div className={styles.detailRow} style={{ marginBottom: 0 }}>
          <span className={styles.totalLabel}>{t("bookingFlow.estimateTotal", { fallback: "Totalbeløp" })}</span>
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
  );
};

export default PriceDetails;
