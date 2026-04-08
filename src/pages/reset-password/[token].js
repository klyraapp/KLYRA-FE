/**
 * Reset Password Page
 * Matches the login/signup card UI for visual consistency
 * Centered card with KLYRA branding
 */

import { resetPassword } from "@/api/authApi/index";
import Config from "@/components/common/Cofig";
import { LoginCard, LoginHeader } from "@/features/auth/components";
import {
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from "@/features/auth/constants";
import {
  buttonStyles,
  buttonTheme,
  formStyles,
  linkStyles,
  loginPageStyles,
} from "@/features/auth/styles/login.styles";
import { useTranslation } from "@/hooks/useTranslation";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { token } = router?.query || {};
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => resetPassword(token, data),
  });

  const onFinish = (formData) => {
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      message.error(t("auth.passwordsDoNotMatch", { fallback: "Passwords do not match." }));

      return;
    }

    const data = {
      password,
    };

    mutate(data, {
      onSuccess: () => {
        message.success(t("auth.passwordResetSuccessfully", { fallback: "Password reset successfully." }));
        router.push("/login");
      },
      onError: (err) => {
        message.error(err?.response?.data?.msg || t("auth.anErrorOccurred", { fallback: "An error occurred" }));
      },
    });
  };

  return (
    <div style={loginPageStyles.pageContainer}>
      <LoginCard>
        <LoginHeader title={t("auth.resetPassword", { fallback: "Reset Password" })} />

        <p
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "24px",
            marginTop: "-16px",
          }}
        >
          {t("auth.enterNewPassword", { fallback: "Enter your new password" })}
        </p>

        <Form name="reset-password" onFinish={onFinish} style={formStyles.form}>
          <div style={formStyles.fieldContainer}>
            <label style={formStyles.label}>{t("auth.newPasswordLabel", { fallback: "New Password" })}</label>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: t("auth.enterNewPassword", { fallback: "Please enter your new password" }) },
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
              rules={[
                { required: true, message: t("auth.pleaseConfirmPassword", { fallback: "Please confirm your password" }) },
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
                loading={isLoading}
                data-testid="reset-submit"
              >
                {t("auth.resetPassword", { fallback: "Reset Password" })}
              </Button>
            </Config>
          </Form.Item>

          <div style={linkStyles.registerContainer}>
            <Link href="/login" style={linkStyles.registerLinkBold}>
              {t("auth.backToLogin", { fallback: "Back to Login" })}
            </Link>
          </div>
        </Form>
      </LoginCard>
    </div>
  );
};

export default ResetPassword;

ResetPassword.getLayout = function (page) {
  return <>{page}</>;
};
