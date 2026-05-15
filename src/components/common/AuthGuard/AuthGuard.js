/**
 * AuthGuard Component
 * Protects routes from unauthorized access
 * Redirects to login if not authenticated
 */

import { guestLogin, meAuth } from "@/api/authApi";
import { saveAuthTokens } from "@/features/auth/services/authStorage";
import { useTranslation } from "@/hooks/useTranslation";
import { login, logout } from "@/redux/reducers/authSlice";
import { setProfileData } from "@/redux/reducers/userState";
import { getAccessTokenCookie } from "@/utils/axiosMiddleware";
import { deleteCookie } from "@/utils/utils";
import { notification, Spin } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/payment/result",
  "/payment-callback",
];

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, isLoading: isLangLoading } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    router.pathname.startsWith(route),
  );

  const showGuestNotification = useCallback(() => {
    notification.info({
      message: t("auth.accessingAsGuest", { fallback: "Accessing as Guest" }),
      description: t("auth.guestReminder", {
        fallback:
          "To save your data and manage your bookings, please log out and sign in with a registered account before proceeding.",
      }),
      placement: "topRight",
      duration: 6,
      style: {
        borderRadius: "8px",
        borderLeft: "4px solid #1890ff",
      },
    });
  }, [t]);

  const validateAuth = useCallback(async () => {
    // Ensure we only run on the client
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    let currentToken = getAccessTokenCookie("access_token");

    // Auto-call guest login for the base URL, unless user manually logged out in this session
    if (!currentToken && router.pathname === "/") {
      const isManualLogout = sessionStorage.getItem("manual_logout");
      if (!isManualLogout) {
        try {
          const response = await guestLogin();
          if (response?.data?.access_token) {
            saveAuthTokens({
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
            }, false);
            currentToken = response.data.access_token;
          }
        } catch (error) {
          console.error("Guest login failed:", error);
        }
      }
    }

    if (!currentToken) {
      dispatch(logout());
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await meAuth();
      const userData = response?.data;

      if (userData) {
        // Clear manual logout flag upon successful authentication
        sessionStorage.removeItem("manual_logout");
        dispatch(login(userData));

        const isGuest = userData.roles?.[0]?.name === "Guest" || !userData.email;
        const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();

        dispatch(
          setProfileData({
            profileName: fullName || "Guest User",
            email: userData.email || "Guest Account",
            role: userData.roles?.[0]?.name || "Guest",
            permissions: userData.permissions || [],
            id: userData.id,
            userLanguage: userData.languagePreference || "en",
          }),
        );

        // If they just logged in as guest (auto or manual), show the notification
        if (isGuest && !sessionStorage.getItem('guest_welcomed')) {
          showGuestNotification();
          sessionStorage.setItem('guest_welcomed', 'true');
        } else if (!isGuest) {
          // If they aren't a guest, make sure to reset the welcomed flag for next time
          sessionStorage.removeItem('guest_welcomed');
        }

        setIsAuthorized(true);
      } else {
        dispatch(logout());
        setIsAuthorized(false);
      }
    } catch {
      dispatch(logout());
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router.pathname, showGuestNotification]);

  useEffect(() => {
    if (isPublicRoute) {
      if (router.pathname === "/login") {
        sessionStorage.setItem("manual_logout", "true");
        sessionStorage.removeItem('guest_welcomed'); // Reset welcome flag when explicitly logging out
      }
      setIsLoading(false);
      setIsAuthorized(true);
      return;
    }

    if (!isLangLoading) {
      validateAuth();
    }
  }, [isPublicRoute, validateAuth, router.pathname, isLangLoading]);



  useEffect(() => {
    if (isLoading) {
      return;
    }

    const hasToken = typeof window !== "undefined" ? Boolean(getAccessTokenCookie("access_token")) : false;

    if (!isAuthorized && !isPublicRoute && !hasToken) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isPublicRoute && hasToken) {
      router.replace("/");
    }
  }, [isLoading, isAuthorized, isAuthenticated, isPublicRoute, router]);

  if (isLoading || isLangLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!isAuthorized && !isPublicRoute) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Spin size="large" tip="Redirecting..." />
      </div>
    );
  }

  return children;
};

export default AuthGuard;

