/**
 * Stripe Library Initialization
 * Memoized Stripe instance for secure PCI-compliant payments
 */

import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;

/**
 * Returns a memoized Stripe instance
 * Ensures Stripe is only loaded once
 */
export const getStripePromise = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error("Stripe publishable key is missing");
    return null;
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

/**
 * Stripe Elements appearance theme matching KLYRA design
 */
export const STRIPE_APPEARANCE = {
  theme: "stripe",
  variables: {
    colorPrimary: "#297160",
    colorBackground: "#ffffff",
    colorText: "#1f2937",
    colorDanger: "#dc2626",
    fontFamily: "Inter, system-ui, sans-serif",
    spacingUnit: "4px",
    borderRadius: "8px",
    fontSizeBase: "16px",
  },
  rules: {
    ".Input": {
      border: "1px solid #e5e7eb",
      boxShadow: "none",
      padding: "12px 16px",
    },
    ".Input:focus": {
      border: "1px solid #297160",
      boxShadow: "0 0 0 2px rgba(41, 113, 96, 0.1)",
    },
    ".Label": {
      fontWeight: "500",
      marginBottom: "8px",
    },
    ".Error": {
      color: "#dc2626",
      fontSize: "14px",
    },
  },
};
