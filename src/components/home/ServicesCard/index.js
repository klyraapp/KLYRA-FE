/**
 * ServicesCard Component
 * Displays a service with icon, name, and starting price
 */

import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/home/ServicesCard.module.css';
import { useState } from 'react';

const ServicesCard = ({ icon, fallbackIcon, name, price, onClick }) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const bucketUrl = process.env.NEXT_PUBLIC_AWS_PUBLIC_BUCKET_URL || 'https://klyra-s3.s3.us-east-1.amazonaws.com';

  const renderIcon = () => {
    if (typeof icon === 'string' && icon && !imageError) {
      const fullUrl = icon.startsWith('http') ? icon : `${bucketUrl}/${icon}`;
      return (
        <img
          src={fullUrl}
          alt={name}
          className={styles.icon}
          onError={() => setImageError(true)}
        />
      );
    }
    
    // Fallback: if icon is null or undefined, use fallbackIcon
    const Icon = (typeof icon === 'string' || !icon) ? fallbackIcon : icon;
    
    // Only render if Icon is a valid component
    if (!Icon) return null;
    
    return <Icon className={styles.icon} />;
  };

  return (
    <div className={styles.servicesCard} onClick={onClick}>
      <div className={styles.iconContainer}>{renderIcon()}</div>
      <h3 className={styles.serviceName}>{name}</h3>
      <p className={styles.priceText}>
        {t("bookingFlow.fromPriceFormat", {
          fallback: "From NOK {price}",
        }).replace("{price}", price)}
      </p>
    </div>
  );
};

export default ServicesCard;
