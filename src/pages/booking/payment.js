/**
 * Payment Page - Step 7 of booking flow
 *
 * Handles price calculation, promo codes, offers, payment method selection,
 * and all payment integrations:
 *   - Stripe Card     (inline PaymentElement, no redirect)
 *   - Stripe Klarna   (inline PaymentElement → Stripe redirects to Klarna)
 *   - Vipps           (backend returns redirectUrl, full-page navigation)
 *
 * Card and Klarna share the exact same "create booking → render Stripe
 * PaymentElement" plumbing — the only differences are the payment method
 * sent to the backend and the return URL + billing details passed to Stripe
 * for Klarna.
 */

import { calculateBookingPrice } from "@/api/bookingsApi";
import { getActiveOffers } from "@/api/offersApi";
import OfferSelectionCard from "@/components/booking/OfferSelectionCard";
import PaymentMethodSelector from "@/components/booking/PaymentMethodSelector";
import PriceDetailsCard from "@/components/booking/PriceDetailsCard";
import PromoCodeSection from "@/components/booking/PromoCodeSection";
import HeaderBar from "@/components/BookService/HeaderBar";
import PrimaryNavigationButtons from "@/components/common/Booking/PrimaryNavigationButtons";
import SelectedServiceCard from "@/components/common/Booking/SelectedServiceCard";
import PaymentElementForm from "@/components/payment/PaymentElementForm";
import StripeProvider from "@/components/payment/StripeProvider";
import {
  ONE_TIME_ONLY_PAYMENT_METHODS,
  PaymentMethodEnum,
  PaymentRedirectOverlay,
  persistKlarnaBookingId,
  persistVippsBookingId,
} from "@/features/vipps";
import { formatLongDate } from "@/helpers/dateFormatter";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useTranslation } from "@/hooks/useTranslation";
import {
  setOfferId,
  setPaymentMethod,
  setPromoCode,
} from "@/redux/reducers/bookingSlice";
import {
  createBookingWithPayment,
  createVippsBooking,
} from "@/services/payment/paymentService";
import styles from "@/styles/booking/Payment.module.css";
import { getServiceIcon } from "@/utils/utils";
import { Alert, message, Spin } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiInfo } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const ISO_COUNTRY_BY_NAME = {
  NORWAY: "NO",
  SWEDEN: "SE",
  DENMARK: "DK",
  FINLAND: "FI",
  GERMANY: "DE",
  FRANCE: "FR",
  NETHERLANDS: "NL",
  BELGIUM: "BE",
  AUSTRIA: "AT",
  SWITZERLAND: "CH",
  SPAIN: "ES",
  ITALY: "IT",
  PORTUGAL: "PT",
  POLAND: "PL",
  CZECHIA: "CZ",
  GREECE: "GR",
  IRELAND: "IE",
  ROMANIA: "RO",
  "UNITED KINGDOM": "GB",
  UK: "GB",
  "GREAT BRITAIN": "GB",
  "UNITED STATES": "US",
  USA: "US",
  CANADA: "CA",
  AUSTRALIA: "AU",
  "NEW ZEALAND": "NZ",
};

const normalizeCountryCode = (country) => {
  if (!country) return "NO";
  const trimmed = String(country).trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  return ISO_COUNTRY_BY_NAME[trimmed.toUpperCase()] || "NO";
};

const PaymentPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, currentLanguage } = useTranslation();

  const {
    currentPrice,
    selectedService,
    areaSqm,
    isRecurring,
    recurringInterval,
  } = useServicePricing();

  // Redux state selectors
  const accommodationType = useSelector(
    (state) => state.booking.accommodationType,
  );
  const numberOfBathrooms = useSelector(
    (state) => state.booking.numberOfBathrooms,
  );
  const selectedExtraServices = useSelector(
    (state) => state.booking.selectedExtraServices,
  );
  const inEveryRrecurring = useSelector((state) => state.booking.inEveryRrecurring);
  const hasFreeParking = useSelector((state) => state.booking.hasFreeParking);
  const hasPets = useSelector((state) => state.booking.hasPets);
  const accessMethod = useSelector((state) => state.booking.accessMethod);
  const specialInstructions = useSelector(
    (state) => state.booking.specialInstructions,
  );
  const bookingDate = useSelector((state) => state.booking.bookingDate);
  const preferredTime = useSelector((state) => state.booking.preferredTime);
  const firstName = useSelector((state) => state.booking.firstName);
  const lastName = useSelector((state) => state.booking.lastName);
  const email = useSelector((state) => state.booking.email);
  const phone = useSelector((state) => state.booking.phone);
  const serviceStreetAddress = useSelector(
    (state) => state.booking.serviceStreetAddress,
  );
  const servicePostalCode = useSelector(
    (state) => state.booking.servicePostalCode,
  );
  const serviceCity = useSelector((state) => state.booking.serviceCity);
  const serviceCountry = useSelector((state) => state.booking.serviceCountry);
  const promoCodeRedux = useSelector((state) => state.booking.promoCode);
  const offerIdRedux = useSelector((state) => state.booking.offerId);
  const authUser = useSelector((state) => state.auth?.user);
  const isGuest = authUser?.userRolePermissions?.some(
    (urp) => urp.role?.name === "guest_user"
  );

  // Local state
  const [calculation, setCalculation] = useState(null);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoCodeVisible, setPromoCodeVisible] = useState(false);
  const [promoStatus, setPromoStatus] = useState("idle");
  const [selectedOfferId, setSelectedOfferIdLocal] = useState(null);
  const [paymentMethodLocal, setPaymentMethodLocal] = useState(null);
  const [offers, setOffers] = useState([]);
  const [bookingDetailsExpanded, setBookingDetailsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);

  // Stripe payment state (shared between Card and Klarna)
  const [clientSecret, setClientSecret] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Redirect-overlay state — shown while navigating to an external provider
  // (Vipps hosted page / Klarna hosted checkout).
  const [redirectingProvider, setRedirectingProvider] = useState(null);

  useEffect(() => {
    if (router.isReady && !selectedService) {
      router.push("/book-service");
      return;
    }

    if (selectedService) {
      fetchInitialData();
    }
  }, [selectedService, router]);

  const fetchInitialData = async () => {
    await Promise.all([calculatePrice("", 0), fetchOffers()]);
  };

  const calculatePrice = useCallback(
    async (promoCode = "", offerId = 0) => {
      setLoading(true);

      const payload = {
        serviceId: selectedService?.id,
        selectedExtraService: selectedExtraServices || [],
        hasFreeParking: hasFreeParking || false,
        hasPets: hasPets || false,
        promoCode,
        offerId,
        accommodationType: accommodationType || "HOUSE",
        areaSqm: areaSqm || 130,
        isRecurring: !!isRecurring,
        recurringInterval: recurringInterval || null,
        bookingDate,
      };

      try {
        const response = await calculateBookingPrice(payload);

        if (response.data && response.data.data) {
          setCalculation(response.data.data);
          return response.data.data;
        } else {
          throw new Error("Calculation failed");
        }
      } catch (error) {
        message.error(
          error.response?.data?.message || t("messages.calculatePriceFailed", { fallback: "Failed to calculate price" }),
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      selectedService,
      selectedExtraServices,
      hasFreeParking,
      hasPets,
      accommodationType,
      areaSqm,
      isRecurring,
      recurringInterval,
      bookingDate,
    ],
  );

  const fetchOffers = async () => {
    try {
      const response = await getActiveOffers();

      let offersData = [];

      if (response?.data) {
        if (response.data.offers && Array.isArray(response.data.offers)) {
          offersData = response.data.offers;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          offersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          offersData = response.data;
        }
      }

      if (offersData.length > 0) {
        const now = new Date();

        const activeOffers = offersData.filter((offer) => {
          if (!offer.isActive) return false;

          try {
            const validFrom = new Date(offer.validFrom);
            const validTo = new Date(offer.validTo);

            return now >= validFrom && now <= validTo;
          } catch (e) {
            return false;
          }
        });

        setOffers(activeOffers);
      } else {
        setOffers([]);
      }
    } catch (error) {
      setOffers([]);
    }
  };

  const handlePromoCodeToggle = () => {
    setPromoCodeVisible(!promoCodeVisible);
  };

  const handlePromoCodeApply = async () => {
    setPromoStatus("idle");
    const code = promoCodeInput.trim();
    if (!code) {
      message.warning(t("messages.pleaseEnterPromoCode", { fallback: "Please enter a promo code" }));
      return;
    }

    if (code.length > 50) {
      message.error(t("messages.promoCodeTooLong", { fallback: "Promo code cannot exceed 50 characters" }));
      return;
    }

    const calculationData = await calculatePrice(code, 0);

    if (calculationData && calculationData.promoCodeEntity) {
      setPromoStatus("success");
      setSelectedOfferIdLocal(null);
      dispatch(setPromoCode(code));
      dispatch(setOfferId(0));
      message.success(t("messages.promoCodeApplied", { fallback: "Promo code applied successfully" }));
    } else {
      setPromoStatus("error");
    }
  };

  const handlePromoCodeRemove = async () => {
    const calculationData = await calculatePrice("", 0);
    if (calculationData) {
      setPromoCodeInput("");
      setPromoStatus("idle");
      dispatch(setPromoCode(""));
      message.success(t("messages.promoCodeRemoved", { fallback: "Promo code removed" }));
    }
  };

  const handlePromoCodeChange = (value) => {
    if (promoStatus === "error") setPromoStatus("idle");
    if (value.length <= 50) {
      setPromoCodeInput(value);
    }
  };

  const handleOfferSelect = async (offerId) => {
    if (selectedOfferId === offerId) {
      const data = await calculatePrice("", 0);
      if (data) {
        setSelectedOfferIdLocal(null);
        dispatch(setOfferId(0));
        setPromoCodeVisible(true);
        message.success(t("messages.offerRemoved", { fallback: "Offer removed" }));
      }
      return;
    }

    const data = await calculatePrice("", offerId);

    if (data) {
      setSelectedOfferIdLocal(offerId);
      setPromoCodeInput("");
      setPromoStatus("idle");
      setPromoCodeVisible(false);
      dispatch(setPromoCode(""));
      dispatch(setOfferId(offerId));
      message.success(t("messages.offerApplied", { fallback: "Offer applied successfully" }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethodLocal(method);
    dispatch(setPaymentMethod(method));
    // Reset any in-flight Stripe payment state whenever the method changes.
    setShowPaymentForm(false);
    setClientSecret(null);
    setBookingId(null);
    setBookingError(null);
  };

  const handleBack = () => {
    if (showPaymentForm) {
      setShowPaymentForm(false);
      setClientSecret(null);
      setBookingId(null);
      setBookingError(null);
      setRedirectingProvider(null);
      return;
    }
    router.push("/booking-customer-info");
  };

  const handleNext = async () => {
    if (paymentMethodLocal === PaymentMethodEnum.VIPPS) {
      await createVippsBookingAndRedirect();
      return;
    }
    if (
      paymentMethodLocal === PaymentMethodEnum.CARD ||
      paymentMethodLocal === PaymentMethodEnum.KLARNA
    ) {
      await createStripeBookingAndShowForm(paymentMethodLocal);
    }
  };

  /**
   * Builds the booking payload shared by every payment method. Only the
   * `paymentMethod` field and provider-specific additions (e.g. `returnUrl`
   * for Vipps) vary between flows.
   */
  const buildBaseBookingPayload = (paymentMethod) => ({
    serviceId: selectedService?.id,
    selectedExtraService: selectedExtraServices || [],
    inEveryRrecurring: Boolean(inEveryRrecurring),
    accommodationType: accommodationType || "HOUSE",
    numberOfBathrooms: numberOfBathrooms || 1,
    areaSqm: areaSqm || 130,
    hasFreeParking: Boolean(hasFreeParking),
    hasPets: Boolean(hasPets),
    isRecurring: !!isRecurring,
    recurringInterval: isRecurring ? recurringInterval : null,
    accessMethod: accessMethod || "MEET_AT_DOOR",
    specialInstructions: specialInstructions || "",
    bookingDate: bookingDate,
    startTime: preferredTime || "09:00:00",
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    serviceStreetAddress: serviceStreetAddress,
    servicePostalCode: servicePostalCode,
    promoCode: promoCodeRedux || "",
    offerId: offerIdRedux || 0,
    paymentMethod,
    webFlow: true,
  });

  /**
   * Handles the Vipps booking creation and redirect flow.
   *   1. Calls the backend with paymentMethod: VIPPS + returnUrl.
   *   2. Expects a redirectUrl in the response.
   *   3. Persists bookingId to localStorage so /payment/result can read it
   *      even if Vipps strips query params.
   *   4. Shows the branded overlay, then navigates to Vipps.
   */
  const createVippsBookingAndRedirect = async () => {
    setIsCreatingBooking(true);
    setBookingError(null);

    const baseReturnUrl = `${window.location.origin}/payment/result`;

    const bookingPayload = {
      ...buildBaseBookingPayload(PaymentMethodEnum.VIPPS),
      returnUrl: baseReturnUrl,
    };

    try {
      const { redirectUrl, bookingId: newBookingId } =
        await createVippsBooking(bookingPayload, isGuest);

      if (newBookingId) {
        persistVippsBookingId(newBookingId);
      }

      setIsCreatingBooking(false);
      setRedirectingProvider('vipps');

      // Small delay ensures the overlay renders before navigation begins.
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 400);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ??
        error?.message ??
        t("messages.vippsInitiateFailed", { fallback: "Failed to initiate Vipps payment. Please try again." });

      setBookingError(errorMessage);
      message.error(errorMessage);
      setIsCreatingBooking(false);
    }
  };

  /**
   * Creates a booking for Stripe-backed payment methods (Card or Klarna).
   * Both share the exact same backend contract: send `paymentMethod`, receive
   * `clientSecret` + `bookingId`, render the PaymentElement inline. Klarna
   * specifically will trigger a redirect on submit; Card will not.
   */
  const createStripeBookingAndShowForm = async (paymentMethod) => {
    setIsCreatingBooking(true);
    setBookingError(null);

    const bookingPayload = buildBaseBookingPayload(paymentMethod);

    try {
      const response = await createBookingWithPayment(bookingPayload, isGuest);
      const bookingData = response.data || response;

      const secret =
        bookingData?.payment?.clientSecret ?? bookingData?.clientSecret;
      const newBookingId =
        bookingData?.id ?? bookingData?.booking?.id ?? bookingData?.bookingId;

      if (!secret) {
        throw new Error(
          t("messages.noClientSecret", {
            fallback: "No client secret received from server",
          }),
        );
      }

      setClientSecret(secret);
      setBookingId(newBookingId);
      setShowPaymentForm(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("messages.bookingCreateFailed", { fallback: "Failed to create booking. Please try again." });
      setBookingError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    setRedirectingProvider(null);
    message.success(t("bookingFlow.paymentSuccessful", { fallback: "Payment successful!" }));
    router.push(`/booking/confirmation?bookingId=${bookingId}`);
  };

  const handlePaymentError = (error) => {
    setRedirectingProvider(null);
    message.error(error.message || t("messages.paymentFailed", { fallback: "Payment failed. Please try again." }));
  };

  /**
   * Called by PaymentElementForm the moment Stripe is about to redirect the
   * browser away (Klarna). Persists the bookingId for the result page and
   * shows the Klarna-branded overlay until the browser navigates.
   */
  const handleStripeRedirecting = () => {
    if (paymentMethodLocal !== PaymentMethodEnum.KLARNA) return;
    if (bookingId) persistKlarnaBookingId(bookingId);
    setRedirectingProvider('klarna');
  };

  /**
   * Recurring bookings can only be paid by Card (subscription requires a
   * reusable, chargeable-off-session payment method). Any one-time-only
   * method is hidden from the selector and auto-switched away from if the
   * user had it selected before toggling recurring.
   */
  const forceCardPayment =
    (selectedService?.allowRecurringBookings && !selectedService?.allowOneTimeBookings) ||
    (selectedService?.allowRecurringBookings && isRecurring);

  const hiddenPaymentMethods = useMemo(
    () => (forceCardPayment ? ONE_TIME_ONLY_PAYMENT_METHODS : []),
    [forceCardPayment],
  );

  useEffect(() => {
    if (
      forceCardPayment &&
      paymentMethodLocal &&
      paymentMethodLocal !== PaymentMethodEnum.CARD
    ) {
      handlePaymentMethodChange(PaymentMethodEnum.CARD);
    }
  }, [forceCardPayment, paymentMethodLocal]);

  /**
   * Stripe configuration for the currently-active payment method.
   *   - Card: no redirect expected; legacy confirmation URL is safe to use.
   *   - Klarna: Stripe will redirect to Klarna, then Klarna will bounce the
   *     user back to our /payment/result page where we reconcile status via
   *     polling + stripe.retrievePaymentIntent.
   */
  const stripeFormConfig = useMemo(() => {
    if (paymentMethodLocal !== PaymentMethodEnum.KLARNA) {
      return { returnUrl: undefined, billingDetails: undefined };
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    // Klarna requires billing name, email, and country. Stripe rejects empty
    // strings for `country`, so we fall back to 'NO' (our operating market)
    // when the user hasn't populated Redux with a country code.
    const billingName = [firstName, lastName]
      .filter(Boolean)
      .join(' ')
      .trim() || undefined;

    return {
      returnUrl: `${origin}/payment/result?bookingId=${bookingId ?? ''}`,
      billingDetails: {
        name: billingName,
        email: email || undefined,
        phone: phone || undefined,
        address: {
          line1: serviceStreetAddress || undefined,
          city: serviceCity || undefined,
          postal_code: servicePostalCode || undefined,
          country: normalizeCountryCode(serviceCountry),
        },
      },
    };
  }, [
    paymentMethodLocal,
    bookingId,
    firstName,
    lastName,
    email,
    phone,
    serviceStreetAddress,
    serviceCity,
    servicePostalCode,
    serviceCountry,
  ]);

  if (!selectedService) {
    return null;
  }

  const ServiceIcon = getServiceIcon(selectedService.name);
  const displayPrice = calculation?.priceBreakdown?.basePrice || currentPrice;
  const customerName = (firstName || lastName) ? `${firstName || ""} ${lastName || ""}`.trim() : t('common.anonymous', { fallback: 'No Name' });

  return (
    <>
      {redirectingProvider && (
        <PaymentRedirectOverlay provider={redirectingProvider} />
      )}

      <div className={styles.pageWrapper}>
        <HeaderBar currentStep={5} />

        <div className={styles.pageContainer}>
          <SelectedServiceCard
            serviceName={selectedService.name}
            price={displayPrice}
            icon={selectedService.icon}
            fallbackIcon={ServiceIcon}
          />

          <div className={styles.customerSection}>
            <div className={styles.customerName}>{customerName}</div>
            <div className={styles.serviceType}>
              {accommodationType === "HOUSE"
                ? t('bookingFlow.house', { fallback: "House" })
                : accommodationType === "APARTMENT"
                  ? t('bookingFlow.apartment', { fallback: "Apartment" })
                  : t('bookingFlow.ownerSection', { fallback: "Owner Section" })}
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>{t('bookingFlow.date', { fallback: 'Date' })}</span>
                <span className={styles.infoValue}>
                  {bookingDate ? formatLongDate(bookingDate, currentLanguage) : "Wednesday - April 23, 2025"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>{t('bookingFlow.area', { fallback: 'Area' })}</span>
                <span className={styles.infoValue}>
                  {areaSqm || 130} m²
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>{t('bookingFlow.location', { fallback: 'Location' })}</span>
                <span className={styles.infoValue}>
                  {serviceStreetAddress || "5345 Nw 120 ave"},{" "}
                  {servicePostalCode || "333077"}
                </span>
              </div>
            </div>

            <div
              className={styles.bookingDetailsToggle}
              onClick={() => setBookingDetailsExpanded(!bookingDetailsExpanded)}
            >
              <span>{t('bookingFlow.bookingDetails', { fallback: 'Booking Details' })}</span>
              <FiChevronDown
                className={
                  bookingDetailsExpanded ? styles.chevronUp : styles.chevronDown
                }
              />
            </div>

            {bookingDetailsExpanded && (
              <div className={styles.bookingDetailsContent}>
                {calculation && (
                  <PriceDetailsCard
                    calculation={calculation}
                    loading={loading}
                    serviceName={selectedService?.name}
                    isRecurring={isRecurring}
                    recurringInterval={recurringInterval}
                  />
                )}
              </div>
            )}
          </div>

          {showPaymentForm && clientSecret ? (
            <div className={styles.stripeSection}>
              <h3 className={styles.sectionTitle}>
                {paymentMethodLocal === PaymentMethodEnum.KLARNA
                  ? t("bookingFlow.confirmKlarnaPayment", {
                      fallback: "Confirm Klarna Payment",
                    })
                  : t("bookingFlow.enterCardDetails", {
                      fallback: "Enter Card Details",
                    })}
              </h3>
              {isRecurring && (
                <div className={styles.recurringTooltip}>
                  <FiInfo className={styles.recurringTooltipIcon} />
                  <p className={styles.recurringTooltipText}>
                    {t('bookingFlow.recurringTooltip', { fallback: "Next payment will be automatically deducted based on your selected interval. You can cancel your subscription at any time by sending us an email at salg@klyra.no. Changes take effect from the next billing period." })}
                  </p>
                </div>
              )}
              <StripeProvider clientSecret={clientSecret}>
                <PaymentElementForm
                  bookingId={bookingId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onRedirecting={handleStripeRedirecting}
                  notifyRedirectOnSubmit={paymentMethodLocal === PaymentMethodEnum.KLARNA}
                  returnUrl={stripeFormConfig.returnUrl}
                  billingDetails={stripeFormConfig.billingDetails}
                  disabled={isCreatingBooking}
                  submitLabel={
                    paymentMethodLocal === PaymentMethodEnum.KLARNA
                      ? t("bookingFlow.payWithKlarna", {
                          fallback: "Pay with Klarna",
                        })
                      : undefined
                  }
                />
              </StripeProvider>
            </div>
          ) : (
            <>
              <PromoCodeSection
                visible={promoCodeVisible}
                value={promoCodeInput}
                status={promoStatus}
                onToggle={handlePromoCodeToggle}
                onChange={handlePromoCodeChange}
                onApply={handlePromoCodeApply}
                onRemove={handlePromoCodeRemove}
                calculation={calculation}
                disabled={selectedOfferId !== null}
              />

              {Array.isArray(offers) && offers.length > 0 && (
                <OfferSelectionCard
                  offers={offers}
                  selectedOfferId={selectedOfferId}
                  onSelect={handleOfferSelect}
                  disabled={calculation?.promoCodeEntity !== null}
                />
              )}

              <PaymentMethodSelector
                selectedMethod={paymentMethodLocal}
                onChange={handlePaymentMethodChange}
                hiddenMethods={hiddenPaymentMethods}
              />

              {bookingError && (
                <Alert
                  type="error"
                  message={t("messages.bookingError", { fallback: "Booking Error" })}
                  description={bookingError}
                  showIcon
                  className={styles.errorAlert}
                />
              )}

              {isCreatingBooking && (
                <div className={styles.loadingOverlay}>
                  <Spin size="large" />
                  <p className={styles.loadingText}>
                    {t("messages.bookingCreated", {
                      fallback: "Creating your booking...",
                    })}
                  </p>
                </div>
              )}

              <PrimaryNavigationButtons
                onBack={handleBack}
                onNext={handleNext}
                nextDisabled={!paymentMethodLocal || isCreatingBooking}
                nextLoading={isCreatingBooking}
                nextText={
                  paymentMethodLocal
                    ? t("bookingFlow.goToPaymentButton", {
                      fallback: "Gå til betaling",
                    })
                    : t("bookingFlow.next", { fallback: "Next" })
                }
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
