/**
 * SelectedInfoCard Component
 * Reusable card to display selected information (date, time, etc.)
 */

import styles from "@/styles/components/SelectedInfoCard.module.css";
import PropTypes from "prop-types";

const SelectedInfoCard = ({ label, value }) => {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
};

SelectedInfoCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default SelectedInfoCard;
