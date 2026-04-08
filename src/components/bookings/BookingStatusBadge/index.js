/**
 * BookingStatusBadge component to display the status of a booking.
 */

import { BookingStatus } from '@/constants/bookings';
import { useTranslation } from "@/hooks/useTranslation";
import styles from '@/styles/bookings/BookingStatusBadge.module.css';
import { Tag } from 'antd';

const BookingStatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const getBadgeProps = (status) => {
    switch (status) {
      case BookingStatus.PENDING:
        return { color: 'warning', text: t("bookingFlow.pendingStatus", { fallback: 'Pending' }) };
      case BookingStatus.CONFIRMED:
        return { className: styles.confirmed, text: t("bookingFlow.bookedStatus", { fallback: 'Confirmed' }) };
      case BookingStatus.IN_PROGRESS:
        return { color: 'processing', text: t("bookingFlow.inProgressStatus", { fallback: 'In Progress' }) };
      case BookingStatus.COMPLETED:
        return { className: styles.completed, text: t("bookingFlow.completedStatus", { fallback: 'Completed' }) };
      case BookingStatus.CANCELLED:
        return { color: 'error', text: t("bookingFlow.cancelledStatus", { fallback: 'Cancelled' }) };
      case BookingStatus.EXPIRED:
        return { color: 'default', text: t("status.expired", { fallback: 'Expired' }) };
      case BookingStatus.ACTIVE:
        return { color: 'success', text: t("status.paid", { fallback: 'Paid' }) };
      case BookingStatus.INACTIVE:
        return { color: 'default', text: t("status.inactive", { fallback: 'Inactive' }) };
      default:
        return { color: 'default', text: status };
    }
  };

  const { color, className, text } = getBadgeProps(status);

  return (
    <Tag color={color} className={`${styles.badge} ${className || ''}`}>
      {text}
    </Tag>
  );
};

export default BookingStatusBadge;
