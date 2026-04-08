/**
 * ProfileHeader Component
 * Consolidated header with brand info and user profile data.
 * Replaces the need for a separate HeaderBar on the profile page.
 */

import styles from '@/styles/profile/ProfileHeader.module.css';
import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const ProfileHeader = ({ firstName, lastName, email, onEditClick, isGuest }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        {/* Brand Section matching HeaderBar */}
        {/* <div className={styles.brandSection}>
          <h1 className={styles.brandTitle}>KLYRA</h1>
          <p className={styles.brandSubtitle}>Profile</p>
        </div> */}

        {/* User Info Section */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{firstName} {lastName}</h2>
            <p className={styles.userEmail}>{email}</p>
          </div>
          {!isGuest && (
            <Button
              icon={<EditOutlined className={styles.editIcon} />}
              className={styles.editButton}
              onClick={onEditClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
