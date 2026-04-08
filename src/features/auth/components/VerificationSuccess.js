/**
 * VerificationSuccess Component
 * Displays a success message with a checkmark icon after OTP verification
 */

import { useTranslation } from "@/hooks/useTranslation";
import { CheckCircleFilled } from "@ant-design/icons";
import { Typography } from "antd";

const { Title, Text } = Typography;

const VerificationSuccess = () => {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <CheckCircleFilled
        style={{
          fontSize: "64px",
          color: "#0d7377",
          marginBottom: "24px"
        }}
      />

      <Title level={3} style={{ marginBottom: "12px", color: "#1a1a1a" }}>
        {t("auth.verified", { fallback: "Verified!" })}
      </Title>

      <Text style={{ fontSize: "16px", color: "#666", display: "block", marginBottom: "8px" }}>
        {t("auth.accountVerified", { fallback: "Your account has been successfully verified." })}
      </Text>

      <Text style={{ fontSize: "14px", color: "#999" }}>
        {t("auth.redirectingToLogin", { fallback: "Redirecting you to login..." })}
      </Text>
    </div>
  );
};

export default VerificationSuccess;
