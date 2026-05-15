/**
 * Layout Component
 * Global layout wrapper with Sidebar, mobile Drawer, and Header
 * Provides consistent structure across all pages
 * On mobile (<768px): sidebar is hidden, hamburger opens Ant Design Drawer
 * On desktop: sidebar remains fixed as-is
 */

import Sidebar from "@/components/common/Sidebar/Sidebar";
import { Drawer, Layout } from "antd";
import Image from "next/image";
import Logo from "@/components/common/Logo/Logo";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import styles from "../../../../styles/AppLayout.module.css";

const { Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();

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

  const onItemClick = useCallback((_key) => {
    // NOTE: booking state reset is handled entirely by the routeChangeComplete
    // handler above. It fires AFTER navigation completes (when booking pages are
    // already unmounted), preventing guard useEffects from hijacking the destination.
    if (isMobile) {
      handleDrawerClose();
    }
  }, [isMobile]);

  return (
    <Layout className={styles.layoutContainer}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          onCollapse={handleCollapse}
          onItemClick={onItemClick}
        />
      )}

      {/* Mobile Hamburger Header + Drawer */}
      {isMobile && (
        <>
          <div className={styles.mobileHeader}>
            <button
              type="button"
              className={styles.hamburgerButton}
              onClick={handleDrawerOpen}
              aria-label="Open navigation menu"
            >
              <FiMenu className={styles.hamburgerIcon} />
            </button>
            <div className={styles.mobileHeaderLogo}>
              <Logo className={styles.mobileHeaderLogoImage} />
            </div>
            <div style={{ width: 40 }} /> {/* Spacer for centering logo */}
          </div>

          <Drawer
            placement="left"
            closable={false}
            onClose={handleDrawerClose}
            open={drawerVisible}
            width={280}
            bodyStyle={{ padding: 0 }}
          >
            <div className={styles.drawerHeader}>
              <div className={styles.mobileHeaderLogo}>
                <Logo className={styles.mobileHeaderLogoImage} />
              </div>
              <button
                type="button"
                className={styles.drawerCloseButton}
                onClick={handleDrawerClose}
                aria-label="Close navigation menu"
              >
                <FiX className={styles.drawerCloseIcon} />
              </button>
            </div>
            <Sidebar isMobile onItemClick={onItemClick} />
          </Drawer>
        </>
      )}

      <Layout
        className={`${styles.mainLayout} ${!isMobile && collapsed ? styles.mainLayoutCollapsed : ""
          } ${isMobile ? styles.mainLayoutMobile : ""}`}
      >
        <Content className={styles.contentWrapper}>{children}</Content>
      </Layout>
    </Layout>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
