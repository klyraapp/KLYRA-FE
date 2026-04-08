/**
 * LoginHeader Component
 * Renders the login page header with logo and title
 */

import { useTranslation } from "@/hooks/useTranslation";
import { headingStyles } from "../styles/login.styles";
import Logo from "./Logo";

const LoginHeader = ({ title, testId = "Login-heading" }) => {
  const { t } = useTranslation();
  const displayTitle = title || t("auth.signInToKlyra", { fallback: "Sign in to Klyra" });

  return (
    <>
      <Logo />
      <h1 style={headingStyles.title} data-testid={testId}>
        {displayTitle}
      </h1>
    </>
  );
};

export default LoginHeader;
