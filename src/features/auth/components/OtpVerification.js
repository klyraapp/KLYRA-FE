/**
 * OtpVerification Component
 * Segmented OTP input for multi-factor authentication or verification
 * Uses the same design tokens as Login/Signup components
 */

import { resendOtp } from "@/api/authApi";
import Config from "@/components/common/Cofig";
import { buttonStyles, buttonTheme, formStyles } from "@/features/auth/styles/login.styles";
import { useTranslation } from "@/hooks/useTranslation";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Typography, message } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const OtpVerification = ({ email, phone, onVerify, isLoading, type = "signup_otp" }) => {
  const [otpValue, setOtpValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes in seconds
  const { t } = useTranslation();

  const { mutate: mutateResend, isLoading: isResendLoading } = useMutation({
    mutationFn: (data) => resendOtp(type, data),
    onSuccess: () => {
      message.success(t("auth.verificationCodeResent", { fallback: "Verification code resent successfully" }));
      setTimeLeft(240); // Reset timer
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || t("auth.failedToResendCode", { fallback: "Failed to resend code" }));
    },
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onFinish = () => {
    if (otpValue.length < 4) {
      message.error(t("auth.pleaseEnter4DigitOtp", { fallback: "Please enter a 4-digit OTP" }));
      return;
    }
    onVerify(otpValue);
  };

  const handleResend = () => {
    mutateResend({ email, phone });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
        {t("auth.weSentCodeToMessage", { fallback: "We've sent a 4-digit verification code to " })}<br />
        <strong>{email}</strong>
      </p>

      <Form onFinish={onFinish} style={formStyles.form}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <Form.Item
            name="otp"
            style={{ marginBottom: 0 }}
          >
            <Input.OTP
              length={4}
              onChange={(val) => setOtpValue(val)}
              formatter={(str) => str.toUpperCase()}
              size="large"
              style={{
                height: "50px",
              }}
            />
          </Form.Item>
        </div>

        <Form.Item style={formStyles.buttonFormItem}>
          <Config theme={buttonTheme}>
            <Button
              style={buttonStyles.loginButton}
              type="primary"
              htmlType="submit"
              loading={isLoading}
            >
              {t("auth.verifyOtp", { fallback: "Verify OTP" })}
            </Button>
          </Config>
        </Form.Item>

        <div style={{ marginTop: "16px" }}>
          {timeLeft > 0 ? (
            <Text style={{ fontSize: "14px", color: "#666" }}>
              {t("auth.resendCodeIn", { fallback: "Resend code in " })} <span style={{ color: "#0d7377", fontWeight: "600" }}>{formatTime(timeLeft)}</span>
            </Text>
          ) : (
            <Text style={{ fontSize: "14px", color: "#666" }}>
              {t("auth.didNotReceiveCode", { fallback: "Didn't receive the code? " })}
              <Button
                type="link"
                style={{ color: "#0d7377", padding: 0, height: "auto", fontWeight: "600" }}
                onClick={handleResend}
                loading={isResendLoading}
              >
                {t("auth.resendNow", { fallback: "Resend Now" })}
              </Button>
            </Text>
          )}
        </div>
      </Form>
    </div>
  );
};

export default OtpVerification;
