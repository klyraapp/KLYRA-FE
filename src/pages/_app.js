/**
 * Next.js App Component
 * Root application wrapper with global layout and theme support
 */

import AuthGuard from "@/components/common/AuthGuard";
import AppLayout from "@/components/common/Layout/Layout";
import { LanguageProvider } from "@/context/LanguageContext";
import reduxStore from "@/redux/store";
import { resetBooking } from "@/redux/reducers/bookingSlice";
import "@/styles/antd-overrides.css";
import "@/styles/auth-responsive.css";
import "@/styles/variables.css";
import ThemeProvider from "@/theme/ThemeProvider";
import { injectStore } from "@/utils/axiosMiddleware";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import "../../styles/App.css";

injectStore(reduxStore);

const BOOKING_PATHS = [
  "/book-service",
  "/booking-details",
  "/booking-details-extra",
  "/booking-extra-services",
  "/booking-date",
  "/booking-customer-info",
  "/booking/payment",
  "/booking/confirmation",
];

const isBookingPath = (p) => p && BOOKING_PATHS.includes(p);

const onExperimentViewed = (experiment, result) => {
  const experimentId = experiment.key;
  const variationId = result.key;
};

const gb = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-YRpkBjYFDdbpNRCo",
  enableDevMode: true,
  trackingCallback: onExperimentViewed,
});

function updateGrowthBookURL() {
  gb.setURL(window.location.href);
}

const App = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();

  // Track the path the user is leaving FROM (captured at routeChangeStart)
  const leavingFromRef = useRef(null);

  const getLayout =
    Component.getLayout || ((page) => <AppLayout>{page}</AppLayout>);

  useEffect(() => {
    (async () => {
      await gb.loadFeatures({ autoRefresh: true });
    })();

    gb.setAttributes({ id: "123" });
    router.events.on("routeChangeComplete", updateGrowthBookURL);

    return () => router.events.off("routeChangeComplete", updateGrowthBookURL);
  }, [router.events]);

  // Booking state reset — lives here because _app.js NEVER unmounts.
  // AppLayout unmounts when navigating to pages with custom getLayout
  // (e.g. /bookings, /subscriptions), so putting this logic there
  // would lose the ref and skip the reset.
  useEffect(() => {
    const handleRouteStart = (url) => {
      // Capture current pathname BEFORE navigation begins
      leavingFromRef.current = router.pathname;
    };

    const handleRouteComplete = (url) => {
      const destination = url.split("?")[0];
      const origin = leavingFromRef.current;

      // Leaving the booking flow → reset all booking state
      if (isBookingPath(origin) && !isBookingPath(destination)) {
        reduxStore.dispatch(resetBooking());
      }

      // Entering /book-service from outside the flow → fresh start
      if (destination === "/book-service" && !isBookingPath(origin)) {
        reduxStore.dispatch(resetBooking());
      }

      leavingFromRef.current = null;
    };

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, [router.events, router.pathname]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <GrowthBookProvider growthbook={gb}>
        <Provider store={reduxStore}>
          <QueryClientProvider client={queryClient}>
            <LanguageProvider>
              <ThemeProvider>
                <AuthGuard>
                  {getLayout(<Component {...pageProps} />)}
                </AuthGuard>
              </ThemeProvider>
            </LanguageProvider>
          </QueryClientProvider>
        </Provider>
      </GrowthBookProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
