/**
 * Subscriptions List Page
 * Displays current and past subscriptions for the user.
 */

import BookingsLayout from '@/components/bookings/BookingsLayout';
import EmptyState from '@/components/bookings/EmptyState';
import SubscriptionCard from '@/components/subscriptions/SubscriptionCard';
import { useTranslation } from "@/hooks/useTranslation";
import subscriptionService from '@/services/subscriptionService';
import styles from '@/styles/subscriptions/SubscriptionsPage.module.css';
import { Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data = await subscriptionService.getSubscriptions();
        setSubscriptions(data || []);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleRefresh = async () => {
    try {
      const data = await subscriptionService.getSubscriptions();
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Failed to refresh subscriptions:', error);
    }
  };

  const subsList = Array.isArray(subscriptions) ? subscriptions : [];

  const currentSubscriptions = subsList.filter(b =>
    ['PENDING', 'ACTIVE'].includes(b?.status)
  );

  const expiredSubscriptions = subsList.filter(b =>
    ['EXPIRED'].includes(b?.status)
  );

  const pastSubscriptions = subsList.filter(b =>
    ['INACTIVE', 'CANCELLED'].includes(b?.status)
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentSection}>
        {subsList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.listsContainer}>
            {/* Current Section */}
            {currentSubscriptions.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionHeading}>{t("bookingFlow.currentTab", { fallback: "Current" })}</h2>
                <Row gutter={[16, 16]}>
                  {Array.isArray(currentSubscriptions) && currentSubscriptions.map(sub => (
                    <Col xs={24} sm={12} lg={8} key={sub?.id || Math.random()}>
                      <SubscriptionCard subscription={sub} onRefresh={handleRefresh} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

           
            {expiredSubscriptions.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionHeading}>{t("status.expired", { fallback: "Expired" })}</h2>
                <Row gutter={[16, 16]}>
                  {Array.isArray(expiredSubscriptions) && expiredSubscriptions.map(sub => (
                    <Col xs={24} sm={12} lg={8} key={sub?.id || Math.random()}>
                      <SubscriptionCard subscription={sub} onRefresh={handleRefresh} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Past Section */}
            {pastSubscriptions.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionHeading}>{t("bookingFlow.pastTab", { fallback: "Past" })}</h2>
                <Row gutter={[16, 16]}>
                  {Array.isArray(pastSubscriptions) && pastSubscriptions.map(sub => (
                    <Col xs={24} sm={12} lg={8} key={sub?.id || Math.random()}>
                      <SubscriptionCard subscription={sub} onRefresh={handleRefresh} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SubscriptionsPage.getLayout = (page) => (
  // Force a specific title override
  <BookingsLayout
    customSubtitleKey="navigation.subscriptions"
    customSubtitleFallback="Subscriptions"
  >
    {page}
  </BookingsLayout>
);

export default SubscriptionsPage;
