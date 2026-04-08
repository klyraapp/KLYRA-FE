import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/components/SelectedServiceCard.module.css";
import PropTypes from "prop-types";
import { useState } from "react";

const SelectedServiceCard = ({ serviceName, price, icon, fallbackIcon: FallbackIcon }) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const bucketUrl = process.env.NEXT_PUBLIC_AWS_PUBLIC_BUCKET_URL;

  const renderIcon = () => {
    // If icon is a URL string and image hasn't errored
    if (typeof icon === 'string' && !imageError) {
      const fullUrl = icon.startsWith('http') ? icon : `${bucketUrl}/${icon}`;
      return (
        <img
          src={fullUrl}
          alt={serviceName}
          className={styles.selectedServiceIconSvg}
          onError={() => setImageError(true)}
        />
      );
    }

    // Fallback Icon component
    const IconComponent = typeof icon === 'string' ? FallbackIcon : (icon || FallbackIcon);
    if (!IconComponent) return null;
    return <IconComponent className={styles.selectedServiceIconSvg} />;
  };

  return (
    <div className={styles.selectedServiceCard}>
      <div className={styles.selectedServiceIcon}>
        {renderIcon()}
      </div>
      <div className={styles.selectedServiceContent}>
        <p className={styles.selectedServiceLabel}>{t('bookingFlow.selectedService', { fallback: 'Selected Service' })}</p>
        <h3 className={styles.selectedServiceName}>{serviceName}</h3>
      </div>
      <div className={styles.selectedServicePrice}>
        <p className={styles.selectedServicePriceLabel}>{t('bookingFlow.price', { fallback: 'Price' })}</p>
        <span className={styles.selectedServicePriceText}>
          {t('bookingFlow.fromPriceFormat', { price, fallback: `NOK ${price}` })}
        </span>
      </div>
    </div>
  );
};

SelectedServiceCard.propTypes = {
  serviceName: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.string]),
  fallbackIcon: PropTypes.elementType,
};

export default SelectedServiceCard;

