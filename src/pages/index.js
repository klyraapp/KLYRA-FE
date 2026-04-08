/**
 * Home Page
 * Main landing page of the KLYRA web application
 */

import { getServiceIcon } from '@/utils/utils';
import {
  CalendarOutlined,
  SafetyCertificateOutlined,
  StarOutlined
} from '@ant-design/icons';
import { Spin } from 'antd';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

// Components
import HeaderBar from '@/components/BookService/HeaderBar';
import BookingHeroCard from '@/components/home/BookingHeroCard';
import FeatureCard from '@/components/home/FeatureCard';
import SectionWrapper from '@/components/home/SectionWrapper';
import ServicesCard from '@/components/home/ServicesCard';

// Hooks & Redux
import { useActiveServices } from '@/hooks/useServices';
import { setSelectedService } from '@/redux/reducers/bookingSlice';

// Styles
import styles from '@/styles/home/Home.module.css';

import { useTranslation } from '@/hooks/useTranslation';
import { getServiceBasePrice } from '@/utils/pricing';

const HomePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: services, isLoading } = useActiveServices();
  const { t } = useTranslation();

  const FEATURES = [
    {
      key: 'quality',
      title: t('bookingFlow.qualityAssured', { fallback: 'Quality Assured' }),
      description: t('bookingFlow.backgroundChecked', { fallback: 'All our cleaners are background checked and insured' }),
      icon: SafetyCertificateOutlined,
    },
    {
      key: 'flexible',
      title: t('bookingFlow.flexibleBooking', { fallback: 'Flexible Booking' }),
      description: t('bookingFlow.chooseTime', { fallback: 'Choose a time that suits you, change whenever you want' }),
      icon: CalendarOutlined,
    },
    {
      key: 'rating',
      title: t('bookingFlow.highQuality', { fallback: 'High quality' }),
      description: t('bookingFlow.averageRating', { fallback: 'Average rating 4.8 out of 5 stars' }),
      icon: StarOutlined,
    },
  ];

  const handleBookNow = () => {
    router.push('/book-service');
  };

  const handleServiceSelect = (service) => {
    dispatch(setSelectedService(service));
    router.push({
      pathname: '/booking-details',
      query: { service: service.id },
    });
  };

  return (
    <div className={styles.homeContainer}>
      <HeaderBar
        showProgress={false}
        subtitle={t('bookingFlow.yourCleaningHelp', { fallback: 'Your cleaning help when you need it' })}
      />

      <div className={styles.contentWrapper}>
        <BookingHeroCard onBookNow={handleBookNow} />

        <SectionWrapper title={t('bookingFlow.whyChooseUs', { fallback: 'Why choose us?' })}>
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.key}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </SectionWrapper>

        <SectionWrapper title={t('bookingFlow.ourServices', { fallback: 'Our services' })} contentClassName={styles.servicesGrid}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spin size="medium" />
            </div>
          ) : (
            Array.isArray(services) && services.map((service) => {
              if (!service) return null;
              const displayPrice = getServiceBasePrice(service);

              return (
                <ServicesCard
                  key={service.id || Math.random()}
                  name={service.name || ""}
                  price={displayPrice || "0"}
                  icon={service.icon}
                  fallbackIcon={getServiceIcon(service.name)}
                  onClick={() => handleServiceSelect(service)}
                />
              );
            })
          )}
        </SectionWrapper>
      </div>
    </div>
  );
};

export default HomePage;
