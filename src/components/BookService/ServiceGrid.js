/**
 * ServiceGrid Component
 * Grid layout for service cards
 */

import styles from "@/styles/BookService.module.css";
import { getServiceBasePrice } from "@/utils/pricing";
import { getServiceIcon } from "@/utils/utils";
import PropTypes from "prop-types";
import ServiceCard from "./ServiceCard";



const ServiceGrid = ({ services, selectedService, onServiceSelect }) => {
  if (!services || services.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No services available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={styles.serviceGrid}>
      {Array.isArray(services) && services.map((service) => {
        const IconComponent = getServiceIcon(service?.name);
        const displayPrice = getServiceBasePrice(service);

        return (
          <ServiceCard
            key={service?.id}
            icon={service?.icon}
            fallbackIcon={IconComponent}
            title={service?.name}
            description={service?.description}
            price={displayPrice}
            selected={selectedService?.id === service?.id}
            onClick={() => onServiceSelect(service)}
          />
        );
      })}
    </div>
  );
};

ServiceGrid.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      basePrice: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
      extraServices: PropTypes.array,
    }),
  ),
  selectedService: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  onServiceSelect: PropTypes.func.isRequired,
};

ServiceGrid.defaultProps = {
  services: [],
  selectedService: null,
};

export default ServiceGrid;
