/**
 * Redirects to the new bookings page.
 */

import { useRouter } from "next/router";
import { useEffect } from "react";

const MyBookingRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/bookings");
  }, [router]);

  return null;
};

export default MyBookingRedirect;
