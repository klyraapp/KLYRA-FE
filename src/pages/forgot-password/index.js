/**
 * Forgot Password Page
 * Implements a 3-step flow: Email Entry -> OTP Verification -> Reset Password
 * Adheres to shared design tokens and components
 */

import { forgotPassword, resetPasswordWithOtp, verifyOtp } from "@/api/authApi/index";
import Config from "@/components/common/Cofig";
import { LoginCard, LoginHeader, OtpVerification } from "@/features/auth/components";
import {
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from "@/features/auth/constants";
import { saveAuthTokens } from "@/features/auth/services/authStorage";
import {
  buttonStyles,
  buttonTheme,
  formStyles,
  linkStyles,
  loginPageStyles,
} from "@/features/auth/styles/login.styles";
import { useTranslation } from "@/hooks/useTranslation";
import { login as authSliceLogin } from "@/redux/reducers/authSlice";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";

const ForgotPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [step, setStep] = useState("email"); // 'email', 'otp', 'reset'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const { mutate: mutateForgot, isLoading: isForgotLoading } = useMutation({
    mutationFn: forgotPassword,
  });

  const { mutate: mutateVerify, isLoading: isVerifyLoading } = useMutation({
    mutationFn: (data) => verifyOtp("forgot_password_otp", data),
  });

  const { mutate: mutateReset, isLoading: isResetLoading } = useMutation({
    mutationFn: resetPasswordWithOtp,
  });

  const handleEmailSubmit = (formData) => {
    const data = { email: formData?.email };
    mutateForgot(data, {
      onSuccess: () => {
        message.success(t("auth.verificationCodeSent", { fallback: "Verification code sent to your email." }));
        setEmail(formData.email);
        setStep("otp");
      },
      onError: (err) => {
        message.error(err?.response?.data?.message || t("auth.anErrorOccurred", { fallback: "An error occurred" }));
      },
    });
  };

  const handleVerifyOtp = (otpValue) => {
    const data = { email, otp: otpValue };
    mutateVerify(data, {
      onSuccess: (response) => {
        if (response?.data?.message === "OTP_VERIFIED" || response?.message === "OTP_VERIFIED") {
          setOtp(otpValue);
          setStep("reset");
        } else {
          message.error(t("auth.otpVerificationFailed", { fallback: "OTP verification failed." }));
        }
      },
      onError: (err) => {
        message.error(err?.response?.data?.message || t("auth.invalidOtp", { fallback: "Invalid OTP" }));
      },
    });
  };

  const handleResetSubmit = (formData) => {
    const data = {
      email,
      otp,
      password: formData.password,
    };

    mutateReset(data, {
      onSuccess: (response) => {
        message.success(t("auth.passwordResetSuccessfully", { fallback: "Password reset successfully!" }));

        // As per requirement: "you will responce similar to like login key so based on this add to the auth guard and enter the user to the portal"
        if (response?.data?.access_token) {
          const tokens = {
            access_token: response?.data?.access_token,
            refresh_token: response?.data?.refresh_token,
          };
          saveAuthTokens(tokens, true);

          // Use response data for immediate Redux update
          dispatch(authSliceLogin(response?.data));

          router.push("/");
        } else {
          router.push("/login");
        }
      },
      onError: (err) => {
        message.error(err?.response?.data?.message || t("auth.failedToResetPassword", { fallback: "Failed to reset password" }));
      },
    });
  };

  const renderStep = () => {
    switch (step) {
      case "otp":
        return (
          <>
            <LoginHeader title={t("auth.verifyOtp", { fallback: "Verify OTP" })} />
            <OtpVerification
              email={email}
              onVerify={handleVerifyOtp}
              isLoading={isVerifyLoading}
              type="forgot_password_otp"
            />
          </>
        );

      case "reset":
        return (
          <>
            <LoginHeader title={t("auth.newPassword", { fallback: "New Password" })} />
            <Form onFinish={handleResetSubmit} style={formStyles.form}>
              <div style={formStyles.fieldContainer}>
                <label style={formStyles.label}>{t("auth.newPasswordLabel", { fallback: "New Password" })}</label>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your new password" },
                    {
                      pattern: PASSWORD_REGEX,
                      message: PASSWORD_VALIDATION_MESSAGE,
                    },
                  ]}
                  style={formStyles.formItem}
                >
                  <Input.Password
                    placeholder={t("auth.enterNewPassword", { fallback: "Enter new password" })}
                    style={formStyles.input}
                  />
                </Form.Item>
              </div>

              <div style={formStyles.fieldContainer}>
                <label style={formStyles.label}>{t("auth.confirmPasswordLabel", { fallback: "Confirm Password" })}</label>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("The two passwords do not match!"));
                      },
                    }),
                  ]}
                  style={formStyles.formItem}
                >
                  <Input.Password
                    placeholder={t("auth.confirmNewPassword", { fallback: "Confirm new password" })}
                    style={formStyles.input}
                  />
                </Form.Item>
              </div>

              <Form.Item style={formStyles.buttonFormItem}>
                <Config theme={buttonTheme}>
                  <Button
                    style={buttonStyles.loginButton}
                    type="primary"
                    htmlType="submit"
                    loading={isResetLoading}
                  >
                    {t("auth.resetPassword", { fallback: "Reset Password" })}
                  </Button>
                </Config>
              </Form.Item>
            </Form>
          </>
        );

      default:
        return (
          <>
            <LoginHeader title={t("auth.forgotPassword", { fallback: "Forgot Password" })} />
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px", marginTop: "-16px" }}>
              {t("auth.enterEmailToReceiveCode", { fallback: "Enter your email to receive a verification code." })}
            </p>
            <Form onFinish={handleEmailSubmit} style={formStyles.form}>
              <div style={formStyles.fieldContainer}>
                <label style={formStyles.label}>{t("auth.emailAddressLabel", { fallback: "Email Address" })}</label>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                  style={formStyles.formItem}
                >
                  <Input
                    placeholder="Enter Your Email"
                    style={formStyles.input}
                  />
                </Form.Item>
              </div>

              <Form.Item style={formStyles.buttonFormItem}>
                <Config theme={buttonTheme}>
                  <Button
                    style={buttonStyles.loginButton}
                    type="primary"
                    htmlType="submit"
                    loading={isForgotLoading}
                  >
                    {t("auth.sendCode", { fallback: "Send Code" })}
                  </Button>
                </Config>
              </Form.Item>

              <div style={linkStyles.registerContainer}>
                <Link href="/login" style={linkStyles.registerLinkBold}>
                  {t("auth.backToLogin", { fallback: "Back to Login" })}
                </Link>
              </div>
            </Form>
          </>
        );
    }
  };

  return (
    <div style={loginPageStyles.pageContainer}>
      <LoginCard>
        {renderStep()}
      </LoginCard>
    </div>
  );
};

export default ForgotPassword;

ForgotPassword.getLayout = function (page) {
  return <>{page}</>;
};
