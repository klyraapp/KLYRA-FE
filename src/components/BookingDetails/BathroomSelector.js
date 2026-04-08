/**
 * BathroomSelector Component
 * Input for number of bathrooms
 */

import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/components/BathroomSelector.module.css";
import { InputNumber } from "antd";
import PropTypes from "prop-types";

const BathroomSelector = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.bathroomSelector}>
      <label className={styles.sectionLabel}>{t('bookingFlow.numberOfBathrooms', { fallback: 'Number of Bathrooms' })}</label>
      <InputNumber
        min={1}
        max={10}
        value={value}
        onChange={onChange}
        className={styles.bathroomInput}
      />
    </div>
  );
};

BathroomSelector.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

BathroomSelector.defaultProps = {
  value: 1,
};

export default BathroomSelector;
