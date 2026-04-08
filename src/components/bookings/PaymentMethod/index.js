/**
 * PaymentMethod component showing the payment info for the booking.
 */

import styles from '@/styles/bookings/PaymentMethod.module.css';

const PaymentMethod = ({ payment }) => {
  const { methodName, hourlyRate } = payment;

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Payment Method</h3>

      <div className={styles.detailRow}>
        <span className={styles.label}>{methodName}</span>
        {hourlyRate && (
          <span className={styles.value}>${hourlyRate.toFixed(2)}/hr</span>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
