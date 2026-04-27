/**
 * SubscriptionCard component to display individual subscription info.
 */

import BookingStatusBadge from '@/components/bookings/BookingStatusBadge';
import { formatLongDate } from '@/helpers/dateFormatter';
import { useTranslation } from "@/hooks/useTranslation";
import useToast from '@/hooks/useToast';
import subscriptionService from '@/services/subscriptionService';
import styles from '@/styles/subscriptions/SubscriptionCard.module.css';
import { CalendarOutlined, CreditCardOutlined, ReloadOutlined, UserOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { useState } from 'react';
import StripeCardUpdateModal from '../StripeCardUpdateModal';
import SubscriptionExtraServicesModal from '../SubscriptionExtraServicesModal';

const SubscriptionCard = ({ subscription, onRefresh }) => {
  const { t, currentLanguage } = useTranslation();
  const toast = useToast();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isExtraServicesModalVisible, setIsExtraServicesModalVisible] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);

  const {
    id,
    subscriptionNumber,
    status,
    recurringIntervalType,
    createdAt,
    displayDate,
    nextInvoicingDate,
    contactFirstName,
    contactLastName,
    contactEmail
  } = subscription;

  const isPast = ['INACTIVE', 'CANCELLED'].includes(status);

  const getHeaderTitle = (status) => {
    switch (status) {
      case 'ACTIVE': return t("status.paid", { fallback: 'Paid' });
      case 'INACTIVE': return t("status.inactive", { fallback: 'Inactive' });
      case 'PENDING': return t("status.unpaid", { fallback: 'Waiting payment' });
      case 'EXPIRED': return t("status.expired", { fallback: 'Expired' });
      case 'CANCELLED': return t("status.cancelled", { fallback: 'Cancelled' });
      default: return status;
    }
  };

  const formatInterval = (interval) => {
    switch (interval) {
      case 'WEEKLY': return t("bookingFlow.weekly", { fallback: 'Weekly' });
      case 'EVERY_SECOND_WEEK': return t("bookingFlow.biweekly", { fallback: 'Every Second Week' });
      case 'EVERY_THIRD_WEEK': return t("bookingFlow.triweekly", { fallback: 'Every Third Week' });
      case 'MONTHLY': return t("bookingFlow.monthly", { fallback: 'Monthly' });
      default: return interval;
    }
  };

  const handleRetryClick = async () => {
    setRetryLoading(true);
    try {
      await subscriptionService.resumeSubscription(id);
      toast.success("messages.subscriptionResumedSuccess", { fallback: "Subscription resumed successfully" });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Failed to resume subscription:', error);
      toast.error("messages.subscriptionResumeFailed", { fallback: "Failed to resume subscription. Please try again." });
    } finally {
      setRetryLoading(false);
    }
  };

  return (
    <>
      <Card
        className={styles.card}
        bodyStyle={{ padding: '16px' }}
        bordered={false}
      >
        <div className={`${styles.header} ${isPast ? styles.headerPast : styles.headerCurrent}`}>
          <span className={styles.headerTitle}>{t("bookingFlow.subscriptionNumber", { subscriptionNumber, fallback: `Subscription #${subscriptionNumber}` })}</span>
          <span className={styles.headerPrice}>{t("status.status", { fallback: 'Status' })}: {getHeaderTitle(status)}</span>
        </div>

        <div className={styles.content}>
          <div className={styles.serviceRow}>
            <span className={styles.serviceName}>{formatInterval(recurringIntervalType)}</span>
            <BookingStatusBadge status={status} />
          </div>

          <div className={styles.customerName}>
            <UserOutlined className={styles.icon} style={{ marginRight: '8px' }} />
            {(contactFirstName || contactLastName) ? `${contactFirstName || ''} ${contactLastName || ''}` : t('common.anonymous', { fallback: 'No Name' })}
          </div>

          <div className={styles.infoRow}>
            <CalendarOutlined className={styles.icon} />
            <span>
              {t("bookingFlow.nextCleaning", { fallback: "Next schedule:" })} {displayDate ? formatLongDate(displayDate, currentLanguage) : t("bookingFlow.notScheduled", { fallback: "Not Scheduled Yet" })}
            </span>
          </div>

          {nextInvoicingDate && (
            <div className={styles.infoRow}>
              <CalendarOutlined className={styles.icon} />
              <span>
                {t("bookingFlow.nextPaymentDeduction", { fallback: "Next payment will deduct on:" })} {formatLongDate(nextInvoicingDate, currentLanguage)}
              </span>
            </div>
          )}

          <br />

          <div className={styles.actionsContainer}>
            {status === 'EXPIRED' && (
              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={handleRetryClick}
                loading={retryLoading}
                className={styles.retryButton}
              >
                {t("buttons.retry", { fallback: "Retry" })}
              </Button>
            )}
            <Button
              className={styles.extraServicesButton}
              icon={<AppstoreAddOutlined />}
              onClick={() => setIsExtraServicesModalVisible(true)}
            >
              {t("bookingFlow.extraServices", { fallback: "Extra Services" })}
            </Button>
            <Button
              className={styles.updateCardButton}
              icon={<CreditCardOutlined />}
              onClick={() => setIsUpdateModalVisible(true)}
            >
              {t("buttons.updateCard", { fallback: "Update Card" })}
            </Button>
          </div>
        </div>
      </Card>

      <SubscriptionExtraServicesModal
        visible={isExtraServicesModalVisible}
        onClose={() => setIsExtraServicesModalVisible(false)}
        subscription={subscription}
        onRefresh={onRefresh}
      />

      <StripeCardUpdateModal
        visible={isUpdateModalVisible}
        onClose={() => setIsUpdateModalVisible(false)}
        subscriptionId={id}
        onSuccess={() => {
          setIsUpdateModalVisible(false);
          if (onRefresh) onRefresh();
        }}
      />
    </>
  );
};

export default SubscriptionCard;
