/**
 * SectionWrapper Component
 * Reusable wrapper for home page sections with title
 */

import styles from '@/styles/home/Home.module.css';

const SectionWrapper = ({ title, children, contentClassName }) => {
  return (
    <section className={styles.sectionWrapper}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={contentClassName || styles.sectionContent}>
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
