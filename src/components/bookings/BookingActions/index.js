/**
 * BookingActions component for card actions.
 */

import { BookingStatus } from '@/constants/bookings';
import { useTranslation } from "@/hooks/useTranslation";
import styles from '@/styles/bookings/BookingActions.module.css';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ReviewModal from '../ReviewModal';

const BookingActions = ({ booking, onRefresh }) => {
  const router = useRouter();
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const { id, status, review } = booking;
  const { t } = useTranslation();

  const handleDetailsClick = () => {
    router.push(`/bookings/${id}`);
  };

  const handleReviewClick = () => {
    setIsReviewModalVisible(true);
  };

  const showReviewButton = status === BookingStatus.COMPLETED && !review;

  return (
    <div className={styles.actionsContainer}>
      <div className={styles.actionSpace}>
        <Button
          className={styles.actionButton}
          onClick={handleDetailsClick}
          block
        >
          {t("bookingFlow.detailsAction", { fallback: "Details" })}
        </Button>

        {/* {status !== BookingStatus.COMPLETED && (
          <Button
            className={styles.actionButton}
            disabled
          >
            {t("bookingFlow.chatAction", { fallback: "Chat" })}
          </Button>
        )} */}

        {status === BookingStatus.COMPLETED && (
          <Button
            className={styles.actionButton}
            onClick={handleReviewClick}
          >
            {review ? t("bookingFlow.viewYourReview", { fallback: "View your review" }) : t("bookingFlow.leaveAReview", { fallback: "Leave A Review" })}
          </Button>
        )}
      </div>

      <ReviewModal
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        booking={booking}
        viewOnly={!!review}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </div>
  );
};

export default BookingActions;
