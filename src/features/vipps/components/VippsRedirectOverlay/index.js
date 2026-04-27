/**
 * VippsRedirectOverlay Component
 *
 * Thin backwards-compatible wrapper around the generic PaymentRedirectOverlay
 * so existing call-sites (`<VippsRedirectOverlay />`) continue to work. New
 * code should prefer `<PaymentRedirectOverlay provider="vipps" />` directly.
 */

import PaymentRedirectOverlay from '../PaymentRedirectOverlay';

const VippsRedirectOverlay = () => <PaymentRedirectOverlay provider="vipps" />;

export default VippsRedirectOverlay;
