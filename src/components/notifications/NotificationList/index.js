/**
 * NotificationList Component
 * Handles the collection of notification items and grouping
 */

import styles from '@/styles/notifications/Notifications.module.css';
import React from 'react';
import NotificationItem from '../NotificationItem';
import NotificationSkeleton from '../NotificationSkeleton';
import SectionLabel from '../SectionLabel';

const NotificationList = ({
  groupedNotifications,
  isLoadingMore,
  loadMoreRef
}) => {
  return (
    <div className={styles.listContainer}>
      {Object.entries(groupedNotifications).map(([dateLabel, items]) => (
        <React.Fragment key={dateLabel}>
          <SectionLabel label={dateLabel} />
          {items.map(item => (
            <NotificationItem key={item.id} notification={item} />
          ))}
        </React.Fragment>
      ))}

      {isLoadingMore && (
        <React.Fragment>
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </React.Fragment>
      )}

      {/* Invisible element to trigger intersection observer */}
      <div ref={loadMoreRef} className={styles.scrollTrigger} />
    </div>
  );
};

export default NotificationList;
