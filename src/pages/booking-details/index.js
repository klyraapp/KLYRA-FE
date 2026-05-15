import HeaderBar from "@/components/BookService/HeaderBar";
import PrimaryNavigationButtons from "@/components/common/Booking/PrimaryNavigationButtons";
import SelectableCard from "@/components/common/Booking/SelectableCard";
import SelectedServiceCard from "@/components/common/Booking/SelectedServiceCard";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useTranslation } from "@/hooks/useTranslation";
import {
  setAccommodationType,
  setAreaSqm,
  setNumberOfBathrooms,
  setRecurringInterval
} from "@/redux/reducers/bookingSlice";
import styles from "@/styles/BookingDetailsPage.module.css";
import { getServiceIcon } from "@/utils/utils";
import { InfoCircleOutlined } from "@ant-design/icons";
import { InputNumber, Slider, Tooltip } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiGrid,
  FiHome,
  FiRepeat,
  FiTrendingUp,
  FiUsers
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const ACCOMMODATION_OPTIONS = [
  { key: "house", labelKey: "bookingFlow.house", defaultLabel: "House", icon: FiHome, value: "HOUSE" },
  { key: "apartment", labelKey: "bookingFlow.apartment", defaultLabel: "Apartment", icon: FiGrid, value: "APARTMENT" },
  {
    key: "owner",
    labelKey: "bookingFlow.ownerSection",
    defaultLabel: "Owner Section",
    icon: FiUsers,
    value: "OWNER_SECTION",
  },
];

const INTERVAL_OPTIONS = [
  {
    key: "weekly",
    icon: FiCalendar,
    titleKey: "bookingFlow.weekly",
    title: "Weekly",
    subtitleKey: "bookingFlow.weeklySubtitle",
    subtitle: "Recurring every week",
    value: "WEEKLY",
  },
  {
    key: "biweekly",
    icon: FiClock,
    titleKey: "bookingFlow.biweekly",
    title: "Every Second Week",
    subtitleKey: "bookingFlow.biweeklySubtitle",
    subtitle: "Recurring every 2 weeks",
    value: "EVERY_SECOND_WEEK",
  },
  {
    key: "triweekly",
    icon: FiRepeat,
    titleKey: "bookingFlow.triweekly",
    title: "Every Third Week",
    subtitleKey: "bookingFlow.triweeklySubtitle",
    subtitle: "Recurring every 3 weeks",
    value: "EVERY_THIRD_WEEK",
  },
  {
    key: "monthly",
    icon: FiTrendingUp,
    titleKey: "bookingFlow.monthly",
    title: "Monthly",
    subtitleKey: "bookingFlow.monthlySubtitle",
    subtitle: "Recurring every month",
    value: "MONTHLY",
  },
];

const BookingDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    currentPrice,
    areaTooltipContent,
    selectedService,
    areaSqm,
    recurringInterval,
  } = useServicePricing();

  const accommodationType = useSelector(
    (state) => state.booking.accommodationType,
  );
  const numberOfBathrooms = useSelector(
    (state) => state.booking.numberOfBathrooms,
  );

  useEffect(() => {
    if (router.isReady && !selectedService) {
      router.push("/book-service");
    }
  }, [selectedService, router]);

  const handleAccommodationSelect = (option) => {
    dispatch(setAccommodationType(option.value));
  };

  const hasRecurringPriceRule = selectedService?.pricingRules?.some(
    (rule) => rule.serviceType?.toUpperCase() === "RECURRING" && rule.ruleType?.toUpperCase() === "BASE"
  );

  const hasOneTimePriceRule = selectedService?.pricingRules?.some(
    (rule) => rule.serviceType?.toUpperCase() === "ONE_TIME" && rule.ruleType?.toUpperCase() === "BASE"
  );

  const isIntervalRequired = (selectedService?.allowRecurringBookings && hasRecurringPriceRule) &&
    (!selectedService?.allowOneTimeBookings || !hasOneTimePriceRule);

  const handleIntervalSelect = (option) => {
    // If the interval is mandatory, we don't allow deselecting it
    if (isIntervalRequired && recurringInterval === option.value) {
      return;
    }
    const newValue = recurringInterval === option.value ? null : option.value;
    dispatch(setRecurringInterval(newValue));
  };

  const handleBathroomsChange = (value) => {
    dispatch(setNumberOfBathrooms(value || 1));
  };

  const handleAreaChange = (value) => {
    dispatch(setAreaSqm(value));
  };

  const handleBack = () => {
    router.push("/book-service");
  };

  const handleNext = () => {
    const hasExtraServices = selectedService?.extraServices?.length > 0 || selectedService?.extraervices?.length > 0;
    if (hasExtraServices) {
      router.push({
        pathname: "/booking-extra-services",
        query: { service: selectedService.id },
      });
    } else {
      router.push({
        pathname: "/booking-details-extra",
        query: { service: selectedService.id },
      });
    }
  };

  if (!selectedService) {
    return null;
  }

  const ServiceIcon = getServiceIcon(selectedService.name);
  const showRecurringInterval = !!selectedService?.allowRecurringBookings && hasRecurringPriceRule;

  const getNextButtonTooltip = () => {
    if (!accommodationType && isIntervalRequired && !recurringInterval) {
      return t('bookingFlow.accommodationAndIntervalMissing', { fallback: "Accommodation type and cleaning interval are not selected and should be selected to proceed" });
    }
    if (!accommodationType) {
      return t('bookingFlow.accommodationTypeMissing', { fallback: "Accommodation type is not selected and should be selected to proceed" });
    }
    if (isIntervalRequired && !recurringInterval) {
      return t('bookingFlow.cleaningIntervalMissing', { fallback: "Cleaning interval is not selected and should be selected to proceed" });
    }
    return "";
  };

  const isNextDisabled = !accommodationType || (isIntervalRequired && !recurringInterval);

  return (
    <div className={styles.pageWrapper}>
      <HeaderBar currentStep={2} />
      <div className={styles.pageContainer}>
        <SelectedServiceCard
          serviceName={selectedService.name}
          price={currentPrice}
          icon={selectedService.icon}
          fallbackIcon={ServiceIcon}
        />

        <div className={styles.formSection}>
          <div className={styles.section}>
            <label className={styles.sectionLabel}>{t('bookingFlow.accommodation', { fallback: 'Accommodation' })}</label>
            <div className={styles.accommodationGrid}>
              {ACCOMMODATION_OPTIONS.map((option) => (
                <SelectableCard
                  key={option.key}
                  icon={option.icon}
                  title={t(option.labelKey, { fallback: option.defaultLabel })}
                  selected={accommodationType === option.value}
                  onClick={() => handleAccommodationSelect(option)}
                  variant="vertical"
                />
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.sectionLabel}>{t('bookingFlow.numberOfBathrooms', { fallback: 'Number of Bathrooms' })}</label>
            <InputNumber
              min={1}
              max={10}
              value={numberOfBathrooms}
              onChange={handleBathroomsChange}
              className={styles.bathroomInput}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.sectionLabel}>
              {t('bookingFlow.areaSqm', { fallback: 'Area sqm' })}
              <Tooltip title={t('bookingFlow.areaTooltip', { fallback: areaTooltipContent })} placement="top">
                <InfoCircleOutlined className={styles.infoIcon} />
              </Tooltip>
            </label>
            <div className={styles.sliderContainer}>
              <Slider
                min={10}
                max={500}
                value={areaSqm}
                onChange={handleAreaChange}
                className={styles.slider}
                tooltip={{ open: false }}
              />
              <span className={styles.sliderValue}>{areaSqm} {t('bookingFlow.sqm', { fallback: 'sqm' })}</span>
            </div>
          </div>

          {showRecurringInterval && (
            <div className={styles.section}>
              <label className={styles.sectionLabel}>
                {t('bookingFlow.cleaningInterval', { fallback: 'Cleaning Interval' })}
                <Tooltip
                  title={t('bookingFlow.intervalDiscountInfo', { fallback: "Selecting a recurring interval provides a frequent cleaning discount. The base price and additional area rates are adjusted accordingly." })}
                  placement="top"
                >
                  <InfoCircleOutlined className={styles.infoIcon} />
                </Tooltip>
              </label>
              <div className={styles.intervalGrid}>
                {INTERVAL_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option.key}
                    icon={option.icon}
                    title={t(option.titleKey, { fallback: option.title })}
                    subtitle={t(option.subtitleKey, { fallback: option.subtitle })}
                    selected={recurringInterval === option.value}
                    onClick={() => handleIntervalSelect(option)}
                    variant="horizontal"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <PrimaryNavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          nextDisabled={isNextDisabled}
          nextTooltip={getNextButtonTooltip()}
        />
      </div>
    </div>
  );
};

export default BookingDetails;
