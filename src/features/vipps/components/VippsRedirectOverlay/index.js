/**
 * VippsRedirectOverlay Component
 * Full-screen overlay shown immediately after the user clicks "Pay with Vipps"
 * and before the browser navigates to the Vipps payment URL.
 * Communicates that a redirect is in progress to prevent user confusion.
 */

import { Spin } from 'antd';
import styles from './VippsRedirectOverlay.module.css';

const VippsRedirectOverlay = () => (
  <div className={styles.overlay} role="status" aria-live="polite">
    <div className={styles.card}>
      <div className={styles.vippsLogo} aria-hidden="true">V</div>
      <Spin size="large" className={styles.spinner} />
      <h2 className={styles.title}>Redirecting to Vipps…</h2>
      <p className={styles.subtitle}>
        Please wait while we securely redirect you to complete your payment.
      </p>
    </div>
  </div>
);

export default VippsRedirectOverlay;
