/**
 * Logo Component
 * Renders the Klyra brand logo using the same SVG as the sidebar
 */

import Image from "next/image";

const Logo = () => (
  <div style={{ textAlign: "center", marginBottom: "16px" }}>
    <Image
      src="/images/klayra_logo.svg"
      alt="KLYRA Logo"
      width={120}
      height={40}
      priority
      style={{ objectFit: "contain" }}
    />
  </div>
);

export default Logo;
