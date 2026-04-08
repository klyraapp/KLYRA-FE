/**
 * StripeProvider Component
 * Wraps children with Stripe Elements context for secure payment handling
 */

import { getStripePromise, STRIPE_APPEARANCE } from "@/lib/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { Spin } from "antd";
import PropTypes from "prop-types";
import { useMemo } from "react";
import styles from "./StripeProvider.module.css";

const StripeProvider = ({ clientSecret, children }) => {
  const stripePromise = useMemo(() => getStripePromise(), []);

  const options = useMemo(() => ({
    clientSecret,
    appearance: STRIPE_APPEARANCE,
    loader: "auto",
  }), [clientSecret]);

  if (!clientSecret) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <p className={styles.loadingText}>Initializing payment...</p>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>
          Payment system is currently unavailable. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

StripeProvider.propTypes = {
  clientSecret: PropTypes.string,
  children: PropTypes.node.isRequired,
};

StripeProvider.defaultProps = {
  clientSecret: null,
};

export default StripeProvider;
