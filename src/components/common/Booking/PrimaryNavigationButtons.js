/**
 * PrimaryNavigationButtons Component
 * Reusable Back/Next navigation buttons for all booking steps
 */

import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/components/PrimaryNavigationButtons.module.css";
import { Button, Tooltip } from "antd";
import PropTypes from "prop-types";

const PrimaryNavigationButtons = ({
  onBack,
  onNext,
  nextDisabled,
  nextLoading,
  backDisabled,
  nextTooltip,
  nextText,
  backText
}) => {
  const { t } = useTranslation();

  const nextButton = (
    <Button
      className={styles.nextButton}
      onClick={onNext}
      disabled={nextDisabled}
      loading={nextLoading}
      size="large"
    >
      {nextText || t('bookingFlow.next', { fallback: 'Next' })}
    </Button>
  );

  return (
    <div className={styles.footerActions}>
      <Button
        className={styles.backButton}
        onClick={onBack}
        size="large"
        disabled={backDisabled || nextLoading}
      >
        {backText || t('bookingFlow.back', { fallback: 'Back' })}
      </Button>
      {nextTooltip && nextDisabled ? (
        <Tooltip title={nextTooltip} placement="top">
          <div style={{ display: 'inline-block' }}>{nextButton}</div>
        </Tooltip>
      ) : (
        nextButton
      )}
    </div>
  );
};

PrimaryNavigationButtons.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  nextDisabled: PropTypes.bool,
  nextLoading: PropTypes.bool,
  backDisabled: PropTypes.bool,
};

PrimaryNavigationButtons.defaultProps = {
  nextDisabled: false,
  nextLoading: false,
  backDisabled: false,
};

export default PrimaryNavigationButtons;
