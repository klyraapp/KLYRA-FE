/**
 * ServiceCard Component
 * Single service card with icon, title, description, and price
 */

import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/BookService.module.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";

const ServiceCard = ({
  icon,
  fallbackIcon,
  title,
  description,
  price,
  selected,
  onClick,
}) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const bucketUrl = process.env.NEXT_PUBLIC_AWS_PUBLIC_BUCKET_URL ;

  const renderIcon = () => {
    if (typeof icon === 'string' && icon && !imageError) {
      const fullUrl = icon.startsWith('http') ? icon : `${bucketUrl}/${icon}`;
      return (
        <img
          src={fullUrl}
          alt={title}
          className={styles.serviceCardIconSvg}
          onError={() => setImageError(true)}
        />
      );
    }
    
    // Fallback: if icon is a string (image name) but we failed to resolve it or if null/undefined
    const Icon = (typeof icon === 'string' || !icon) ? fallbackIcon : icon;
    
    // Only render if Icon is a valid component
    if (!Icon) return null;
    
    return <Icon className={styles.serviceCardIconSvg} />;
  };

  return (
    <div
      className={`${styles.serviceCard} ${selected ? styles.serviceCardSelected : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <div className={styles.serviceCardIcon}>{renderIcon()}</div>
      <div className={styles.serviceCardContent}>
        <h3 className={styles.serviceCardTitle}>{title}</h3>
        <p className={styles.serviceCardDescription}>{description}</p>
      </div>
      <div className={styles.serviceCardPrice}>
        <span className={styles.serviceCardPriceText}>
          {t("bookingFlow.fromPriceFormat", {
            fallback: "From NOK {price}",
          }).replace("{price}", price)}
        </span>
      </div>
      <div className={styles.serviceCardArrow}>
        <FiChevronRight className={styles.serviceCardArrowIcon} />
      </div>
    </div>
  );
};

ServiceCard.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.string]).isRequired,
  fallbackIcon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

ServiceCard.defaultProps = {
  selected: false,
};

export default ServiceCard;
