/**
 * Payment Callback Page — /payment-callback
 * 
 * Some backend configurations or Vipps portal settings may point to this URL
 * instead of /payment/result. This page acts as a bridge to ensure the user 
 * always lands on the status polling page regardless of which URL Vipps uses.
 */

import { Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PaymentCallback = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      // Reconstruct the query string to preserve bookingId, paymentStatus, etc.
      const queryParams = new URLSearchParams(router.query).toString(); 
      const targetUrl = `/payment/result${queryParams ? `?${queryParams}` : ''}`;

      console.log('Redirecting from callback to result:', targetUrl);
      router.replace(targetUrl);
    }
  }, [router.isReady, router.query]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '16px',
      color: '#6b7280'
    }}>
      <Spin size="large" />
      <p>Finalizing your payment...</p>
    </div>
  );
};

export default PaymentCallback;
