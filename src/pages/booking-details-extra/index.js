/**
 * Booking Details Extra Page
 * Step 2 (continued): Additional information collection
 * Includes parking, pets, key access, and other notes
 */

import HeaderBar from "@/components/BookService/HeaderBar";
import PrimaryNavigationButtons from "@/components/common/Booking/PrimaryNavigationButtons";
import SelectedServiceCard from "@/components/common/Booking/SelectedServiceCard";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useTranslation } from "@/hooks/useTranslation";
import { getAppSettings } from "@/api";
import { setSettings } from "@/redux/reducers/settingsSlice";
import {
  setAccessMethod,
  setHasFreeParking,
  setHasPets,
  setSpecialInstructions,
} from "@/redux/reducers/bookingSlice";
import styles from "@/styles/BookingDetailsExtra.module.css";
import { getServiceIcon } from "@/utils/utils";
import { Input, Radio } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const { TextArea } = Input;



// Constants removed to use dynamic settings from Redux

const BookingDetailsExtra = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { currentPrice, selectedService } = useServicePricing();
  const hasFreeParking = useSelector((state) => state.booking.hasFreeParking);
  const hasPets = useSelector((state) => state.booking.hasPets);
  const accessMethod = useSelector((state) => state.booking.accessMethod);
  const specialInstructions = useSelector(
    (state) => state.booking.specialInstructions,
  );

  const priceSettings = useSelector((state) => state.settings.priceSettings);
  const parkingSurcharge = priceSettings?.parkingSurcharge || 135;
  const petSurcharge = priceSettings?.petSurcharge || 208;

  useEffect(() => {
    if (router.isReady && !selectedService) {
      router.push("/book-service");
    }
  }, [selectedService, router]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getAppSettings();
        dispatch(setSettings(response.data));
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, [dispatch]);

  const handleParkingChange = (e) => {
    dispatch(setHasFreeParking(e.target.value === "yes"));
  };

  const handlePetsChange = (e) => {
    dispatch(setHasPets(e.target.value === "yes"));
  };

  const handleKeyAccessChange = (e) => {
    const value = e.target.value === "key" ? "KEY" : "MEET_AT_DOOR";
    dispatch(setAccessMethod(value));
  };

  const handleOtherInfoChange = (e) => {
    dispatch(setSpecialInstructions(e.target.value));
  };

  const handleBack = () => {
    const hasExtraServices = selectedService?.extraServices?.length > 0 || selectedService?.extraervices?.length > 0;
    if (hasExtraServices) {
      router.push("/booking-extra-services");
    } else {
      router.push("/booking-details");
    }
  };

  const handleNext = () => {
    router.push("/booking-date");
  };

  if (!selectedService) {
    return null;
  }

  const ServiceIcon = getServiceIcon(selectedService.name);

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
          <h2 className={styles.sectionTitle}>
            {t('bookingFlow.importantInfo', { fallback: 'Important additional information regarding your order' })}
          </h2>

          <div className={styles.questionSection}>
            <label className={styles.questionLabel}>
              {t('bookingFlow.freeParking', { fallback: 'Is there free parking nearby?' })}
            </label>
            <Radio.Group
              value={hasFreeParking ? "yes" : "no"}
              onChange={handleParkingChange}
              className={styles.radioGroup}
            >
              <div className={styles.radioGrid}>
                <Radio.Button
                  value="yes"
                  className={`${styles.radioCard} ${hasFreeParking ? styles.radioCardSelected : ""
                    }`}
                >
                  <span className={styles.radioText}>{t('bookingFlow.yes', { fallback: 'Yes' })} → {t('bookingFlow.noSurcharge', { fallback: 'No surcharge' })}</span>
                </Radio.Button>
                <Radio.Button
                  value="no"
                  className={`${styles.radioCard} ${!hasFreeParking ? styles.radioCardSelected : ""
                    }`}
                >
                  <span className={styles.radioText}>
                    {t('bookingFlow.no', { fallback: 'No' })} → {t('bookingFlow.parkingSurcharge', { fallback: `NOK ${parkingSurcharge} surcharge per service`, price: parkingSurcharge })}
                  </span>
                </Radio.Button>
              </div>
            </Radio.Group>
          </div>

          <div className={styles.questionSection}>
            <label className={styles.questionLabel}>
              {t('bookingFlow.petsRequiringExtraCleaning', { fallback: 'Do you have pets that require extra cleaning (dog, cat, rabbit)?' })}
            </label>
            <Radio.Group
              value={hasPets ? "yes" : "no"}
              onChange={handlePetsChange}
              className={styles.radioGroup}
            >
              <div className={styles.radioGrid}>
                <Radio.Button
                  value="yes"
                  className={`${styles.radioCard} ${hasPets ? styles.radioCardSelected : ""
                    }`}
                >
                  <span className={styles.radioText}>
                    {t('bookingFlow.yes', { fallback: 'Yes' })} → {t('bookingFlow.petsSurcharge', { fallback: `NOK ${petSurcharge} extra`, price: petSurcharge })}
                  </span>
                </Radio.Button>
                <Radio.Button
                  value="no"
                  className={`${styles.radioCard} ${!hasPets ? styles.radioCardSelected : ""
                    }`}
                >
                  <span className={styles.radioText}>{t('bookingFlow.no', { fallback: 'No' })} → {t('bookingFlow.noExtraCharge', { fallback: 'No extra charge' })}</span>
                </Radio.Button>
              </div>
            </Radio.Group>
          </div>

          <div className={styles.questionSection}>
            <label className={styles.questionLabel}>{t('bookingFlow.keyAndAccess', { fallback: 'Key & Access' })}</label>
            <Radio.Group
              value={accessMethod === "KEY" ? "key" : "meet"}
              onChange={handleKeyAccessChange}
              className={styles.radioGroup}
            >
              <div className={styles.radioGrid}>
                <Radio.Button
                  value="key"
                  className={`${styles.radioCard} ${accessMethod === "KEY" ? styles.radioCardSelected : ""
                    }`}
                >
                  <span className={styles.radioText}>{t('bookingFlow.key', { fallback: 'Key' })}</span>
                </Radio.Button>
                <Radio.Button
                  value="meet"
                  className={`${styles.radioCard} ${accessMethod === "MEET_AT_DOOR"
                    ? styles.radioCardSelected
                    : ""
                    }`}
                >
                  <span className={styles.radioText}>
                    {t('bookingFlow.meetAtDoor', { fallback: 'Meet us at the door and let us in' })}
                  </span>
                </Radio.Button>
              </div>
            </Radio.Group>
          </div>

          <div className={styles.questionSection}>
            <label className={styles.questionLabel}>{t('bookingFlow.otherInformation', { fallback: 'Other Information' })}</label>
            <TextArea
              value={specialInstructions}
              onChange={handleOtherInfoChange}
              placeholder={t('bookingFlow.otherInformation', { fallback: 'Other information' })}
              className={styles.textArea}
              rows={4}
            />
          </div>
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

export default BookingDetailsExtra;
