/**
 * FooterActions Component
 * Bottom action bar with Back and Next buttons
 */

import styles from "@/styles/components/PrimaryNavigationButtons.module.css";
import { Button } from "antd";
import PropTypes from "prop-types";

const FooterActions = ({ onBack, onNext, nextDisabled }) => {
  return (
    <div className={styles.footerActions}>
      <Button className={styles.backButton} onClick={onBack} size="large">
        Back
      </Button>
      <Button
        type="primary"
        className={styles.nextButton}
        onClick={onNext}
        disabled={nextDisabled}
        size="large"
      >
        Next
      </Button>
    </div>
  );
};

FooterActions.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  nextDisabled: PropTypes.bool,
};

FooterActions.defaultProps = {
  nextDisabled: false,
};

export default FooterActions;
