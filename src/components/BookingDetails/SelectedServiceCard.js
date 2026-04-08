/**
 * SelectedServiceCard Component
 * Displays the selected service from Step 1
 */

import styles from "@/styles/components/SelectedServiceCard.module.css";
import PropTypes from "prop-types";

const SelectedServiceCard = ({ serviceName, price, icon: Icon }) => {
  return (
    <div className={styles.selectedServiceCard}>
      <div className={styles.selectedServiceIcon}>
        <Icon className={styles.selectedServiceIconSvg} />
      </div>
      <div className={styles.selectedServiceContent}>
        <p className={styles.selectedServiceLabel}>Selected Service</p>
        <h3 className={styles.selectedServiceName}>{serviceName}</h3>
      </div>
      <div className={styles.selectedServicePrice}>
        <p className={styles.selectedServicePriceLabel}>Price</p>
        <span className={styles.selectedServicePriceText}>NOK {price}</span>
      </div>
    </div>
  );
};

SelectedServiceCard.propTypes = {
  serviceName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
};

export default SelectedServiceCard;
