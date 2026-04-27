import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Switch, Alert } from 'antd';
import { FiInfo } from 'react-icons/fi';
import { useTranslation } from '@/hooks/useTranslation';
import ExtraServiceCard from '@/components/common/Booking/ExtraServiceCard';
import PrimaryNavigationButtons from '@/components/common/Booking/PrimaryNavigationButtons';
import subscriptionService from '@/services/subscriptionService';
import useToast from '@/hooks/useToast';
import styles from '@/styles/BookingExtraServices.module.css';
import modalStyles from '@/styles/subscriptions/SubscriptionExtraServicesModal.module.css';

const SubscriptionExtraServicesModal = ({ visible, onClose, subscription, onRefresh }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Map initial state from override or subscription
  const override = subscription.futureBookingOverride;
  const initialInEveryRecurring = override ? !!override.inEveryRrecurring : !!subscription.inEveryRrecurring;
  const initialSelectedExtras = override?.selectedExtraService || subscription.selectedExtraService || [];
  
  const [inEveryRrecurring, setInEveryRrecurring] = useState(initialInEveryRecurring);
  const [selectedExtras, setSelectedExtras] = useState(initialSelectedExtras);

  // Sync state when modal opens or subscription data changes
  useEffect(() => {
    if (visible) {
      const ov = subscription.futureBookingOverride;
      setInEveryRrecurring(ov ? !!ov.inEveryRrecurring : !!subscription.inEveryRrecurring);
      setSelectedExtras(ov?.selectedExtraService || subscription.selectedExtraService || []);
    }
  }, [visible, subscription]);

  const availableExtras = subscription.associatedService?.extraServices || subscription.extraServices || [];

  const extraServicesTotal = useMemo(() => {
    return availableExtras
      .filter((service) => selectedExtras.some(s => s.extraServiceId === service.id))
      .reduce((total, service) => {
        const selected = selectedExtras.find(s => s.extraServiceId === service.id);
        const quantity = selected ? selected.quantity : 0;
        return total + parseFloat(service.price) * quantity;
      }, 0);
  }, [selectedExtras, availableExtras]);

  const handleServiceToggle = (id) => {
    setSelectedExtras(prev => {
      const exists = prev.find(item => item.extraServiceId === id);
      if (exists) {
        return prev.filter(item => item.extraServiceId !== id);
      } else {
        return [...prev, { extraServiceId: id, quantity: 1 }];
      }
    });
  };

  const handleQuantityUpdate = (e, id, delta) => {
    e.stopPropagation();
    setSelectedExtras(prev => {
      return prev.map(item => {
        if (item.extraServiceId === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await subscriptionService.updateSubscription(subscription.id, {
        areaSqm: parseFloat(subscription.areaSqm || subscription.lastBookingAreaSqm),
        inEveryRrecurring,
        selectedExtraService: selectedExtras
      });
      toast.success(t("messages.subscriptionUpdateSuccess", { fallback: "Subscription updated successfully" }));
      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      console.error('Failed to update subscription:', error);
      toast.error(t("messages.subscriptionUpdateFailed", { fallback: "Failed to update subscription" }));
    } finally {
      setLoading(false);
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

  return (
    <Modal
      title={<h2 className={modalStyles.modalTitle}>{t("bookingFlow.extraServices", { fallback: "Extra Services" })}</h2>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={modalStyles.modal}
      centered
      destroyOnClose
    >
      <div className={modalStyles.container}>
        <div className={styles.infoBox}>
          <FiInfo className={styles.infoIcon} />
          <p className={styles.infoText}>
            {t("bookingFlow.subscriptionExtrasInfo", { 
              fallback: "These extra services and their price will also be added in your next bookings." 
            })}
          </p>
        </div>

        {/* Only extra services price summary */}
        {selectedExtras.length > 0 && (
          <div className={styles.priceSummary}>
            <div className={styles.priceSummaryRow}>
              <span className={styles.priceSummaryLabelGray}>
                {selectedExtras.length} {t("bookingFlow.extraServiceLabel", { fallback: "Extra Service" })}
              </span>
              <span className={styles.priceSummaryValueGray}>
                +NOK {extraServicesTotal.toFixed(2)}
              </span>
            </div>
            <div className={styles.priceSummaryRowTotal}>
              <span className={styles.priceSummaryLabelTotal}>
                {t("bookingFlow.totalCharges", { fallback: "Total Charges" })}
              </span>
              <span className={styles.priceSummaryValueTotal}>
                NOK {extraServicesTotal.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {availableExtras.length === 0 ? (
          <Alert
            message={t("bookingFlow.noExtraServicesAvailable", { fallback: "No extra services available" })}
            description={t("bookingFlow.noExtraServicesDescription", { fallback: "The service you selected doesn't have any extra service related." })}
            type="info"
            showIcon
            className={styles.noServicesAlert}
          />
        ) : (
          <div className={styles.extraServicesGrid}>
            {availableExtras.map((extra) => (
              <ExtraServiceCard
                key={extra.id}
                extraService={extra}
                isSelected={selectedExtras.some(e => e.extraServiceId === extra.id)}
                quantity={selectedExtras.find(e => e.extraServiceId === extra.id)?.quantity || 0}
                onToggle={handleServiceToggle}
                onQuantityUpdate={handleQuantityUpdate}
              />
            ))}
          </div>
        )}

        {selectedExtras.length > 0 && (
          <div className={styles.recurringCheckboxContainer}>
            <div className={styles.recurringCheckboxLeft}>
              <p className={styles.recurringCheckboxText}>
                {t("bookingFlow.inEverySubscriptionMsg", {
                  interval: formatInterval(subscription.recurringIntervalType)?.toLowerCase() || "recurring",
                  fallback: `Do you want these customizations to apply to every upcoming booking in this ${formatInterval(subscription.recurringIntervalType)?.toLowerCase() || "recurring"} subscription?`
                })}
              </p>
              <span className={styles.recurringCheckboxSubtext}>
                {t("bookingFlow.recurringDesc", { fallback: "Turning this on ensures consistent service for all your scheduled appointments." })}
              </span>
            </div>
            <Switch
              checked={inEveryRrecurring}
              onChange={setInEveryRrecurring}
              className={styles.customSwitch}
            />
          </div>
        )}

        <div className={modalStyles.navButtonsWrapper}>
          <PrimaryNavigationButtons
            onBack={onClose}
            onNext={handleSave}
            nextLoading={loading}
            backText={t("bookingFlow.back", { fallback: "Back" })}
            nextText={t("buttons.saveChanges", { fallback: "Save Changes" })}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionExtraServicesModal;
