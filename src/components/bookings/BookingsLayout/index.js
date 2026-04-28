import HeaderBar from '@/components/BookService/HeaderBar';
import Sidebar from '@/components/common/Sidebar/Sidebar';
import { useTranslation } from "@/hooks/useTranslation";
import styles from '@/styles/bookings/BookingsLayout.module.css';
import Logo from "@/components/common/Logo/Logo";
import { Drawer, Layout } from 'antd';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from "react-icons/fi";
import layoutStyles from '../../../../styles/AppLayout.module.css';
import BookingHero from '../BookingHero';

const { Content } = Layout;

const BookingsLayout = ({ children, customSubtitle, customSubtitleKey, customSubtitleFallback }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCollapse = (value) => {
    setCollapsed(value);
  };

  const handleDrawerOpen = () => {
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const onItemClick = () => {
    if (isMobile) {
      handleDrawerClose();
    }
  };

  return (
    <Layout className={styles.layoutContainer}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar collapsed={collapsed} onCollapse={handleCollapse} />
      )}

      {/* Mobile Hamburger Header + Drawer */}
      {isMobile && (
        <>
          <div className={layoutStyles.mobileHeader}>
            <button
              type="button"
              className={layoutStyles.hamburgerButton}
              onClick={handleDrawerOpen}
              aria-label="Open navigation menu"
            >
              <FiMenu className={layoutStyles.hamburgerIcon} />
            </button>
            <div className={layoutStyles.mobileHeaderLogo}>
              <Logo className={layoutStyles.mobileHeaderLogoImage} />
            </div>
            <div style={{ width: 40 }} />
          </div>

          <Drawer
            placement="left"
            closable={false}
            onClose={handleDrawerClose}
            open={drawerVisible}
            width={280}
            bodyStyle={{ padding: 0 }}
          >
            <div className={layoutStyles.drawerHeader}>
              <div className={layoutStyles.mobileHeaderLogo}>
                <Logo className={layoutStyles.mobileHeaderLogoImage} />
              </div>
              <button
                type="button"
                className={layoutStyles.drawerCloseButton}
                onClick={handleDrawerClose}
                aria-label="Close navigation menu"
              >
                <FiX className={layoutStyles.drawerCloseIcon} />
              </button>
            </div>
            <Sidebar isMobile onItemClick={onItemClick} />
          </Drawer>
        </>
      )}

      <Layout className={`${styles.mainLayout} ${!isMobile && collapsed ? styles.mainLayoutCollapsed : ''
        } ${isMobile ? styles.mainLayoutMobile : ''}`}>
        <HeaderBar
          showProgress={false}
          subtitle={
            customSubtitleKey
              ? t(customSubtitleKey, { fallback: customSubtitleFallback || customSubtitle })
              : customSubtitle || t("bookingFlow.myBookingsSubtitle", { fallback: "My bookings" })
          }
        />
        <Content className={styles.contentWrapper}>
          <div className={styles.heroWrapper}>
            <BookingHero />
          </div>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BookingsLayout;
