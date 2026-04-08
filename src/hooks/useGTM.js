import { useEffect } from 'react';

/**
 * Key for localStorage to prevent duplicate firing of the same transaction.
 */
const GTM_FIRED_TRANSACTIONS_KEY = 'gtm_purchase_fired';

/**
 * Custom hook to trigger GA4-compatible GTM purchase event once per transaction.
 * 
 * @param {boolean} condition - Condition to fire the event (e.g. payment success)
 * @param {Object} data - Purchase data (transaction_id, value, currency, tax, shipping, items, payment_method)
 */
export const useGTMPurchaseTracking = (condition, data) => {
  useEffect(() => {
    // 1. Browser-only execution & simple null safety
    if (typeof window === "undefined" || !condition || !data?.transaction_id) {
      return;
    }

    const transactionId = data.transaction_id.toString();

    // 2. Prevent duplicate firing on page refresh/route changes via localStorage
    let firedIds = [];
    try {
      firedIds = JSON.parse(localStorage.getItem(GTM_FIRED_TRANSACTIONS_KEY) || '[]');
    } catch (e) {
      firedIds = [];
    }

    if (firedIds.includes(transactionId)) {
      return;
    }

    // 3. Construct GA4 Ecommerce Payload
    const payload = {
      event: "purchase",
      transaction_id: transactionId,
      value: Number(data.value || 0),           // Ensure number
      currency: data.currency || "NOK",
      tax: Number(data.tax || 0),               // Default to 0
      shipping: Number(data.shipping || 0),     // Default to 0
      payment_method: data.payment_method,
      items: Array.isArray(data.items) ? data.items : []
    };

    // 4. Environment Control
    if (process.env.NODE_ENV === "production") {
      // Initialize dataLayer if missing
      window.dataLayer = window.dataLayer || [];
      // Use window.dataLayer.push() only
      window.dataLayer.push(payload);
    } else {
      // 5. Dev Debugging: Log to console in development
      console.log("Purchase event payload:", payload);
    }

    // 6. Persist fired transaction ID
    try {
      firedIds.push(transactionId);
      // Keep only last 50 transactions to save space
      if (firedIds.length > 50) firedIds.shift();
      localStorage.setItem(GTM_FIRED_TRANSACTIONS_KEY, JSON.stringify(firedIds));
    } catch (e) {
       // Silent fail
    }
  }, [condition, data?.transaction_id]); // Trigger if condition changes or transaction_id changes
};
