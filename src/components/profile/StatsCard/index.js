/**
 * StatsCard Component
 * Displays user stats like total cleanings and average rating
 */

import styles from '@/styles/profile/StatsCard.module.css';

const StatsCard = ({ title, stats }) => {
  return (
    <div className={styles.statsCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
