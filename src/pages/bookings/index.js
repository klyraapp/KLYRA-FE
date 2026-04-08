/**
 * My Bookings List Page
 * Displays current and past bookings for the user.
 */

import BookingCard from '@/components/bookings/BookingCard';
import BookingsLayout from '@/components/bookings/BookingsLayout';
import EmptyState from '@/components/bookings/EmptyState';
import { BookingStatus } from '@/constants/bookings';
import { useTranslation } from "@/hooks/useTranslation";
import bookingService from '@/services/bookingService';
import styles from '@/styles/bookings/BookingsPage.module.css';
import { Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getBookings();
        setBookings(data || []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleRefresh = async () => {
    try {
      const data = await bookingService.getBookings();
      setBookings(data || []);
    } catch (error) {
      console.error('Failed to refresh bookings:', error);
    }
  };

  const bookingsList = Array.isArray(bookings) ? bookings : [];

  const currentBookings = bookingsList.filter(b =>
    [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS].includes(b?.status)
  );

  const pastBookings = bookingsList.filter(b =>
    [BookingStatus.COMPLETED, BookingStatus.CANCELLED].includes(b?.status)
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentSection}>
        {bookingsList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.listsContainer}>
            {/* Current Section */}
            {currentBookings.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionHeading}>{t("bookingFlow.currentTab", { fallback: "Current" })}</h2>
                <Row gutter={[16, 16]}>
                  {Array.isArray(currentBookings) && currentBookings.map(booking => (
                    <Col xs={24} sm={12} lg={8} key={booking?.id || Math.random()}>
                      <BookingCard booking={booking} onRefresh={handleRefresh} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Past Section */}
            {pastBookings.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionHeading}>{t("bookingFlow.pastTab", { fallback: "Past" })}</h2>
                <Row gutter={[16, 16]}>
                  {Array.isArray(pastBookings) && pastBookings.map(booking => (
                    <Col xs={24} sm={12} lg={8} key={booking?.id || Math.random()}>
                      <BookingCard booking={booking} onRefresh={handleRefresh} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Use getLayout to provide a clean layout without the default header
BookingsPage.getLayout = (page) => <BookingsLayout>{page}</BookingsLayout>;

export default BookingsPage;
