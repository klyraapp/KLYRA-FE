/**
 * Book Service Page
 * Step 1: Service selection in multi-step booking flow
 */

import HeaderBar from "@/components/BookService/HeaderBar";
import ServiceGrid from "@/components/BookService/ServiceGrid";
import { useActiveServices } from "@/hooks/useServices";
import { useTranslation } from "@/hooks/useTranslation";
import { setSelectedService } from "@/redux/reducers/bookingSlice";
import styles from "@/styles/BookService.module.css";
import { Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const BookService = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectedService = useSelector((state) => state.booking.selectedService);
  const { data: services, isLoading, error, isError } = useActiveServices();

  useEffect(() => {
    const { service } = router.query;
    if (service && services) {
      const foundService = services.find((s) => s.id === parseInt(service, 10));
      if (foundService) {
        dispatch(setSelectedService(foundService));
      }
    }
  }, [router.query, services, dispatch]);

  const handleServiceSelect = (service) => {
    dispatch(setSelectedService(service));
    router.push({
      pathname: "/booking-details",
      query: { service: service.id },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <p style={{ marginTop: "16px", color: "#6b7280" }}>
            Loading services...
          </p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className={styles.errorContainer}>
          <p>Failed to load services. Please try again.</p>
          <p style={{ fontSize: "14px", color: "#9ca3af", marginTop: "8px" }}>
            {error?.message || "Unknown error"}
          </p>
        </div>
      );
    }

    return (
      <ServiceGrid
        services={services}
        selectedService={selectedService}
        onServiceSelect={handleServiceSelect}
      />
    );
  };

  return (
    <div>
      <HeaderBar currentStep={1} />
      <div className={styles.pageContainer}>
        <h2 className={styles.pageTitle}>{t('bookingFlow.ourServices', { fallback: 'Services' })}</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default BookService;
