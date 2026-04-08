/**
 * Booking Details Page
 * Displays full information about a specific booking.
 */

import BookingDetailSection from '@/components/bookings/BookingDetailSection';
import BookingsLayout from '@/components/bookings/BookingsLayout';
import PriceDetails from '@/components/bookings/PriceDetails';
import bookingService from '@/services/bookingService';
import styles from '@/styles/bookings/BookingDetailPage.module.css';
import { Alert, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const BookingDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBookingDetails = async () => {
      try {
        const data = await bookingService.getBookingDetails(id);
        setBooking(data);
      } catch (err) {
        console.error('Failed to fetch booking details:', err);
        setError('Could not load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className={styles.errorContainer}>
        <Alert message="Error" description={error || 'Booking not found'} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentSection}>
        <div className={styles.detailsContainer}>
          <BookingDetailSection booking={booking} />
          <PriceDetails booking={booking} />
        </div>
      </div>
    </div>
  );
};

// Use getLayout to provide a clean layout without the default header
BookingDetailPage.getLayout = (page) => <BookingsLayout>{page}</BookingsLayout>;

export default BookingDetailPage;
