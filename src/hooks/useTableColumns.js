/**
 * useTableColumns Hook
 * Provides translated table column definitions
 */

import RecurringIndicator from "@/components/common/RecurringIndicator";
import { useMemo } from "react";
import { useTranslation } from "./useTranslation";

const useTableColumns = () => {
  const { t } = useTranslation();

  const getCustomersColumns = useMemo(
    () => (handleRowAction, styles, StatusBadge, ActionMenu) => [
      {
        title: t("table.customerId"),
        dataIndex: "customerId",
        key: "customerId",
        width: 120,
      },
      {
        title: t("table.name"),
        dataIndex: "name",
        key: "name",
        width: 180,
        render: (name, record) => (
          <div className={styles.nameCell}>
            <span className={styles.customerName}>{name}</span>
            <span className={styles.customerEmail}>{record.email}</span>
          </div>
        ),
      },
      {
        title: t("table.contact"),
        dataIndex: "contact",
        key: "contact",
        width: 130,
      },
      {
        title: t("table.joinDate"),
        dataIndex: "joinDate",
        key: "joinDate",
        width: 140,
      },
      {
        title: t("table.status"),
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (status) => <StatusBadge status={status} />,
      },
      {
        title: t("table.actions"),
        key: "actions",
        width: 80,
        align: "center",
        render: (_, record) => (
          <ActionMenu onAction={handleRowAction} record={record} />
        ),
      },
    ],
    [t],
  );

  const getBookingsColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatArea,
        formatCurrency,
        formatDate,
        formatTime,
        formatBookingStatus,
        showEdit = false,
        showDelete = false,
      ) => [
        {
          title: t("table.bookingId"),
          dataIndex: "bookingNumber",
          key: "bookingNumber",
          width: 120,
          render: (bookingNumber, record) => (
            <>
              {bookingNumber}
              {record?.subscription && (
                <RecurringIndicator
                  interval={record.subscription.recurringIntervalType}
                />
              )}
            </>
          ),
        },
        {
          title: t("table.customer"),
          key: "customer",
          width: 180,
          render: (_, record) => (
            <div className={styles.nameCell}>
              <span className={styles.customerName}>
                {`${record?.firstName || ""} ${record?.lastName || ""}`.trim() ||
                  "-"}
              </span>
              <span className={styles.customerEmail}>
                {record?.email || "-"}
              </span>
            </div>
          ),
        },
        {
          title: t("table.service"),
          dataIndex: "accommodationType",
          key: "service",
          width: 120,
          render: (type) => type || "-",
        },
        {
          title: t("table.area"),
          dataIndex: "areaSqm",
          key: "area",
          width: 80,
          align: "center",
          render: (area) => formatArea(area),
        },
        {
          title: t("table.price"),
          dataIndex: "totalAmount",
          key: "price",
          width: 100,
          render: (amount) => formatCurrency(amount),
        },
        {
          title: t("table.date"),
          dataIndex: "bookingDate",
          key: "date",
          width: 120,
          render: (date) => formatDate(date),
        },
        {
          title: t("table.time"),
          dataIndex: "startTime",
          key: "time",
          width: 100,
          render: (time) => formatTime(time),
        },
        {
          title: t("table.status"),
          dataIndex: "status",
          key: "status",
          width: 120,
          render: (status) => (
            <StatusBadge status={formatBookingStatus(status)} />
          ),
        },
        {
          title: t("table.actions"),
          key: "actions",
          width: 80,
          align: "center",
          render: (_, record) => (
            <ActionMenu
              onAction={handleRowAction}
              record={record}
              actions={[
                { key: "view", label: t("common.view") },
                ...(showEdit ? [{ key: "edit", label: t("common.edit") }] : []),
                ...(showDelete
                  ? [{ key: "delete", label: t("common.delete") }]
                  : []),
              ]}
            />
          ),
        },
      ],
    [t],
  );

  const getServicesColumns = useMemo(
    () =>
      (handleRowAction, styles, StatusBadge, ActionMenu, formatCurrency) => [
        {
          title: t("table.serviceId"),
          dataIndex: "id",
          key: "id",
          width: 80,
        },
        {
          title: t("table.serviceName"),
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: t("table.description"),
          dataIndex: "description",
          key: "description",
          width: 300,
          ellipsis: true,
        },
        {
          title: t("table.basePrice"),
          dataIndex: "basePrice",
          key: "basePrice",
          width: 120,
          render: (price) => formatCurrency(price),
        },
        {
          title: t("table.status"),
          dataIndex: "isActive",
          key: "status",
          width: 100,
          render: (isActive) => (
            <StatusBadge status={isActive ? "active" : "inactive"} />
          ),
        },
        {
          title: t("table.actions"),
          key: "actions",
          width: 80,
          align: "center",
          render: (_, record) => (
            <ActionMenu onAction={handleRowAction} record={record} />
          ),
        },
      ],
    [t],
  );

  const getDiscountCodesColumns = useMemo(
    () => (handleRowAction, styles, StatusBadge, ActionMenu, formatDate) => [
      {
        title: t("table.code"),
        dataIndex: "code",
        key: "code",
        width: 150,
      },
      {
        title: t("table.discount"),
        dataIndex: "discountValue",
        key: "discount",
        width: 120,
        render: (value, record) =>
          record.discountType === "PERCENTAGE" ? `${value}%` : `${value} NOK`,
      },
      {
        title: t("table.validFrom"),
        dataIndex: "validFrom",
        key: "validFrom",
        width: 140,
        render: (date) => formatDate(date),
      },
      {
        title: t("table.validTo"),
        dataIndex: "validUntil",
        key: "validTo",
        width: 140,
        render: (date) => formatDate(date),
      },
      {
        title: t("table.status"),
        dataIndex: "isActive",
        key: "status",
        width: 100,
        render: (isActive) => (
          <StatusBadge status={isActive ? "active" : "inactive"} />
        ),
      },
      {
        title: t("table.actions"),
        key: "actions",
        width: 80,
        align: "center",
        render: (_, record) => (
          <ActionMenu onAction={handleRowAction} record={record} />
        ),
      },
    ],
    [t],
  );

  const getAdditionalServicesColumns = useMemo(
    () =>
      (handleRowAction, styles, StatusBadge, ActionMenu, formatCurrency) => [
        {
          title: t("table.serviceId"),
          dataIndex: "id",
          key: "id",
          width: 80,
        },
        {
          title: t("table.serviceName"),
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: t("table.description"),
          dataIndex: "description",
          key: "description",
          width: 300,
          ellipsis: true,
        },
        {
          title: t("table.price"),
          dataIndex: "price",
          key: "price",
          width: 120,
          render: (price) => formatCurrency(price),
        },
        {
          title: t("table.status"),
          dataIndex: "isActive",
          key: "status",
          width: 100,
          render: (isActive) => (
            <StatusBadge status={isActive ? "active" : "inactive"} />
          ),
        },
        {
          title: t("table.actions"),
          key: "actions",
          width: 80,
          align: "center",
          render: (_, record) => (
            <ActionMenu onAction={handleRowAction} record={record} />
          ),
        },
      ],
    [t],
  );

  const getSpecialOffersColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatDate,
        showDelete = true,
      ) => [
        {
          title: t("table.offerId"),
          dataIndex: "id",
          key: "id",
          width: 80,
        },
        {
          title: t("table.offerName"),
          dataIndex: "name",
          key: "name",
          width: 200,
          render: (name, record) => (
            <div className={styles.nameCell}>
              <span className={styles.offerName}>{name}</span>
              <span className={styles.offerDescription}>
                {record.description}
              </span>
            </div>
          ),
        },
        {
          title: t("table.discountType"),
          dataIndex: "discountType",
          key: "discountType",
          width: 120,
          render: (type) => (type === "PERCENTAGE" ? "Percentage" : "Fixed"),
        },
        {
          title: t("table.discount"),
          dataIndex: "discountValue",
          key: "discount",
          width: 120,
          render: (value, record) =>
            record.discountType === "PERCENTAGE" ? `${value}%` : `${value} NOK`,
        },
        {
          title: t("table.validFrom"),
          dataIndex: "validFrom",
          key: "validFrom",
          width: 140,
          render: (date) => formatDate(date),
        },
        {
          title: t("table.validTo"),
          dataIndex: "validTo",
          key: "validTo",
          width: 140,
          render: (date) => formatDate(date),
        },
        {
          title: t("table.status"),
          dataIndex: "isActive",
          key: "status",
          width: 100,
          render: (isActive) => (
            <StatusBadge status={isActive ? "active" : "inactive"} />
          ),
        },
        {
          title: t("table.actions"),
          key: "actions",
          width: 80,
          align: "center",
          render: (_, record) => (
            <ActionMenu
              onAction={handleRowAction}
              record={record}
              actions={[
                { key: "view", label: t("common.view") },
                { key: "edit", label: t("common.edit") },
                ...(showDelete
                  ? [{ key: "delete", label: t("common.delete") }]
                  : []),
              ]}
            />
          ),
        },
      ],
    [t],
  );

  return {
    getCustomersColumns,
    getBookingsColumns,
    getServicesColumns,
    getDiscountCodesColumns,
    getAdditionalServicesColumns,
    getSpecialOffersColumns,
  };
};

export default useTableColumns;
