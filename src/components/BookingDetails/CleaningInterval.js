/**
 * CleaningInterval Component
 * Conditional component - only renders for House accommodation
 */

import styles from "@/styles/components/CleaningInterval.module.css";
import PropTypes from "prop-types";
import { FiCalendar, FiClock, FiRepeat, FiTrendingUp } from "react-icons/fi";

const INTERVAL_OPTIONS = [
  {
    key: "weekly",
    icon: FiCalendar,
    title: "Weekly",
    subtitle: "Recurring every week",
  },
  {
    key: "biweekly",
    icon: FiClock,
    title: "Every Second Week",
    subtitle: "Recurring every 2 weeks",
  },
  {
    key: "triweekly",
    icon: FiRepeat,
    title: "Every Third Week",
    subtitle: "Recurring every 3 weeks",
  },
  {
    key: "monthly",
    icon: FiTrendingUp,
    title: "Monthly",
    subtitle: "Recurring every month",
  },
];

const CleaningInterval = ({ selected, onSelect }) => {
  return (
    <div className={styles.cleaningInterval}>
      <label className={styles.sectionLabel}>Cleaning Interval</label>
      <div className={styles.intervalGrid}>
        {INTERVAL_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          return (
            <div
              key={option.key}
              className={`${styles.intervalCard} ${
                selected === option.key ? styles.intervalCardSelected : ""
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
              <IconComponent className={styles.intervalIcon} />
              <div className={styles.intervalContent}>
                <h4 className={styles.intervalTitle}>{option.title}</h4>
                <p className={styles.intervalSubtitle}>{option.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

CleaningInterval.propTypes = {
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

CleaningInterval.defaultProps = {
  selected: null,
};

export default CleaningInterval;
