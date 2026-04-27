/**
 * Booking Extra Services Page
 * Step 2 (continued): Extra services selection in multi-step booking flow
 */

import HeaderBar from "@/components/BookService/HeaderBar";
import PrimaryNavigationButtons from "@/components/common/Booking/PrimaryNavigationButtons";
import SelectedServiceCard from "@/components/common/Booking/SelectedServiceCard";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useTranslation } from "@/hooks/useTranslation";
import {
  setExtraServiceQuantity,
  setInEveryRrecurring,
  toggleExtraService
} from "@/redux/reducers/bookingSlice";
import styles from "@/styles/BookingExtraServices.module.css";
import { getServiceIcon } from "@/utils/utils";
import { Alert, Radio, Switch } from "antd";
import { useRouter } from "next/router";
import { useMemo } from "react";
import ExtraServiceCard from "@/components/common/Booking/ExtraServiceCard";
import { useDispatch, useSelector } from "react-redux";



import { FiInfo } from "react-icons/fi";

const BookingExtraServices = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { currentPrice, selectedService } = useServicePricing();
  const availableExtraServices = useSelector((state) => state.booking.availableExtraServices);
  const selectedExtraServices = useSelector(
    (state) => state.booking.selectedExtraServices,
  );
  const isRecurring = useSelector((state) => state.booking.isRecurring);
  const recurringInterval = useSelector((state) => state.booking.recurringInterval);
  const inEveryRrecurring = useSelector((state) => state.booking.inEveryRrecurring);

  const extraServices = availableExtraServices || [];
  const basePrice = currentPrice;

  const extraServicesTotal = useMemo(() => {
    return extraServices
      .filter((service) => selectedExtraServices.some(s => s.extraServiceId === service.id))
      .reduce((total, service) => {
        const selected = selectedExtraServices.find(s => s.extraServiceId === service.id);
        const quantity = selected ? selected.quantity : 0;
        return total + parseFloat(service.price) * quantity;
      }, 0);
  }, [selectedExtraServices, extraServices]);

  const totalCharges = basePrice + extraServicesTotal;

  const handleServiceToggle = (serviceId) => {
    dispatch(toggleExtraService(serviceId));
  };

  const handleQuantityUpdate = (e, extraServiceId, delta) => {
    e.stopPropagation();
    const selected = selectedExtraServices.find(s => s.extraServiceId === extraServiceId);
    if (selected) {
      const newQuantity = selected.quantity + delta;
      dispatch(setExtraServiceQuantity({ extraServiceId, quantity: Math.max(0, newQuantity) }));
    }
  };

  const handleRecurringToggle = (checked) => {
    dispatch(setInEveryRrecurring(checked));
  };

  const handleBack = () => {
    router.push("/booking-details");
  };

  const handleNext = () => {
    router.push("/booking-details-extra");
  };

  const formatInterval = (interval) => {
    switch (interval) {
      case "WEEKLY":
        return t("bookingFlow.weekly", { fallback: "Weekly" });
      case "EVERY_SECOND_WEEK":
        return t("bookingFlow.biweekly", { fallback: "Every Second Week" });
      case "EVERY_THIRD_WEEK":
        return t("bookingFlow.triweekly", { fallback: "Every Third Week" });
      case "MONTHLY":
        return t("bookingFlow.monthly", { fallback: "Monthly" });
      default:
        return interval;
    }
  };

  if (router.isReady && !selectedService) {
    router.push("/book-service");
    return null;
  }

  const ServiceIcon = getServiceIcon(selectedService?.name);

  return (
    <div className={styles.pageWrapper}>
      <HeaderBar currentStep={2} />
      <div className={styles.pageContainer}>
        <SelectedServiceCard
          serviceName={selectedService?.name || ""}
          price={basePrice}
          icon={selectedService?.icon}
          fallbackIcon={ServiceIcon}
        />

        <div className={styles.formSection}>
          <h2 className={styles.extraServicesTitle}>{t("bookingFlow.extraServices", { fallback: "Extra Services" })}</h2>

          <div className={styles.infoBox}>
            <FiInfo className={styles.infoIcon} />
            <p className={styles.infoText}>
              {t("bookingFlow.extraServicesInfo", { fallback: "These services are not included in regular cleaning and can be added for an additional fee." })}
            </p>
          </div>

          <div className={styles.priceSummary}>
            <div className={styles.priceSummaryRow}>
              <span className={styles.priceSummaryLabel}>{t("bookingFlow.baseCleaning", { fallback: "Base Cleaning" })}</span>
              <span className={styles.priceSummaryValue}>NOK {basePrice}</span>
            </div>
            <div className={styles.priceSummaryRow}>
              <span className={styles.priceSummaryLabelGray}>
                {selectedExtraServices.length} {t("bookingFlow.extraServiceLabel", { fallback: "Extra Service" })}
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
                NOK {totalCharges.toFixed(2)}
              </span>
            </div>
          </div>

          {Array.isArray(extraServices) && extraServices.length === 0 ? (
            <Alert
              message={t("bookingFlow.noExtraServicesAvailable", { fallback: "No extra services available" })}
              description={t("bookingFlow.noExtraServicesDescription", { fallback: "The service you selected doesn't have any extra service related, so proceed to booking or choose another service." })}
              type="info"
              showIcon
              className={styles.noServicesAlert}
            />
          ) : (
            <div className={styles.extraServicesGrid}>
              {Array.isArray(extraServices) && extraServices.map((extraService) => {
                if (!extraService) return null;
                const selected = selectedExtraServices.find(s => s.extraServiceId === extraService.id);
                const isSelected = !!selected;

                return (
                  <ExtraServiceCard
                    key={extraService.id}
                    extraService={extraService}
                    isSelected={isSelected}
                    quantity={selected?.quantity}
                    onToggle={handleServiceToggle}
                    onQuantityUpdate={handleQuantityUpdate}
                  />
                );
              })}
            </div>
          )}
          {isRecurring && selectedExtraServices.length > 0 && (
            <div className={styles.recurringCheckboxContainer}>
              <div className={styles.recurringCheckboxLeft}>
                <p className={styles.recurringCheckboxText}>
                  {t("bookingFlow.inEverySubscriptionMsg", {
                    interval: formatInterval(recurringInterval)?.toLowerCase() || "recurring",
                    fallback: `Do you want these customizations to apply to every upcoming booking in this ${formatInterval(recurringInterval)?.toLowerCase() || "recurring"} subscription?`
                  })}
                </p>
                <span className={styles.recurringCheckboxSubtext}>
                  {t("bookingFlow.recurringDesc", { fallback: "Turning this on ensures consistent service for all your scheduled appointments." })}
                </span>
              </div>
              <Switch
                checked={inEveryRrecurring}
                onChange={handleRecurringToggle}
                className={styles.customSwitch}
              />
            </div>
          )}
        </div>

        <PrimaryNavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          nextDisabled={false}
        />
      </div>
    </div>
  );
};

export default BookingExtraServices;
