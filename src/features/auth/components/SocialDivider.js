/**
 * SocialDivider Component
 * Renders a horizontal divider with "or" text
 * Matches the pixel-perfect login/signup design
 */

import { useTranslation } from "@/hooks/useTranslation";
import { dividerStyles } from "../styles/login.styles";

const SocialDivider = () => {
  const { t } = useTranslation();

  return (
    <div style={dividerStyles.container}>
      <div style={dividerStyles.line} />
      <span style={dividerStyles.text}>{t("auth.or", { fallback: "or" })}</span>
      <div style={dividerStyles.line} />
    </div>
  );
};

export default SocialDivider;
