/**
 * BookingHeroCard Component
 * Main CTA card on the home page
 */

import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/home/BookingHeroCard.module.css';
import { Button } from 'antd';

const BookingHeroCard = ({ onBookNow }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.heroCard}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('bookingFlow.bookCleaning', { fallback: 'Book cleaning' })}</h2>
        <p className={styles.subtitle}>{t('bookingFlow.getProfessionalHelp', { fallback: 'Get professional help today' })}</p>
      </div>
      <Button
        className={styles.bookButton}
        onClick={onBookNow}
      >
        {t('bookingFlow.bookNow', { fallback: 'Book Now' })}
      </Button>
    </div>
  );
};

export default BookingHeroCard;
