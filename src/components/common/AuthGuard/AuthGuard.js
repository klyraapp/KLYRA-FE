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

  
  const applyUserData = useCallback(
    (userData) => {
      if (!userData) return false;

      sessionStorage.removeItem("manual_logout");
      dispatch(login(userData));

      const isGuest = userData.roles?.[0]?.name === "Guest" || !userData.email;
      const fullName =
        `${userData.firstName || ""} ${userData.lastName || ""}`.trim();

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

      if (isGuest && !sessionStorage.getItem("guest_welcomed")) {
        showGuestNotification();
        sessionStorage.setItem("guest_welcomed", "true");
      } else if (!isGuest) {
        sessionStorage.removeItem("guest_welcomed");
      }

      return true;
    },
    [dispatch, showGuestNotification],
  );

  
  const tryGuestLogin = useCallback(async () => {
    try {
      const response = await guestLogin();
      if (!response?.data?.access_token) return false;

      saveAuthTokens(
        {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        },
        false,
      );

      // Validate the newly issued guest token
      try {
        const meResponse = await meAuth();
        if (meResponse?.data) {
          return applyUserData(meResponse.data);
        }
      } catch {
        // Guest token was rejected immediately — clean up
        deleteCookie("access_token");
        deleteCookie("refresh_token");
      }
    } catch (error) {
      console.error("Guest login failed:", error);
    }
    return false;
  }, [applyUserData]);

  const validateAuth = useCallback(async () => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const isOnRoot = router.pathname === "/";
    const isManualLogout = Boolean(sessionStorage.getItem("manual_logout"));
    let currentToken = getAccessTokenCookie("access_token");

     
    if (!currentToken && isOnRoot && !isManualLogout) {
      const guestSuccess = await tryGuestLogin();
      setIsAuthorized(guestSuccess);
      setIsLoading(false);
      return;
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
        applyUserData(userData);
        setIsAuthorized(true);
      } else {
        dispatch(logout());
        setIsAuthorized(false);
      }
    } catch {
      
      dispatch(logout());
      deleteCookie("access_token");
      deleteCookie("refresh_token");

      
      if (isOnRoot && !isManualLogout) {
        const guestSuccess = await tryGuestLogin();
        setIsAuthorized(guestSuccess);
        setIsLoading(false);
        return;
      }

      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router.pathname, applyUserData, tryGuestLogin]);

  useEffect(() => {
    if (isPublicRoute) {
      setIsLoading(false);
      setIsAuthorized(true);
      return;
    }

    if (!isLangLoading) {
      validateAuth();
    }
  }, [isPublicRoute, validateAuth, router.pathname, isLangLoading]);

  useEffect(() => {
    if (isLoading) return;

    const hasToken =
      typeof window !== "undefined"
        ? Boolean(getAccessTokenCookie("access_token"))
        : false;

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
