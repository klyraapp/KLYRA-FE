import { formatLongDate } from "@/helpers/dateFormatter";
import { useTranslation } from "@/hooks/useTranslation";
import styles from '@/styles/bookings/BookingDetailSection.module.css'; // Reusing styles from booking detail
import subscriptionStyles from '@/styles/subscriptions/SubscriptionDetailSection.module.css';
import { Badge, Slider, Switch, Tooltip, Button, Alert } from "antd";
import { InfoCircleOutlined, CreditCardOutlined, CalendarOutlined } from "@ant-design/icons";
import ExtraServiceCard from "@/components/common/Booking/ExtraServiceCard";
import { useState } from "react";

const SubscriptionDetailSection = ({ 
  subscription, 
  availableExtras = [], 
  onUpdate,
  onChangeCard
}) => {
  const { t, currentLanguage } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Initial state logic based on futureBookingOverride
  const override = subscription.futureBookingOverride;
  const initialAreaSqm = parseFloat(override?.areaSqm || subscription.areaSqm || 0);
  const initialInEveryRecurring = override ? !!override.inEveryRrecurring : !!subscription.inEveryRrecurring;
  const initialSelectedExtras = override?.selectedExtraService || subscription.selectedExtraService || [];

  // Edit State
  const [areaSqm, setAreaSqm] = useState(initialAreaSqm);
  const [inEveryRrecurring, setInEveryRrecurring] = useState(initialInEveryRecurring);
  const [selectedExtras, setSelectedExtras] = useState(initialSelectedExtras);

  const {
    subscriptionNumber,
    status,
    recurringIntervalType,
    displayDate,
    nextInvoicingDate,
    contactFirstName,
    contactLastName,
    contactEmail,
    priceBreakdown
  } = subscription;


  const handleToggleExtra = (id) => {
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
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      });
    });
  };

  const handleSave = () => {
    onUpdate({
      areaSqm,
      inEveryRrecurring,
      selectedExtraService: selectedExtras
    });
    setIsEditing(false);
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
    <div className={styles.section}>
      <div className={subscriptionStyles.headerActions}>
        <h3 className={styles.sectionTitle}>{t("bookingFlow.subscriptionDetails", { fallback: "Subscription Detail" })}</h3>
        <Button 
          type="primary" 
          icon={<CreditCardOutlined />} 
          onClick={onChangeCard}
          className={subscriptionStyles.changeCardBtn}
        >
          {t("bookingFlow.changeYourCard", { fallback: "Change your card" })}
        </Button>
      </div>
      
      {/* <div className={styles.customerName}>
        {(contactFirstName || contactLastName) ? `${contactFirstName || ""} ${contactLastName || ""}` : t('common.anonymous', { fallback: 'No Name' })}
      </div> */}
      
      <div className={styles.serviceName}>
        {formatInterval(recurringIntervalType)} - {subscriptionNumber}
      </div>

      <div className={styles.detailRow}>
        <span className={styles.label}>{t("bookingFlow.status", { fallback: "Status" })}</span>
        <Badge status={status === 'ACTIVE' ? 'success' : 'default'} text={status} />
      </div>

      <div className={styles.detailRow}>
        <span className={styles.label}>{t("bookingFlow.nextCleaning", { fallback: "Next cleaning" })}</span>
        <span className={styles.value}>
          {displayDate ? formatLongDate(displayDate, currentLanguage) : "-"}
        </span>
      </div>

      {!isEditing ? (
        <>
          {/* <div className={styles.detailRow}>
            <span className={styles.label}>{t("bookingFlow.area", { fallback: "Base Area" })}</span>
            <span className={styles.value}>{parseFloat(subscription.areaSqm).toFixed(0)} m²</span>
          </div> */}

          {override && (
            <div className={subscriptionStyles.overrideNotice}>
              <Alert
                message={t("bookingFlow.futureBookingNotice", { fallback: "Customizations for future bookings" })}
                description={
                  <div className={subscriptionStyles.overrideDetails}>
                    <p className={subscriptionStyles.overrideText}>
                      {t("bookingFlow.futureAreaMsg", { fallback: "Area updated to:" })} <strong>{override.areaSqm} m²</strong>
                    </p>
                    <p className={subscriptionStyles.overrideText}>
                      {t("bookingFlow.futureRecurringMsg", { fallback: "Add to every booking:" })} <strong>{override.inEveryRrecurring ? t("common.yes") : t("common.no")}</strong>
                    </p>
                    {override.selectedExtraService?.length > 0 && (
                      <div className={subscriptionStyles.overrideExtras}>
                        <p className={subscriptionStyles.overrideText}>{t("bookingFlow.futureExtrasMsg", { fallback: "Extra services for future bookings:" })}</p>
                        <ul className={subscriptionStyles.overrideList}>
                          {override.selectedExtraService.map((item, idx) => {
                            const details = (subscription.extraServices || availableExtras).find(ext => ext.id === item.extraServiceId);
                            return (
                              <li key={idx}>
                                {details?.name || "Extra Service"} (x{item.quantity})
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                }
                type="info"
                showIcon
                icon={<CalendarOutlined />}
              />
            </div>
          )}

          {!override && initialSelectedExtras.length > 0 && (
            <div className={styles.extraServicesContainer}>
              <div className={styles.label} style={{ marginBottom: '8px', marginTop: '16px' }}>
                {t("bookingFlow.extraServices", { fallback: "Extra Services" })}
              </div>
              <div className={styles.extraServicesList}>
                {initialSelectedExtras.map((item, index) => {
                  const details = (subscription.extraServices || availableExtras).find(ext => ext.id === item.extraServiceId);
                  return (
                    <div key={item.extraServiceId || index} className={styles.extraServiceItem}>
                      • {details?.name || "Extra Service"} (x{item.quantity})
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Button type="link" onClick={() => setIsEditing(true)} style={{ padding: 0, marginTop: '24px' }}>
            {t("buttons.editSubscription", { fallback: "Edit Subscription" })}
          </Button>
        </>
      ) : (
        <div className={subscriptionStyles.editForm}>
          <div className={subscriptionStyles.editSection}>
            <label className={subscriptionStyles.editLabel}>
              {t('bookingFlow.areaSqm', { fallback: 'Area sqm' })}
            </label>
            <div className={subscriptionStyles.sliderWrapper}>
              <Slider 
                min={10} 
                max={500} 
                value={areaSqm} 
                onChange={setAreaSqm} 
                className={subscriptionStyles.slider}
              />
              <span className={subscriptionStyles.sliderVal}>{areaSqm} m²</span>
            </div>
          </div>

          <div className={subscriptionStyles.editSection}>
            <div className={subscriptionStyles.toggleRow}>
              <label className={subscriptionStyles.editLabel}>
                {t("bookingFlow.inEverySubscriptionMsg", { 
                  interval: formatInterval(recurringIntervalType).toLowerCase(),
                  fallback: `Do you want these customizations to apply to every upcoming booking in this ${formatInterval(recurringIntervalType).toLowerCase()} subscription?` 
                })}
              </label>
              <Switch checked={inEveryRrecurring} onChange={setInEveryRrecurring} />
            </div>
          </div>

          <div className={subscriptionStyles.editSection}>
            <label className={subscriptionStyles.editLabel}>
              {t("bookingFlow.extraServices", { fallback: "Extra Services" })}
            </label>
            <div className={subscriptionStyles.extrasGrid}>
              {(subscription.extraServices || []).length > 0 ? (
                (subscription.extraServices || availableExtras).map(extra => (
                  <ExtraServiceCard 
                    key={extra.id}
                    extraService={extra}
                    isSelected={selectedExtras.some(e => e.extraServiceId === extra.id)}
                    quantity={selectedExtras.find(e => e.extraServiceId === extra.id)?.quantity || 1}
                    onToggle={handleToggleExtra}
                    onQuantityUpdate={handleQuantityUpdate}
                  />
                ))
              ) : (
                <div style={{ color: '#000000a6', padding: '12px 0' }}>
                  {t("bookingFlow.noExtraServicesAvailable", { fallback: "This service doesn't have any extra service to be added" })}
                </div>
              )}
            </div>
          </div>

          <div className={subscriptionStyles.formActions}>
            <Button onClick={() => setIsEditing(false)}>{t("buttons.cancel", { fallback: "Cancel" })}</Button>
            <Button type="primary" onClick={handleSave}>{t("buttons.saveChanges", { fallback: "Save Changes" })}</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDetailSection;
