/**
 * Booking Customer Info Page
 * Step 4: Customer information collection
 */

import HeaderBar from "@/components/BookService/HeaderBar";
import PrimaryNavigationButtons from "@/components/common/Booking/PrimaryNavigationButtons";
import SelectedServiceCard from "@/components/common/Booking/SelectedServiceCard";
import { useServicePricing } from "@/hooks/useServicePricing";
import { useTranslation } from "@/hooks/useTranslation";
import { setCustomerInfo } from "@/redux/reducers/bookingSlice";
import styles from "@/styles/BookingCustomerInfo.module.css";
import { getServiceIcon } from "@/utils/utils";
import { Form, Input } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";



const BookingCustomerInfo = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { currentPrice, selectedService } = useServicePricing();
  const customerInfo = useSelector((state) => ({
    firstName: state.booking.firstName,
    lastName: state.booking.lastName,
    email: state.booking.email,
    phone: state.booking.phone,
    serviceStreetAddress: state.booking.serviceStreetAddress,
    servicePostalCode: state.booking.servicePostalCode,
  }));

  useEffect(() => {
    if (router.isReady && !selectedService) {
      router.push("/book-service");
    }
  }, [selectedService, router]);

  useEffect(() => {
    form.setFieldsValue(customerInfo);
  }, [customerInfo, form]);

  const handleValuesChange = (_, allValues) => {
    dispatch(setCustomerInfo(allValues));
  };

  const handleBack = () => {
    router.push("/booking-date");
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      router.push("/booking/payment");
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  if (!selectedService) {
    return null;
  }

  const ServiceIcon = getServiceIcon(selectedService.name);

  const getValidationMessage = (key, field, values = {}) => {
    // Generate a fallback label by turning camelCase into space separated Title Case
    const fallbackLabel = field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('Service ', '');

    return t(`bookingFlow.validation.${key}`, {
      field: t(`bookingFlow.${field}`, { fallback: fallbackLabel }),
      ...values,
      fallback: `${fallbackLabel} is invalid`,
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <HeaderBar currentStep={4} />
      <div className={styles.pageContainer}>
        <SelectedServiceCard
          serviceName={selectedService.name}
          price={currentPrice}
          icon={selectedService.icon}
          fallbackIcon={ServiceIcon}
        />

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            {t("bookingFlow.additionalInformation", {
              fallback: "Additional Information",
            })}
          </h2>

          <Form
            form={form}
            layout="vertical"
            initialValues={customerInfo}
            onValuesChange={handleValuesChange}
            requiredMark={false}
            className={styles.form}
          >
            <div className={styles.formGrid}>
              <Form.Item
                name="firstName"
                label={t("bookingFlow.firstName", { fallback: "First Name" })}
                rules={[
                  {
                    required: true,
                    message: getValidationMessage("required", "firstName"),
                  },
                ]}
              >
                <Input
                  placeholder={t("bookingFlow.firstName", {
                    fallback: "First Name",
                  })}
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={t("bookingFlow.lastName", { fallback: "Last Name" })}
                rules={[
                  {
                    required: true,
                    message: getValidationMessage("required", "lastName"),
                  },
                ]}
              >
                <Input
                  placeholder={t("bookingFlow.lastName", {
                    fallback: "Last Name",
                  })}
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={t("bookingFlow.emailAddress", {
                  fallback: "Email address",
                })}
                rules={[
                  {
                    required: true,
                    message: getValidationMessage("required", "emailAddress"),
                  },
                  {
                    type: "email",
                    message: getValidationMessage("email", "emailAddress"),
                  },
                ]}
              >
                <Input
                  type="email"
                  placeholder={t("bookingFlow.emailAddress", {
                    fallback: "Email address",
                  })}
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label={t("bookingFlow.telephoneNumber", {
                  fallback: "Telephone number",
                })}
                rules={[
                  {
                    required: true,
                    message: getValidationMessage("required", "telephoneNumber"),
                  },
                  {
                    pattern: /^\+?[0-9\s-]{8,20}$/,
                    message: getValidationMessage("phone", "telephoneNumber"),
                  },
                ]}
              >
                <Input
                  placeholder={t("bookingFlow.phonePlaceholder", {
                    fallback: "Telephone number",
                  })}
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="serviceStreetAddress"
                label={t("bookingFlow.address", { fallback: "Address" })}
                rules={[
                  {
                    required: true,
                    message: getValidationMessage("required", "address"),
                  },
                  {
                    min: 5,
                    message: getValidationMessage("minLength", "address", {
                      min: 5,
                    }),
                  },
                  {
                    max: 255,
                    message: getValidationMessage("maxLength", "address", {
                      max: 255,
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={t("bookingFlow.streetPlaceholder", {
                    fallback: "Street # 1",
                  })}
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="servicePostalCode"
                label={t("bookingFlow.postalCode", { fallback: "Postal Code" })}
                rules={[
                  {
                    required: true,
                    message: getValidationMessage("required", "postalCode"),
                  },
                  {
                    min: 4,
                    message: getValidationMessage("minLength", "postalCode", {
                      min: 4,
                    }),
                  },
                  {
                    max: 10,
                    message: getValidationMessage("maxLength", "postalCode", {
                      max: 10,
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={t("bookingFlow.postalPlaceholder", {
                    fallback: "Postal code",
                  })}
                  className={styles.input}
                />
              </Form.Item>
            </div>
          </Form>
        </div>

        <PrimaryNavigationButtons onBack={handleBack} onNext={handleNext} />
      </div>

      <style jsx global>{`
        .ant-form-item-label > label {
          font-size: 15px !important;
          font-weight: 600 !important;
          color: #374151 !important;
          padding-bottom: 8px !important;
        }
        .ant-form-item {
          margin-bottom: 24px !important;
        }
        @media (max-width: 768px) {
          .ant-form-item-label > label {
            font-size: 14px !important;
            padding-bottom: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingCustomerInfo;
