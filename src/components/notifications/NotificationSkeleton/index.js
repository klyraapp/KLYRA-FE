/**
 * NotificationSkeleton Component
 * Loading state for notification items
 */

import styles from '@/styles/notifications/NotificationSkeleton.module.css';
import { Skeleton } from 'antd';

const NotificationSkeleton = () => {
  return (
    <div className={styles.skeletonItem}>
      <Skeleton avatar active paragraph={{ rows: 2 }} />
    </div>
  );
};

export default NotificationSkeleton;
