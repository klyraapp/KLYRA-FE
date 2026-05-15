/**
 * Booking Date Page
 * Step 3: Date selection in multi-step booking flow
 */

import { getCalendarDisabledDates } from "@/api/bookingsApi";
import HeaderBar from "@/components/BookService/HeaderBar";
import PrimaryNavigationButtons from "@/components/common/Booking/PrimaryNavigationButtons";
import SelectedInfoCard from "@/components/common/Booking/SelectedInfoCard";
import SelectedServiceCard from "@/components/common/Booking/SelectedServiceCard";
import { formatLongDate, formatMonthYear, isPastDate, isSameDay } from "@/helpers/dateFormatter";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useTranslation } from "@/hooks/useTranslation";
import { setBookingDate } from "@/redux/reducers/bookingSlice";
import styles from "@/styles/BookingDate.module.css";
import { getServiceIcon } from "@/utils/utils";
import { Alert, Calendar, Input } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const { TextArea } = Input;

const BookingDate = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentPrice, selectedService } = useServicePricing();
  const bookingDate = useSelector((state) => state.booking.bookingDate);

  const { t, currentLanguage } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(
    bookingDate ? new Date(bookingDate) : null,
  );
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  // Calendar restrictions from API
  const [apiDisabledDates, setApiDisabledDates] = useState([]);
  const [sundayOff, setSundayOff] = useState(false);
  const [saturdayOff, setSaturdayOff] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(true);

  useEffect(() => {
    if (router.isReady && !selectedService) {
      router.push("/book-service");
    }
  }, [selectedService, router]);

  // Fetch disabled dates from API
  useEffect(() => {
    if (!selectedService?.id) {
      setCalendarLoading(false);
      return;
    }

    const fetchDisabledDates = async () => {
      try {
        const response = await getCalendarDisabledDates(selectedService.id);
        const data = response?.data;
        if (data) {
          setApiDisabledDates(data.disabledDates || []);
          setSundayOff(data.sundayOff ?? false);
          setSaturdayOff(data.saturdayOff ?? false);
        }
      } catch (error) {
        console.error("Failed to fetch calendar disabled dates:", error);
        // Fallback: no extra disabled dates, weekends enabled
        setApiDisabledDates([]);
        setSundayOff(false);
        setSaturdayOff(false);
      } finally {
        setCalendarLoading(false);
      }
    };

    fetchDisabledDates();
  }, [selectedService?.id]);

  // Create a Set for O(1) lookup of disabled date strings
  const disabledDateSet = useMemo(
    () => new Set(apiDisabledDates),
    [apiDisabledDates],
  );

  const isDateDisabled = useCallback(
    (jsDate, dayOfWeek) => {
      // Past dates are always disabled
      if (isPastDate(jsDate)) return true;

      // Check weekend restrictions from API
      if (dayOfWeek === 0 && sundayOff) return true;
      if (dayOfWeek === 6 && saturdayOff) return true;

      // Check specific disabled dates from API
      const dateStr = dayjs(jsDate).format("YYYY-MM-DD");
      if (disabledDateSet.has(dateStr)) return true;

      return false;
    },
    [sundayOff, saturdayOff, disabledDateSet],
  );

  const handleDateSelect = (date) => {
    const jsDate = date.toDate();
    const dayOfWeek = date.day();
    if (!isDateDisabled(jsDate, dayOfWeek)) {
      setSelectedDate(jsDate);
      // Format date as YYYY-MM-DD for API
      const formattedDate = dayjs(jsDate).format("YYYY-MM-DD");
      dispatch(setBookingDate(formattedDate));
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const getMonthYearLabel = () => {
    return formatMonthYear(currentMonth, currentLanguage);
  };

  const customHeaderRender = () => {
    return (
      <div className={styles.calendarHeader}>
        <button
          onClick={handlePrevMonth}
          className={styles.navButton}
          type="button"
          aria-label="Previous month"
        >
          <FiChevronLeft />
        </button>
        <span className={styles.monthYearLabel}>{getMonthYearLabel()}</span>
        <button
          onClick={handleNextMonth}
          className={styles.navButton}
          type="button"
          aria-label="Next month"
        >
          <FiChevronRight />
        </button>
      </div>
    );
  };

  const handleBack = () => {
    router.push("/booking-details-extra");
  };

  const handleNext = () => {
    if (!selectedDate) {
      return;
    }
    router.push("/booking-customer-info");
  };

  const disabledDate = (current) => {
    if (!current) {
      return false;
    }
    const jsDate = current.toDate();
    const dayOfWeek = current.day();
    return isDateDisabled(jsDate, dayOfWeek);
  };

  const dateFullCellRender = (date) => {
    if (!date) {
      return null;
    }

    const jsDate = date.toDate();
    const dayOfWeek = date.day();
    const isSelected = selectedDate && isSameDay(jsDate, selectedDate);
    const isDisabled = isDateDisabled(jsDate, dayOfWeek);

    return (
      <div
        className={`${styles.dateCell} ${isSelected ? styles.dateCellSelected : ""
          } ${isDisabled ? styles.dateCellDisabled : ""}`}
      >
        {date.date()}
      </div>
    );
  };

  if (!selectedService) {
    return null;
  }

  const ServiceIcon = getServiceIcon(selectedService.name);

  // Check if the selected date is Saturday (6) or Sunday (0)
  const isSelectedWeekend = useMemo(() => {
    if (!selectedDate) return false;
    const day = selectedDate.getDay();
    return day === 0 || day === 6;
  }, [selectedDate]);

  return (
    <div className={styles.pageWrapper}>
      <HeaderBar currentStep={3} />
      <div className={styles.pageContainer}>
        <SelectedServiceCard
          serviceName={selectedService.name}
          price={currentPrice}
          icon={selectedService.icon}
          fallbackIcon={ServiceIcon}
        />

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>{t('bookingFlow.selectDate', { fallback: 'Select Date' })}</h2>

          {isSelectedWeekend && (
            <Alert
              description={
                <span className={styles.alertText}>
                  {t('bookingFlow.weekendSurchargeNotice', { fallback: "Please note that an extra surcharge will be applied for bookings on Saturdays and Sundays." })}
                </span>
              }
              type="info"
              showIcon
              className={styles.alert}
              style={{ marginBottom: '16px' }}
            />
          )}

          <Alert
            description={
              <span className={styles.alertText}>
                {t('bookingFlow.noAvailability', { fallback: "No availability? If you don't find a suitable date, please send us an email at booking@klyra.com and we'll do our best to accommodate you" })}
              </span>
            }
            type="warning"
            showIcon
            className={styles.alert}
          />

          <div className={styles.calendarContainer}>
            <Calendar
              fullscreen={false}
              value={currentMonth}
              onSelect={handleDateSelect}
              disabledDate={disabledDate}
              fullCellRender={dateFullCellRender}
              headerRender={customHeaderRender}
              className={styles.calendar}
            />
          </div>

          {selectedDate && (
            <SelectedInfoCard
              label={t('bookingFlow.selectedDate', { fallback: 'Selected Date' })}
              value={formatLongDate(selectedDate, currentLanguage)}
            />
          )}
        </div>

        <PrimaryNavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          nextDisabled={!selectedDate}
        />
      </div>
    </div>
  );
};

export default BookingDate;
