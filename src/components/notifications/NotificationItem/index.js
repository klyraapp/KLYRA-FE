/**
 * NotificationItem Component
 * Displays individual notification details
 */

import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/notifications/NotificationItem.module.css';
import dayjs from 'dayjs';

const NotificationItem = ({ notification }) => {
  const { t } = useTranslation();
  const { title, message, createdAt } = notification;

  // Format date: Today, Yesterday, or full date
  const formatTimestamp = (date) => {
    const dDate = dayjs(date);
    const now = dayjs();

    if (dDate.isSame(now, 'day')) {
      return t('bookingFlow.todayAt', { time: dDate.format('h:mm A'), fallback: `Today at ${dDate.format('h:mm A')}` });
    } else if (dDate.isSame(now.subtract(1, 'day'), 'day')) {
      return t('bookingFlow.yesterdayAt', { time: dDate.format('h:mm A'), fallback: `Yesterday at ${dDate.format('h:mm A')}` });
    } else {
      return t('bookingFlow.atFormat', {
        day: dDate.format('dddd'),
        time: dDate.format('h:mm A'),
        fallback: dDate.format('dddd [at] h:mm A')
      });
    }
  };

  return (
    <div className={styles.notificationItem}>
      <div className={styles.avatarContainer}>
        <div className={styles.kSymbol}>
          <span>K</span>
        </div>
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>
        <span className={styles.timestamp}>{formatTimestamp(createdAt)}</span>
      </div>
    </div>
  );
};

export default NotificationItem;
