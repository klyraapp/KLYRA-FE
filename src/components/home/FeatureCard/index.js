/**
 * FeatureCard Component
 * Displays a feature with icon and description
 */

import styles from '@/styles/home/FeatureCard.module.css';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className={styles.featureCard}>
      <div className={styles.iconContainer}>
        <Icon className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
