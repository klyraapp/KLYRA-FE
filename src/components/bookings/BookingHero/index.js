/**
 * BookingHero component for the top of the bookings page.
 */

import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/bookings/BookingHero.module.css';
import { Button } from 'antd';
import { useRouter } from 'next/router';

const BookingHero = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleBookNow = () => {
    router.push('/book-service');
  };

  return (
    <div className={styles.heroCard}>
      <h2 className={styles.title}>{t('bookingFlow.bookCleaning')}</h2>
      <p className={styles.subtitle}>{t('bookingFlow.getProfessionalHelp', { fallback: 'Get professional help today' })}</p>
      <Button
        block
        size="large"
        className={styles.bookButton}
        onClick={handleBookNow}
      >
        {t('bookingFlow.bookNow', { fallback: 'Book Now' })}
      </Button>
    </div>
  );
};

export default BookingHero;
