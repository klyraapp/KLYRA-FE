/**
 * BookingDetailSection component for showing main booking info in detail page.
 */

import { useTranslation } from "@/hooks/useTranslation";
import { formatLongDate } from "@/helpers/dateFormatter";
import styles from '@/styles/bookings/BookingDetailSection.module.css';

const BookingDetailSection = ({ booking }) => {
  const { t, currentLanguage } = useTranslation();
  const {
    contactFirstName,
    contactLastName,
    service,
    bookingDate,
    areaSqm,
    areaSqft,
    serviceStreetAddress,
    serviceCity,
    serviceCountry
  } = booking;

  const address = [serviceStreetAddress, [serviceCity, serviceCountry].filter(Boolean).join(' ')].filter(Boolean).join(', ');

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{t("bookingFlow.bookingDetails", { fallback: "Booking Detail" })}</h3>
      <div className={styles.customerName}>{(contactFirstName || contactLastName) ? `${contactFirstName || ""} ${contactLastName || ""}` : t('common.anonymous', { fallback: 'No Name' })}</div>
      <div className={styles.serviceName}>
        {service?.name || "-"}
        {booking?.subscription?.recurringIntervalType && (
          <>, {t(`bookingFlow.${booking.subscription.recurringIntervalType.toLowerCase()}`, { fallback: booking.subscription.recurringIntervalType }).toLowerCase()}.</>
        )}
      </div>

      <div className={styles.detailRow}>
        <span className={styles.label}>{t("bookingFlow.date", { fallback: "Date" })}</span>
        <span className={styles.value}>
          {bookingDate ? formatLongDate(bookingDate, currentLanguage) : "-"}
        </span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.label}>{t("bookingFlow.area", { fallback: "Area" })}</span>
        <span className={styles.value}>{areaSqm || 0} m²</span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.label}>{t("bookingFlow.location", { fallback: "Location" })}</span>
        <span className={styles.value}>{address || "-"}</span>
      </div>

      {booking?.subscription?.recurringIntervalType && (
        <div className={styles.detailRow}>
          <span className={styles.label}>{t("bookingFlow.cleaningInterval", { fallback: "Interval" })}</span>
          <span className={styles.value}>
            {t(`bookingFlow.${booking.subscription.recurringIntervalType.toLowerCase()}`, {
              fallback: booking.subscription.recurringIntervalType
            })}
          </span>
        </div>
      )}

      {Array.isArray(booking?.bookingExtraServices) && booking.bookingExtraServices.length > 0 && (
        <div className={styles.extraServicesContainer}>
          <div className={styles.label} style={{ marginBottom: '8px', marginTop: '16px' }}>
            {t("bookingFlow.extraServices", { fallback: "Extra Services" })}
          </div>
          <div className={styles.extraServicesList}>
            {booking.bookingExtraServices.map((extra, index) => (
              <div key={extra?.id || index} className={styles.extraServiceItem}>
                • {extra?.extraService?.name || extra?.name || extra?.serviceName || "Extra Service"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailSection;
