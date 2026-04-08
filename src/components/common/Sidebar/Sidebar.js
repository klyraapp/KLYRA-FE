/**
 * Sidebar Component
 * Navigation sidebar - Pixel-perfect implementation matching the KLYRA design
 */

import { useTranslation } from "@/hooks/useTranslation";
import { logout } from "@/redux/reducers/authSlice";
import { deleteCookie } from "@/utils/utils";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import {
  FiBell,
  // FiBriefcase,
  FiCalendar,
  FiHome,
  FiMenu,
  FiRepeat,
  FiUserPlus
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import styles from "../../../../styles/sidebar.module.css";
import SidebarItem from "../../Sidebar/SidebarItem";

const Sidebar = ({ collapsed, onCollapse, onItemClick }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { t } = useTranslation();

  const isBookingFlow = useMemo(() => {
    const bookingPaths = [
      "/book-service",
      "/booking-details",
      "/booking-details-extra",
      "/booking-extra-services",
      "/booking-date",
      "/booking-customer-info",
      "/booking/payment",
      "/booking/confirmation",
    ];
    return bookingPaths.includes(currentPath);
  }, [currentPath]);

  const MENU_ITEMS = useMemo(
    () => [
      {
        key: "/",
        icon: FiHome,
        label: t("navigation.home", { fallback: "Home" }),
        badge: null,
      },
      {
        key: "/book-service",
        icon: FiUserPlus,
        label: t("navigation.bookService", { fallback: "Book Service" }),
        badge: null,
      },
      {
        key: "/bookings",
        icon: FiCalendar,
        label: t("navigation.myBooking", { fallback: "My Booking" }),
        badge: null,
      },
      {
        key: "/subscriptions",
        icon: FiRepeat,
        label: t("navigation.subscriptions", { fallback: "Subscriptions" }),
        badge: null,
      },
      {
        key: "/notifications",
        icon: FiBell,
        label: t("navigation.notifications", { fallback: "Notifications" }),
        badge: null,
      },
      /* {
        key: "/profile",
        icon: FiBriefcase,
        label: t("navigation.profile", { fallback: "Profile" }),
        badge: null,
      }, */
    ],
    [t],
  );

  const handleMenuToggle = () => {
    if (onCollapse) {
      onCollapse(!collapsed);
    }
  };

  const menuElements = useMemo(() => {
    return MENU_ITEMS.map((item) => {
      const isActive =
        item.key === "/book-service" ? isBookingFlow : currentPath === item.key;

      return (
        <SidebarItem
          key={item.key}
          item={item}
          isActive={isActive}
          collapsed={collapsed}
          onItemClick={onItemClick}
        />
      );
    });
  }, [MENU_ITEMS, currentPath, collapsed, isBookingFlow]);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    localStorage.removeItem("rememberedEmail");
    router.push("/login");
  };

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}
    >
      <div
        className={`${styles.header} ${collapsed ? styles.headerCollapsed : ""}`}
      >
        <div
          className={`${styles.logo} ${collapsed ? styles.logoCollapsed : ""}`}
        >
          <img
            src="/images/klayra_logo.svg"
            alt="KLYRA Logo"
            className={styles.logoImage}
          />
        </div>
        <button
          type="button"
          className={styles.menuToggle}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <FiMenu className={styles.menuToggleIcon} />
        </button>
      </div>

      <nav className={styles.nav}>{menuElements}</nav>

      {!collapsed && (
        <div className={styles.footer}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            {t("auth.logout", { fallback: "Log Out" })}
          </button>
        </div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func,
  onItemClick: PropTypes.func,
};

Sidebar.defaultProps = {
  collapsed: false,
  onCollapse: null,
  onItemClick: null,
};

export default memo(Sidebar);
