import api from "@/utils/axiosMiddleware";

//** API FOR LOGIN ** //
export const userLogin = (data) => {
  return api.post("/auth/login", data);
};

// ** API for user info
export const meAuth = () => api.get("/auth/me");

// ** API for forgot password

export const forgotPassword = (data) => api.post("/auth/forgot-password-otp", data);

// ** API for reset password

export const resetPassword = (params, data) => {
  return api.post(`/auth/reset-password/${params}`, data);
};

export const signUp = (data) => api.post("/auth/register", data);

export const guestLogin = () => api.post("/auth/guest-login");

export const verifyOtp = (type, data) => api.post(`/auth/verify-otp/${type}`, data);

export const resendOtp = (type, data) => api.post(`/auth/resend-otp/${type}`, data);

export const resetPasswordWithOtp = (data) => api.post("/auth/reset-password-otp", data);

export const userLogout = () => api.post("/auth/logout");
