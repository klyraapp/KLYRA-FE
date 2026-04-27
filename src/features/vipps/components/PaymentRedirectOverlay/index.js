/**
 * PaymentRedirectOverlay Component
 *
 * Generic, brand-aware full-screen overlay shown while the browser is
 * navigating the user to an external payment provider (Vipps / Klarna / …).
 *
 * Shared between all redirect-based payment methods so we have a single,
 * consistent "we are redirecting you" UX without duplicating markup.
 *
 * Props:
 *   provider  - 'vipps' | 'klarna' (determines brand color, logo, default copy)
 *   title     - Optional override for the main heading
 *   subtitle  - Optional override for the subtitle
 */

import { Spin } from 'antd';
import PropTypes from 'prop-types';
import styles from './PaymentRedirectOverlay.module.css';

/**
 * Static brand registry. Adding a new redirect-based provider is a one-line
 * change here plus exporting a thin wrapper below.
 */
const BRAND_CONFIG = {
  vipps: {
    logoLetter: 'V',
    logoBackground: '#ff5b24',
    logoColor: '#ffffff',
    title: 'Redirecting to Vipps…',
    subtitle:
      'Please wait while we securely redirect you to complete your payment.',
  },
  klarna: {
    logoLetter: 'K',
    logoBackground: '#ffa8cd',
    logoColor: '#17120f',
    title: 'Redirecting to Klarna…',
    subtitle:
      'Please wait while we securely redirect you to Klarna to complete your payment.',
  },
};

const PaymentRedirectOverlay = ({ provider, title, subtitle }) => {
  const brand = BRAND_CONFIG[provider] ?? BRAND_CONFIG.vipps;

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.card}>
        <div
          className={styles.logo}
          style={{
            backgroundColor: brand.logoBackground,
            color: brand.logoColor,
          }}
          aria-hidden="true"
        >
          {brand.logoLetter}
        </div>
        <Spin size="large" className={styles.spinner} />
        <h2 className={styles.title}>{title ?? brand.title}</h2>
        <p className={styles.subtitle}>{subtitle ?? brand.subtitle}</p>
      </div>
    </div>
  );
};

PaymentRedirectOverlay.propTypes = {
  provider: PropTypes.oneOf(['vipps', 'klarna']),
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

PaymentRedirectOverlay.defaultProps = {
  provider: 'vipps',
  title: null,
  subtitle: null,
};

export default PaymentRedirectOverlay;
