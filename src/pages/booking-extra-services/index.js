/**
 * Booking Extra Services Page
 * Step 2 (continued): Extra services selection in multi-step booking flow
 */

import HeaderBar from "@/components/BookService/HeaderBar";
import PrimaryNavigationButtons from "@/components/common/Booking/PrimaryNavigationButtons";
import SelectedServiceCard from "@/components/common/Booking/SelectedServiceCard";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useTranslation } from "@/hooks/useTranslation";
import { toggleExtraService } from "@/redux/reducers/bookingSlice";
import styles from "@/styles/BookingExtraServices.module.css";
import { getServiceIcon } from "@/utils/utils";
import { Alert, Radio } from "antd";
import { useRouter } from "next/router";
import { useMemo } from "react";
import {
  FiArchive,
  FiBox,
  FiInfo,
  FiPackage,
  FiSquare
} from "react-icons/fi";
import { GiWashingMachine } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";



const EXTRA_SERVICE_ICON_MAP = {
  "Inside Oven": FiBox,
  "Inside Fridge": FiPackage,
  "Inside Cabinets": FiArchive,
  "Interior Windows": FiSquare,
  "Laundry & Ironing": GiWashingMachine,
  "Laundry Service": GiWashingMachine,
};



const getExtraServiceIcon = (serviceName) => {
  return EXTRA_SERVICE_ICON_MAP[serviceName] || FiBox;
};

const BookingExtraServices = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { currentPrice, selectedService } = useServicePricing();
  const availableExtraServices = useSelector((state) => state.booking.availableExtraServices);
  const selectedExtraServiceIds = useSelector(
    (state) => state.booking.selectedExtraServiceIds,
  );

  const extraServices = availableExtraServices || [];
  const basePrice = currentPrice;

  const extraServicesTotal = useMemo(() => {
    return extraServices
      .filter((service) => selectedExtraServiceIds.includes(service.id))
      .reduce((total, service) => total + parseFloat(service.price), 0);
  }, [selectedExtraServiceIds, extraServices]);

  const totalCharges = basePrice + extraServicesTotal;

  const handleServiceToggle = (serviceId) => {
    dispatch(toggleExtraService(serviceId));
  };

  const handleBack = () => {
    router.push("/booking-details");
  };

  const handleNext = () => {
    router.push("/booking-details-extra");
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
                {selectedExtraServiceIds.length} {t("bookingFlow.extraServiceLabel", { fallback: "Extra Service" })}
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
                const IconComponent = getExtraServiceIcon(extraService.name);
                const bucketUrl = process.env.NEXT_PUBLIC_AWS_PUBLIC_BUCKET_URL;

                return (
                  <div
                    key={extraService.id || Math.random()}
                    className={`${styles.extraServiceCard} ${selectedExtraServiceIds.includes(extraService.id)
                      ? styles.extraServiceCardSelected
                      : ""
                      }`}
                    onClick={() => handleServiceToggle(extraService.id)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleServiceToggle(extraService.id);
                      }
                    }}
                  >
                    <div className={styles.extraServiceIconContainer}>
                      {extraService.icon && extraService.icon.length > 0 ? (
                        <>
                          <img
                            src={extraService.icon.startsWith('http') ? extraService.icon : `${bucketUrl}/${extraService.icon}`}
                            alt={extraService.name || ""}
                            className={styles.extraServiceIconImage}
                            onError={(e) => {
                              // Hide image on error and show fallback
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.parentElement.querySelector(`[data-fallback="true"]`);
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                          {IconComponent && (
                            <IconComponent
                              data-fallback="true"
                              className={styles.extraServiceIcon}
                              style={{ display: 'none' }}
                            />
                          )}
                        </>
                      ) : (
                        IconComponent && <IconComponent className={styles.extraServiceIcon} />
                      )}
                    </div>
                    <div className={styles.extraServiceInfo}>
                      <h4 className={styles.extraServiceName}>
                        {extraService.name || ""}
                      </h4>
                      {extraService.description && (
                        <p className={styles.extraServiceDescription}>
                          {extraService.description}
                        </p>
                      )}
                      <p className={styles.extraServicePrice}>
                        NOK {parseFloat(extraService.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <Radio
                      checked={selectedExtraServiceIds.includes(
                        extraService.id,
                      )}
                      className={styles.extraServiceRadio}
                    />
                  </div>
                );
              })}
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
