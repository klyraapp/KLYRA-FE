/**
 * Notifications Page
 * Displays user notifications with infinite scroll
 */

import styles from '@/styles/notifications/Notifications.module.css';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

dayjs.extend(relativeTime);
dayjs.extend(calendar);

// Components
import HeaderBar from '@/components/BookService/HeaderBar';
import BookingHeroCard from '@/components/home/BookingHeroCard';
import NotificationList from '@/components/notifications/NotificationList';
import { useTranslation } from '@/hooks/useTranslation';
import { getNotifications } from '@/services/notifications/notificationsService';

const NotificationsPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const take = 10;

  const observer = useRef();
  const loadMoreRef = useRef();

  // 1. Initial Fetch
  useEffect(() => {
    if (user?.id) {
      fetchInitialNotifications();
    }
  }, [user?.id]);

  const fetchInitialNotifications = async () => {
    // If no user is logged in, we can't fetch notifications
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = await getNotifications(user.id, { take, skip: 0 });
      setNotifications(data || []);
      setSkip(take);
      setHasMore(data?.length === take);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreNotifications = async () => {
    if (isLoadingMore || !hasMore || !user?.id) return;

    setIsLoadingMore(true);
    try {
      const data = await getNotifications(user.id, { take, skip });

      if (data && data.length > 0) {
        setNotifications(prev => [...prev, ...data]);
        setSkip(prev => prev + take);
        setHasMore(data.length === take);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more notifications:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 2. Infinite Scroll Intersection Observer
  useEffect(() => {
    if (loading) return;

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.8
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreNotifications();
      }
    }, options);

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, skip]);

  // 3. Grouping Logic
  const groupedNotifications = useMemo(() => {
    const groups = {};

    notifications.forEach(item => {
      if (!item || !item.createdAt) return;

      const date = dayjs(item.createdAt);
      if (!date.isValid()) return;

      let label = '';
      if (date.isSame(dayjs(), 'day')) {
        label = t('bookingFlow.today', { fallback: 'Today' });
      } else if (date.isSame(dayjs().subtract(1, 'day'), 'day')) {
        label = t('bookingFlow.yesterday', { fallback: 'Yesterday' });
      } else {
        label = date.format('MMMM D, YYYY');
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(item);
    });

    return groups;
  }, [notifications]);

  return (
    <div className={styles.pageContainer}>
      <HeaderBar showProgress={false} subtitle={t('navigation.notifications', { fallback: 'Notifications' })} />

      <div className={styles.contentWrapper}>
        <div className={styles.heroWrapper}>
          <BookingHeroCard onBookNow={() => router.push('/book-service')} />
        </div>

        <div className={styles.notificationsSection}>
          {loading && notifications.length === 0 ? (
            <div className={styles.initialLoading}>
              <p>{t('bookingFlow.loadingNotifications', { fallback: 'Loading notifications...' })}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyStateTitle}>{t('bookingFlow.noNotificationsYet', { fallback: 'No notifications yet' })}</h3>
              <p className={styles.emptyStateMessage}>{t('bookingFlow.notifyWhenImportant', { fallback: "We'll notify you when something important happens." })}</p>
            </div>
          ) : (
            <NotificationList
              groupedNotifications={groupedNotifications}
              isLoadingMore={isLoadingMore}
              loadMoreRef={loadMoreRef}
            />
          )}

          {!hasMore && notifications.length > 0 && (
            <div className={styles.noMoreItems}>
              {t('bookingFlow.noMoreNotifications', { fallback: 'No more notifications' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
