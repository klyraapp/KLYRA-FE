/**
 * RegisterLink Component
 * Link to registration page with feature flag
 * Matches pixel-perfect design: "Don't have an account? Sign Up"
 */

import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { linkStyles } from "../styles/login.styles";

const RegisterLink = () => {
  const { t } = useTranslation();

  return (
    <div style={linkStyles.registerContainer}>
      <span style={linkStyles.registerLink}>
        {t("auth.dontHaveAccount", { fallback: "Don't have an account? " })}
      </span>
      <Link href="/signup" style={linkStyles.registerLinkBold}>
        {t("auth.signUp", { fallback: "Sign Up" })}
      </Link>
    </div>
  );
};

export default RegisterLink;
