/**
 * BookingCard component to display individual booking info.
 */

import { BookingStatus } from '@/constants/bookings';
import { useTranslation } from "@/hooks/useTranslation";
import styles from '@/styles/bookings/BookingCard.module.css';
import { CalendarOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import BookingActions from '../BookingActions';
import BookingStatusBadge from '../BookingStatusBadge';

const BookingCard = ({ booking, onRefresh }) => {
  const { t } = useTranslation();
  const {
    bookingNumber,
    status,
    service,
    contactFirstName,
    contactLastName,
    bookingDate,
    startTime,
    totalAmount
  } = booking;

  const isPast = [BookingStatus.COMPLETED, BookingStatus.CANCELLED].includes(status);

  const getHeaderTitle = (status) => {
    switch (status) {
      case BookingStatus.CONFIRMED: return t("bookingFlow.bookedStatus", { fallback: 'Booked' });
      case BookingStatus.COMPLETED: return t("bookingFlow.completedStatus", { fallback: 'Completed' });
      case BookingStatus.PENDING: return t("bookingFlow.pendingStatus", { fallback: 'Pending' });
      case BookingStatus.IN_PROGRESS: return t("bookingFlow.inProgressStatus", { fallback: 'In Progress' });
      case BookingStatus.CANCELLED: return t("bookingFlow.cancelledStatus", { fallback: 'Cancelled' });
      default: return status;
    }
  };

  return (
    <Card
      className={styles.card}
      bodyStyle={{ padding: '16px' }}
      bordered={false}
    >
      <div className={`${styles.header} ${isPast ? styles.headerPast : styles.headerCurrent}`}>
        <span className={styles.headerTitle}>{getHeaderTitle(status)}</span>
        <span className={styles.headerPrice}>NOK {totalAmount}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.serviceRow}>
          <span className={styles.serviceName}>{service?.name}</span>
          <BookingStatusBadge status={status} />
        </div>

        <div className={styles.customerName}>
          {(contactFirstName || contactLastName) ? `${contactFirstName || ""} ${contactLastName || ""}` : t('common.anonymous', { fallback: 'No Name' })}
        </div>

        <div className={styles.infoRow}>
          <CalendarOutlined className={styles.icon} />
          <span>{bookingDate}</span>
        </div>

        <BookingActions booking={booking} onRefresh={onRefresh} />
      </div>
    </Card>
  );
};

export default BookingCard;
