import { guestLogin, userLogin } from "@/api/authApi";
import { useTranslation } from "@/hooks/useTranslation";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { AUTH_MESSAGES } from "../constants";
import { saveAuthTokens } from "../services/authStorage";

/**
 * Hook for handling login operations
 * @param {Object} options - Hook options
 * @param {boolean} options.rememberMe - Whether to remember user
 * @param {Function} options.onEmailPersist - Callback to persist email
 * @returns {Object} Login mutation state and handlers
 */
const useLogin = ({ rememberMe, onEmailPersist }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { mutate, isLoading } = useMutation({
    mutationFn: userLogin,
  });

  const { mutate: mutateGuest, isLoading: isGuestLoading } = useMutation({
    mutationFn: guestLogin,
  });

  const handleLoginSuccess = useCallback(
    (response, email) => {
      message.success(t("auth.loginSuccess", { fallback: AUTH_MESSAGES.LOGIN_SUCCESS }));

      const tokens = {
        access_token: response?.data?.access_token,
        refresh_token: response?.data?.refresh_token,
      };

      saveAuthTokens(tokens, rememberMe);
      if (email) onEmailPersist?.(email);
      router.push("/");
    },
    [rememberMe, onEmailPersist, router],
  );

  const handleLoginError = useCallback((err, credentials) => {
    if (
  err?.response?.data?.message === "User is not verified" ||
  err?.response?.data?.message === "Bruker er ikke verifisert"
) {
      message.warning(t("auth.verifyAccountToContinue", { fallback: "Please verify your account to continue." }));
      router.push({
        pathname: "/signup",
        query: {
          email: credentials?.email,
          step: "otp",
          type: "login_otp"
        }
      });
      return;
    }
    message.error(t("auth.loginError", { fallback: AUTH_MESSAGES.LOGIN_ERROR }));
  }, [router, t]);

  const login = useCallback(
    (credentials) => {
      const { email, password } = credentials;

      mutate(
        { email, password },
        {
          onSuccess: (response) => handleLoginSuccess(response, email),
          onError: (err) => handleLoginError(err, credentials),
        },
      );
    },
    [mutate, handleLoginSuccess, handleLoginError],
  );

  const loginWithGoogle = useCallback(
    (googleData) => {
      mutate(googleData, {
        onSuccess: (response) => handleLoginSuccess(response, googleData.email),
        onError: handleLoginError,
      });
    },
    [mutate, handleLoginSuccess, handleLoginError],
  );

  const enterAsGuest = useCallback(() => {
    mutateGuest(null, {
      onSuccess: (response) => handleLoginSuccess(response, null),
      onError: handleLoginError,
    });
  }, [mutateGuest, handleLoginSuccess, handleLoginError]);

  return {
    login,
    loginWithGoogle,
    enterAsGuest,
    isLoading,
    isGuestLoading,
  };
};

export default useLogin;
