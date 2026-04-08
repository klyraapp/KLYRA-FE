/**
 * SectionLabel Component
 * Displays date group labels like "Today", "Yesterday"
 */

import styles from '@/styles/notifications/SectionLabel.module.css';

const SectionLabel = ({ label }) => {
  return (
    <div className={styles.sectionLabel}>
      {label}
    </div>
  );
};

export default SectionLabel;
