/**
 * ProfileActionItem Component
 * Reusable clickable item for profile actions (Help, Terms, etc.)
 */

import styles from '@/styles/profile/ProfileActionItem.module.css';
import { RightOutlined } from '@ant-design/icons';

const ProfileActionItem = ({ label, onClick }) => {
  return (
    <div className={styles.actionItem} onClick={onClick}>
      <span className={styles.label}>{label}</span>
      <RightOutlined className={styles.arrowIcon} />
    </div>
  );
};

export default ProfileActionItem;
