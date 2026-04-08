/**
 * EmptyState component shown when no bookings are found.
 */

import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/bookings/EmptyState.module.css';
import { FileTextOutlined } from '@ant-design/icons';

const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <FileTextOutlined className={styles.icon} />
      </div>
      <p className={styles.text}>{t('bookingFlow.noActiveTask', { fallback: 'No active task at the moment' })}</p>
    </div>
  );
};

export default EmptyState;
