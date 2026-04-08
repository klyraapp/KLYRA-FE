/**
 * StepIndicator Component
 * Reusable step indicator for multi-step flows
 */

import styles from "@/styles/BookService.module.css";
import PropTypes from "prop-types";

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className={styles.stepIndicator}>
      {steps.map((step, index) => (
        <div key={step.number} className={styles.stepIndicatorItem}>
          <span
            className={`${styles.stepIndicatorNumber} ${
              step.number === currentStep
                ? styles.stepIndicatorNumberActive
                : ""
            } ${
              step.number < currentStep
                ? styles.stepIndicatorNumberCompleted
                : ""
            }`}
          >
            {step.number}
          </span>
          <span
            className={`${styles.stepIndicatorLabel} ${
              step.number === currentStep ? styles.stepIndicatorLabelActive : ""
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <span className={styles.stepIndicatorSeparator}>›</span>
          )}
        </div>
      ))}
    </div>
  );
};

StepIndicator.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default StepIndicator;
