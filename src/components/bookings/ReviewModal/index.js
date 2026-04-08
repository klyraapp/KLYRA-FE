/**
 * ReviewModal Component
 * Handles booking review submission and success feedback
 */

import { useTranslation } from "@/hooks/useTranslation";
import { createReview } from '@/services/bookings/reviewService';
import styles from '@/styles/bookings/ReviewModal.module.css';
import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Form, Input, Modal, Rate } from 'antd';
import { useEffect, useState } from 'react';
const { TextArea } = Input;

const ReviewModal = ({ visible, onClose, booking, onSuccess, viewOnly = false }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  // Get cleaner name - assuming it's in booking.cleaner or similar
  const cleanerName = booking?.cleaner?.name || "the cleaner";

  useEffect(() => {
    if (visible && booking?.review) {
      form.setFieldsValue({
        rating: booking.review.rating,
        comment: booking.review.comment
      });
    } else if (visible && !viewOnly) {
      form.setFieldsValue({
        rating: 5,
        comment: ""
      });
    }
  }, [visible, booking, form, viewOnly]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createReview(booking.id, {
        rating: values.rating,
        comment: values.comment
      });
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handling is managed by service/middleware or showed via message
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      centered
      width={600}
      className={styles.reviewModal}
      closable={!loading}
      maskClosable={!loading && !submitted}
    >
      {!submitted ? (
        <div className={styles.modalContent}>
          <h2 className={styles.title}>
            {viewOnly ? t("bookingFlow.yourReview", { fallback: "Your review" }) : t("bookingFlow.leaveReviewTitle", { fallback: "Leave a review" })}
          </h2>
          {!viewOnly && <p className={styles.subTitle}>{t("bookingFlow.weValueFeedback", { fallback: "We greatly value your feedback" })}</p>}

          <h3 className={styles.question}>
            {viewOnly
              ? t("bookingFlow.yourRatingFor", { fallback: "Your rating for {cleanerName}" }).replace("{cleanerName}", cleanerName)
              : t("bookingFlow.howDoYouRate", { fallback: "How do you rate {cleanerName}?" }).replace("{cleanerName}", cleanerName)}
          </h3>

          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{ rating: 5 }}
            layout="vertical"
          >
            <div className={styles.ratingSection}>
              <span className={styles.ratingLabel}>{t("bookingFlow.overallService", { fallback: "Overall Service" })}</span>
              <Form.Item name="rating" noStyle>
                <Rate className={styles.stars} disabled={viewOnly} />
              </Form.Item>
            </div>

            <Form.Item
              name="comment"
              label={<span className={styles.inputLabel}>
                {viewOnly ? t("bookingFlow.yourExperience", { fallback: "Your experience" }) : t("bookingFlow.shareYourExperience", { fallback: "Please share your experience" })}
              </span>}
            >
              <TextArea
                rows={5}
                placeholder={viewOnly ? "" : t("bookingFlow.shareThoughtsPlaceholder", { fallback: "Share your thoughts here..." })}
                className={styles.textArea}
                disabled={viewOnly}
              />
            </Form.Item>

            <div className={styles.actions}>
              {!viewOnly ? (
                <>
                  <Button
                    onClick={handleClose}
                    className={styles.cancelButton}
                    disabled={loading}
                  >
                    {t("bookingFlow.cancelReview", { fallback: "Cancel" })}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.submitButton}
                    loading={loading}
                  >
                    {t("bookingFlow.submitReview", { fallback: "Submit" })}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleClose}
                  className={styles.submitButton}
                  style={{ width: '100%' }}
                >
                  {t("bookingFlow.closeReview", { fallback: "Close" })}
                </Button>
              )}
            </div>
          </Form>
        </div>
      ) : (
        <div className={styles.successContent}>
          <div className={styles.successIconContainer}>
            <CheckCircleFilled className={styles.successIcon} />
          </div>
          <h2 className={styles.successTitle}>{t("bookingFlow.thankYouReviewTitle", { fallback: "Thank you for your review!" })}</h2>
          <p className={styles.successText}>
            {t("bookingFlow.thankYouReviewText", { fallback: "We appreciated you taking the time to reflect on your experience" })}
          </p>
          <div className={styles.successActions}>
            <Button
              type="primary"
              onClick={handleClose}
              className={styles.doneButton}
            >
              {t("bookingFlow.doneReview", { fallback: "Done" })}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ReviewModal;
