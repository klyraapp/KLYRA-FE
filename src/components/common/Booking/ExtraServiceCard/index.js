import { getExtraServiceIcon } from "@/utils/utils";
import styles from "./ExtraServiceCard.module.css";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Radio } from "antd";

const ExtraServiceCard = ({ 
  extraService, 
  isSelected, 
  quantity = 1, 
  onToggle, 
  onQuantityUpdate 
}) => {
  const IconComponent = getExtraServiceIcon(extraService.name);
  const bucketUrl = process.env.NEXT_PUBLIC_AWS_PUBLIC_BUCKET_URL;

  return (
    <div
      className={`${styles.extraServiceCard} ${isSelected ? styles.extraServiceCardSelected : ""}`}
      onClick={() => onToggle(extraService.id)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onToggle(extraService.id);
        }
      }}
    >
      <div className={styles.extraServiceIconContainer}>
        {extraService.icon && extraService.icon.length > 0 ? (
          <>
            <img
              src={extraService.icon.startsWith('http') ? extraService.icon : `${bucketUrl}/${extraService.icon}`}
              alt={extraService.name || ""}
              className={styles.extraServiceIconImage}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement.querySelector(`[data-fallback="true"]`);
                if (fallback) fallback.style.display = 'block';
              }}
            />
            {IconComponent && (
              <IconComponent
                data-fallback="true"
                className={styles.extraServiceIcon}
                style={{ display: 'none' }}
              />
            )}
          </>
        ) : (
          IconComponent && <IconComponent className={styles.extraServiceIcon} />
        )}
      </div>
      <div className={styles.extraServiceInfo}>
        <h4 className={styles.extraServiceName}>{extraService.name || ""}</h4>
        {extraService.description && (
          <p className={styles.extraServiceDescription}>{extraService.description}</p>
        )}
        <p className={styles.extraServicePrice}>
          NOK {parseFloat(extraService.price || 0).toFixed(2)}
        </p>
        {isSelected && onQuantityUpdate && (
          <div className={styles.quantitySelector}>
            <button
              type="button"
              className={styles.quantityBtn}
              onClick={(e) => onQuantityUpdate(e, extraService.id, -1)}
            >
              <FiMinus size={14} />
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button
              type="button"
              className={styles.quantityBtn}
              onClick={(e) => onQuantityUpdate(e, extraService.id, 1)}
            >
              <FiPlus size={14} />
            </button>
          </div>
        )}
      </div>
      <Radio checked={isSelected} className={styles.extraServiceRadio} />
    </div>
  );
};

export default ExtraServiceCard;
