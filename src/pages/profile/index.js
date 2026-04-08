/**
 * Profile Page
 * Displays user profile, stats and allow editing information
 */
/*
import styles from '@/styles/profile/ProfilePage.module.css';
import { message as antMessage } from 'antd';
import { useCallback, useEffect, useState } from 'react';

// Components
import EditProfileModal from '@/components/profile/EditProfileModal';
import ProfileActionItem from '@/components/profile/ProfileActionItem';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsCard from '@/components/profile/StatsCard';

// Services
import { getProfile, updateProfile } from '@/services/profile/profileService';
*/
const ProfilePage = () => {
  /*
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProfile();
      setProfileData(data);
    } catch (error) {
      antMessage.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleProfileSave = async (values) => {
    if (!profileData?.id) return;

    setIsSaving(true);
    try {
      await updateProfile(profileData.id, values);
      antMessage.success('Profile updated successfully');
      await fetchProfile();
      setIsModalOpen(false);
    } catch (error) {
      antMessage.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total cleanings', value: profileData?.totalCleanings || 0 },
    { label: 'Average rating', value: profileData?.averageRating || '0.0' }
  ];

  const isGuest = !profileData?.email;

  return (
    <div className={styles.pageContainer}>
      <ProfileHeader
        firstName={profileData?.firstName || 'Guest'}
        lastName={profileData?.lastName || 'User'}
        email={profileData?.email || 'Guest Account'}
        onEditClick={handleEditClick}
        isGuest={isGuest}
      />

      <div className={styles.content}>
        <div className={styles.section}>
          <StatsCard title="Your stats" stats={stats} />
        </div>

        <div className={styles.actionsList}>
          <ProfileActionItem
            label="Help & Support"
            onClick={() => antMessage.info('Help & Support clicked')}
          />
          <ProfileActionItem
            label="Terms & Conditions"
            onClick={() => antMessage.info('Terms & Conditions clicked')}
          />
        </div>
      </div>

      <EditProfileModal
        visible={isModalOpen}
        onClose={handleModalClose}
        onSave={handleProfileSave}
        isSaving={isSaving}
        initialValues={{
          firstName: profileData?.firstName,
          lastName: profileData?.lastName,
          email: profileData?.email,
          phone: profileData?.phone
        }}
      />
    </div>
  );
  */
  return null;
};

export default ProfilePage;
