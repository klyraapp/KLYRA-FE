/**
 * AccommodationSelector Component
 * Three selectable cards for accommodation type
 */

import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/components/AccommodationSelector.module.css";
import PropTypes from "prop-types";
import { FiGrid, FiHome, FiUsers } from "react-icons/fi";

const ACCOMMODATION_OPTIONS = [
  { key: "house", labelKey: "bookingFlow.house", defaultLabel: "House", icon: FiHome },
  { key: "apartment", labelKey: "bookingFlow.apartment", defaultLabel: "Apartment", icon: FiGrid },
  { key: "owner", labelKey: "bookingFlow.ownerSection", defaultLabel: "Owner Section", icon: FiUsers },
];

const AccommodationSelector = ({ selected, onSelect }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.accommodationSelector}>
      <label className={styles.sectionLabel}>{t('bookingFlow.accommodation', { fallback: 'Accommodation' })}</label>
      <div className={styles.accommodationGrid}>
        {ACCOMMODATION_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          return (
            <div
              key={option.key}
              className={`${styles.accommodationCard} ${selected === option.key ? styles.accommodationCardSelected : ""
                }`}
              onClick={() => onSelect(option.key)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelect(option.key);
                }
              }}
            >
              <IconComponent className={styles.accommodationIcon} />
              <span className={styles.accommodationLabel}>{t(option.labelKey, { fallback: option.defaultLabel })}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

AccommodationSelector.propTypes = {
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

AccommodationSelector.defaultProps = {
  selected: null,
};

export default AccommodationSelector;
