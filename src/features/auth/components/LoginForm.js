/**
 * LoginForm Component
 * Main login form containing all form fields and actions
 * Matches the pixel-perfect design with divider and social buttons
 */

import Config from "@/components/common/Cofig";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Form } from "antd";
import {
  buttonStyles,
  buttonTheme,
  colors,
  dividerStyles,
  formStyles
} from "../styles/login.styles";
import FormField from "./FormField";
import LoginButton from "./LoginButton";
import RegisterLink from "./RegisterLink";
import RememberMeRow from "./RememberMeRow";

const LoginForm = ({
  form,
  onFinish,
  rememberMe,
  onRememberMeChange,
  isLoginLoading,
  isGuestLoading,
  language,
  onGoogleSuccess,
  onGoogleError,
  onGuestLogin,
}) => {
  const { t } = useTranslation();

  const EMAIL_RULES = [{ required: true, message: t("auth.emailPlaceholder") }];
  const PASSWORD_RULES = [];

  return (
    <Form name="login" form={form} onFinish={onFinish} style={formStyles.form}>
      <FormField
        name="email"
        label={t("auth.emailLabel")}
        placeholder={t("auth.emailPlaceholder")}
        rules={EMAIL_RULES}
        testId="email-input"
      />

      <FormField
        name="password"
        label={t("auth.passwordLabel")}
        placeholder={t("auth.passwordPlaceholder")}
        rules={PASSWORD_RULES}
        isPassword
      />

      <RememberMeRow checked={rememberMe} onChange={onRememberMeChange} />

      <LoginButton isLoading={isLoginLoading} />

      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        <span style={{ ...dividerStyles.text, color: colors.textMuted }}>{t("auth.or", { fallback: "or" })}</span>
      </div>

      <Form.Item style={formStyles.buttonFormItem}>
        <Config theme={buttonTheme}>
          <Button
            onClick={onGuestLogin}
            disabled={isLoginLoading || isGuestLoading}
            style={{
              ...buttonStyles.loginButton,
              backgroundColor: 'transparent',
              color: colors.primary,
              border: `2px solid ${colors.primary}`
            }}
            loading={isGuestLoading}
          >
            {t("auth.enterAsGuest", { fallback: "Enter as Guest User" })}
          </Button>
        </Config>
      </Form.Item>

      {/* <SocialDivider />

      <SocialLoginButtons
        onGoogleSuccess={onGoogleSuccess}
        onGoogleError={onGoogleError}
      /> */}

      <RegisterLink language={language} />
    </Form>
  );
};

export default LoginForm;
