/**
 * HeaderBar Component
 * Top green header with brand and step progress
 */

import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/BookService.module.css";
import { DownOutlined, GlobalOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

const STEP_MAPPING = {
  "/book-service": 1,
  "/booking-details": 2,
  "/booking-extra-services": 2,
  "/booking-details-extra": 2,
  "/booking-date": 3,
  "/booking-customer-info": 4,
  "/booking/payment": 5,
  "/booking/confirmation": 6,
};

const HeaderBar = ({ currentStep, showProgress = true, subtitle }) => {
  const router = useRouter();
  const activeStep = currentStep || STEP_MAPPING[router.pathname] || 1;
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const displaySubtitle = subtitle || t('bookingFlow.bookCleaning', { fallback: 'Book cleaning' });

  const steps = [
    { number: 1, label: t('bookingFlow.services', { fallback: 'Services' }) },
    { number: 2, label: t('bookingFlow.details', { fallback: 'Details' }) },
    { number: 3, label: t('bookingFlow.dateTab', { fallback: 'Date' }) },
    { number: 4, label: t('bookingFlow.contact', { fallback: 'Contact' }) },
    { number: 5, label: t('bookingFlow.payment', { fallback: 'Payment' }) },
    { number: 6, label: t('common.confirm', { fallback: 'Confirm' }) },
  ];

  const languageItems = [
    {
      key: 'en',
      label: t('navigation.english', { fallback: 'English' }),
      onClick: () => changeLanguage('en'),
    },
    {
      key: 'no',
      label: t('navigation.norwegian', { fallback: 'Norsk' }),
      onClick: () => changeLanguage('no'),
    },
  ];

  return (
    <div className={styles.headerBar}>
      <div className={styles.headerContent}>
        <div className={styles.headerTopLevel}>
          <div className={styles.brandSection}>
            <h1 className={styles.brandTitle}>KLYRA</h1>
            <p className={styles.brandSubtitle}>{displaySubtitle}</p>
          </div>

          <div className={styles.langSelector}>
            <Dropdown menu={{ items: languageItems }} placement="bottomRight" trigger={['click']}>
              <a onClick={(e) => e.preventDefault()} className={styles.langDropdownLink}>
                <Space>
                  <GlobalOutlined />
                  {currentLanguage === 'no' ? 'NO' : 'EN'}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>

        {showProgress && (
          <div className={styles.stepProgress}>
            {steps.map((step, index) => (
              <span key={step.number} className={styles.stepProgressItem}>
                <span
                  className={`${styles.stepNumber} ${step.number === activeStep ? styles.stepNumberActive : ""
                    } ${step.number < activeStep ? styles.stepNumberCompleted : ""}`}
                >
                  {step.number}
                </span>
                <span
                  className={`${styles.stepLabel} ${step.number === activeStep ? styles.stepLabelActive : ""
                    }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <span className={styles.stepSeparator}>›</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

HeaderBar.propTypes = {
  currentStep: PropTypes.number,
  showProgress: PropTypes.bool,
  subtitle: PropTypes.string,
};

export default HeaderBar;
