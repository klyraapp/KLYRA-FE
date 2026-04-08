/**
 * SidebarItem Component
 * Individual menu item for the sidebar navigation
 * Supports active state, icons, labels, and badges
 */

import Link from "next/link";
import PropTypes from "prop-types";
import { memo } from "react";
import styles from "../../../styles/sidebar.module.css";

const SidebarItem = memo(({ item, isActive, collapsed, onItemClick }) => {
  const IconComponent = item.icon;

  const handleClick = () => {
    if (onItemClick) {
      onItemClick(item.key);
    }
  };

  return (
    <Link href={item.key} className={styles.menuItemLink} onClick={handleClick}>
      <div
        className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""} ${collapsed ? styles.menuItemCollapsed : ""}`}
      >
        <IconComponent className={styles.menuIcon} />
        <span
          className={`${styles.menuLabel} ${collapsed ? styles.menuLabelCollapsed : ""}`}
        >
          {item.label}
        </span>
        {item.badge !== null && item.badge > 0 && (
          <span
            className={`${styles.badge} ${collapsed ? styles.badgeCollapsed : ""}`}
          >
            {item.badge}
          </span>
        )}
      </div>
    </Link>
  );
});

SidebarItem.displayName = "SidebarItem";

SidebarItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    badge: PropTypes.number,
  }).isRequired,
  isActive: PropTypes.bool,
  collapsed: PropTypes.bool,
  onItemClick: PropTypes.func,
};

SidebarItem.defaultProps = {
  isActive: false,
  collapsed: false,
  onItemClick: null,
};

export default SidebarItem;
