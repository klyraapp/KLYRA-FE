/**
 * Booking Confirmation Page
 * Displays successful booking confirmation after payment completion
 */

import HeaderBar from "@/components/BookService/HeaderBar";
import SelectedServiceCard from "@/components/common/Booking/SelectedServiceCard";
import PaymentSummary from "@/components/payment/PaymentSummary";
import { formatLongDate } from "@/helpers/dateFormatter";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useTranslation } from "@/hooks/useTranslation";
import { getBookingById } from "@/services/payment/paymentService";
import styles from "@/styles/booking/Confirmation.module.css";
import { getServiceIcon } from "@/utils/utils";
import { CheckCircleFilled } from "@ant-design/icons";
import { Alert, Button, Spin } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  FiChevronDown,
  FiHome
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { useGTMPurchaseTracking } from "@/hooks/useGTM";



const ConfirmationPage = () => {
  const router = useRouter();
  const { bookingId } = router.query;
  const { t, currentLanguage } = useTranslation();

  const {
    currentPrice,
    selectedService,
    areaSqm: reduxAreaSqm,
    isRecurring: reduxIsRecurring,
    recurringInterval: reduxRecurringInterval,
  } = useServicePricing();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDetailsExpanded, setBookingDetailsExpanded] = useState(true);

  // Requirement 4 & 8: GA4 Items mapping & reusable purchase tracking
  const purchaseData = {
    transaction_id: booking?.id || bookingId,
    value: parseFloat(booking?.totalAmount || 0),
    currency: booking?.currency || "NOK",
    tax: parseFloat(booking?.taxAmount || 0),
    shipping: 0,
    payment_method: "stripe",
    items: [
      {
        item_id: booking?.service?.id || selectedService?.id || 'cleaning-service',
        item_name: booking?.service?.name || selectedService?.name || 'Cleaning Service',
        price: parseFloat(booking?.subtotal || 0),
        quantity: 1
      }
    ]
  };

  useGTMPurchaseTracking(
    !loading && !!booking && !error && (booking.status === 'CONFIRMED' || booking.status === 'PAID' || !!booking.id),
    purchaseData
  );
  const firstName = useSelector((state) => state.booking.firstName);
  const lastName = useSelector((state) => state.booking.lastName);
  const accommodationType = useSelector(
    (state) => state.booking.accommodationType,
  );
  const bookingDate = useSelector((state) => state.booking.bookingDate);
  const serviceStreetAddress = useSelector(
    (state) => state.booking.serviceStreetAddress,
  );
  const servicePostalCode = useSelector(
    (state) => state.booking.servicePostalCode,
  );

  const fetchBookingDetails = useCallback(async () => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    try {
      const response = await getBookingById(bookingId);
      setBooking(response.data || response);
    } catch (err) {
      console.error("Failed to fetch booking:", err);
      setError(
        t("bookingFlow.noBookingReference", {
          fallback: "Unable to load booking details.",
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [bookingId, t]);

  useEffect(() => {
    if (router.isReady) {
      fetchBookingDetails();
    }
  }, [router.isReady, fetchBookingDetails]);

  const handleGoToBookings = () => {
    router.push("/bookings");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <p className={styles.loadingText}>
          {t("common.loading", { fallback: "Loading..." })}
        </p>
      </div>
    );
  }

  // Use booking data if available, otherwise use Redux state
  const serviceData = booking?.service || selectedService;
  const customerName = booking
    ? (booking.contactFirstName || booking.contactLastName) ? `${booking.contactFirstName || ""} ${booking.contactLastName || ""}` : t('common.anonymous', { fallback: 'No Name' })
    : (firstName || lastName) ? `${firstName || ""} ${lastName || ""}`.trim() : t('common.anonymous', { fallback: 'No Name' });

  const serviceType = booking?.accommodationType || accommodationType;
  const displayDate =
    booking?.bookingDate || bookingDate
      ? formatLongDate(booking?.bookingDate || bookingDate, currentLanguage)
      : "Wednesday - April 23, 2025";
  const displayArea = booking?.areaSqm || reduxAreaSqm || 130;
  const displayAddress = booking
    ? `${booking.serviceStreetAddress || ""}, ${booking.servicePostalCode || ""}`
    : `${serviceStreetAddress || "5345 Nw 120 ave"}, ${servicePostalCode || "333077"}`;

  const ServiceIcon = serviceData ? getServiceIcon(serviceData.name) : FiHome;

  // Use price from booking metadata if available, otherwise fallback to dynamic frontend calc
  const displayPrice = booking?.priceBreakdown?.basePrice || currentPrice;

  const calculation = booking
    ? {
      subtotal: parseFloat(booking.subtotal || 0),
      taxRate: parseFloat(booking.taxRate || 0),
      taxAmount: parseFloat(booking.taxAmount || 0),
      totalAmount: parseFloat(booking.totalAmount || 0),
      discountAmount: parseFloat(booking.discountAmount || 0),
      priceBreakdown: booking.priceBreakdown,
      parkingCost: parseFloat(booking.parkingSurcharge || 0),
      petCost: parseFloat(booking.petSurcharge || 0),
      weekendSurcharge: parseFloat(booking.weekendSurcharge || 0),
    }
    : null;

  return (
    <div className={styles.pageWrapper}>
      <HeaderBar currentStep={6} />

      <div className={styles.pageContainer}>
        {serviceData && (
          <SelectedServiceCard
            serviceName={serviceData.name}
            price={displayPrice}
            icon={serviceData.icon}
            fallbackIcon={ServiceIcon}
          />
        )}

        <div className={styles.customerSection}>
          <div className={styles.customerRow}>
            <div className={styles.customerInfo}>
              <div className={styles.customerName}>{customerName}</div>
              <div className={styles.serviceType}>
                {serviceType === "HOUSE"
                  ? t("bookingFlow.house")
                  : serviceType === "APARTMENT"
                    ? t("bookingFlow.apartment")
                    : t("bookingFlow.ownerSection")}
              </div>
            </div>

            {/* Success Badge */}
            <div className={styles.successBadge}>
              <CheckCircleFilled className={styles.successIcon} />
              <span className={styles.successText}>
                {t("bookingFlow.paymentSuccessful", {
                  fallback: "Payment Successful!",
                })}
              </span>
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                {t("table.date", { fallback: "Date" })}
              </span>
              <span className={styles.infoValue}>{displayDate}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                {t("table.area", { fallback: "Area" })}
              </span>
              <span className={styles.infoValue}>
                {displayArea} m²
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                {t("bookingFlow.location", { fallback: "Location" })}
              </span>
              <span className={styles.infoValue}>{displayAddress}</span>
            </div>
            {((booking && booking.subscription) || reduxRecurringInterval) && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  {t("bookingFlow.cleaningInterval", { fallback: "Interval" })}
                </span>
                <span className={styles.infoValue}>
                  {t(`bookingFlow.${(booking?.subscription?.recurringIntervalType || reduxRecurringInterval)?.toLowerCase()}`, {
                    fallback: booking?.subscription?.recurringIntervalType || reduxRecurringInterval
                  })}
                </span>
              </div>
            )}
          </div>

          <div
            className={styles.bookingDetailsToggle}
            onClick={() => setBookingDetailsExpanded(!bookingDetailsExpanded)}
          >
            <span>
              {t("bookingFlow.bookingDetails", { fallback: "Booking Details" })}
            </span>
            <FiChevronDown
              className={
                bookingDetailsExpanded ? styles.chevronUp : styles.chevronDown
              }
            />
          </div>

          {bookingDetailsExpanded && calculation && (
            <div className={styles.bookingDetailsContent}>
              <PaymentSummary
                calculation={calculation}
                serviceName={serviceData?.name}
                isRecurring={booking ? !!booking.subscription : reduxIsRecurring}
                recurringInterval={booking?.subscription?.recurringIntervalType || reduxRecurringInterval}
              />
            </div>
          )}
        </div>

        {/* Confirmation Message */}
        <div className={styles.confirmationMessage}>
          <p className={styles.messageText}>
            {t("bookingFlow.bookingConfirmed", {
              serviceName: serviceData?.name,
              fallback: `Your ${serviceData?.name || "cleaning"} service is confirmed!`,
            })}
          </p>
          <p className={styles.messageSubtitle}>
            {t("bookingFlow.bookingConfirmedSubtitle", {

              fallback: "You will receive a confirmation email with details about your booking.",
            })}
          </p>
        </div>

        {error && (
          <Alert
            type="warning"
            message={error}
            showIcon
            className={styles.errorAlert}
          />
        )}

        <div className={styles.actions}>
          <Button
            type="primary"
            className={styles.primaryButton}
            onClick={handleGoToBookings}
          >
            {t("bookingFlow.viewMyBookings", { fallback: "View My Bookings" })}
          </Button>
          <Button className={styles.secondaryButton} onClick={handleGoHome}>
            {t("bookingFlow.backToHome", { fallback: "Back to Home" })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
