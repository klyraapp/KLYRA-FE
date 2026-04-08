/**
 * SelectableCard Component
 * Reusable selectable card for accommodation types, intervals, etc.
 */

import styles from "@/styles/components/SelectableCard.module.css";
import PropTypes from "prop-types";

const SelectableCard = ({
  icon: Icon,
  title,
  subtitle,
  selected,
  onClick,
  variant,
}) => {
  const cardClass = `${styles.card} ${selected ? styles.selected : ""} ${
    variant === "horizontal" ? styles.horizontal : styles.vertical
  }`;

  return (
    <div
      className={cardClass}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      {Icon && <Icon className={styles.icon} />}
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
};

SelectableCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["vertical", "horizontal"]),
};

SelectableCard.defaultProps = {
  icon: null,
  subtitle: null,
  selected: false,
  variant: "vertical",
};

export default SelectableCard;
