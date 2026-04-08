/**
 * AreaSlider Component
 * Slider for selecting area in square meters
 */

import styles from "@/styles/components/AreaSlider.module.css";
import { Slider } from "antd";
import PropTypes from "prop-types";

const AreaSlider = ({ value, onChange }) => {
  return (
    <div className={styles.areaSlider}>
      <label className={styles.sectionLabel}>Area mm</label>
      <div className={styles.sliderContainer}>
        <Slider
          min={10}
          max={500}
          value={value}
          onChange={onChange}
          className={styles.slider}
          tooltip={{ open: false }}
        />
        <span className={styles.sliderValue}>{value}m</span>
      </div>
    </div>
  );
};

AreaSlider.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

AreaSlider.defaultProps = {
  value: 25,
};

export default AreaSlider;
