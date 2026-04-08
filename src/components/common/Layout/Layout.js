/**
 * Layout Component
 * Global layout wrapper with Sidebar, mobile Drawer, and Header
 * Provides consistent structure across all pages
 * On mobile (<768px): sidebar is hidden, hamburger opens Ant Design Drawer
 * On desktop: sidebar remains fixed as-is
 */

import Sidebar from "@/components/common/Sidebar/Sidebar";
import { resetBooking } from "@/redux/reducers/bookingSlice";
import { Drawer, Layout } from "antd";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import styles from "../../../../styles/AppLayout.module.css";

const { Content } = Layout;

const BOOKING_PATHS = [
  "/book-service",
  "/booking-details",
  "/booking-details-extra",
  "/booking-extra-services",
  "/booking-date",
  "/booking-customer-info",
  "/booking/payment",
  "/booking/confirmation",
];

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const prevPathRef = useRef(null);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const pathname = url.split("?")[0];
      const prevPath = prevPathRef.current;
      const isBookingPath = (path) => BOOKING_PATHS.includes(path);

      if (prevPath !== pathname) {
        // If we left the booking flow
        if (isBookingPath(prevPath) && !isBookingPath(pathname)) {
          dispatch(resetBooking());
        }

        // If we enter the booking flow from outside (starting fresh)
        // Or if we specifically hit /book-service from a non-booking page
        if (pathname === "/book-service" && !isBookingPath(prevPath)) {
          dispatch(resetBooking());
        }

        prevPathRef.current = pathname;
      }
    };

    // Initialize ref on first load
    if (prevPathRef.current === null) {
      prevPathRef.current = router.pathname;
    }

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, router.pathname, dispatch]);

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

  const onItemClick = useCallback((key) => {
    // Reset booking state if navigating to book-service from sidebar
    if (key === "/book-service") {
      dispatch(resetBooking());
    }

    if (isMobile) {
      handleDrawerClose();
    }
  }, [dispatch, isMobile]);

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
              <img
                src="/images/klayra_logo.svg"
                alt="KLYRA Logo"
                className={styles.mobileHeaderLogoImage}
              />
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
                <img
                  src="/images/klayra_logo.svg"
                  alt="KLYRA Logo"
                  className={styles.mobileHeaderLogoImage}
                />
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
