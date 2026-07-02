import api, { getData } from "./api";
import { normalizeUser } from "./normalize";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:5000";

const buildPath = (path = "") => `${BACKEND_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

const isSuccessfulResponse = (response, payload) =>
  Boolean(response?.status >= 200 && response?.status < 300 && payload?.success !== false);

const extractUser = (payload, fallback = {}) =>
  normalizeUser(
    payload?.user ||
      payload?.userData ||
      payload?.userDetail ||
      payload?.data?.user ||
      payload?.data?.userData ||
      payload?.data?.userDetail ||
      fallback
  );

export const getToken = async () => {
  try {
    const response = await api.post("/auth/verify-me");
    const payload = getData(response);

    if (!isSuccessfulResponse(response, payload)) {
      return { success: false, error: "Error while verifying token." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Error while verifying token." };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.post("/auth/verify-me");
    const payload = getData(response);

    if (!isSuccessfulResponse(response, payload)) {
      return { success: false, error: "Error while verifying token." };
    }

    return { success: true, user: extractUser(payload) };
  } catch {
    return { success: false, error: "Error while verifying token." };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const payload = getData(response);

    if (!isSuccessfulResponse(response, payload)) {
      return {
        success: false,
        error: payload?.message || payload?.error || "Unable to sign in. Please check your credentials and try again.",
      };
    }

    return {
      success: true,
      user: extractUser(payload, { email }),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to sign in. Please check your credentials and try again.",
    };
  }
};

export const registerUser = async (userData) => {
  try {
    const isGoogleOnboarding =
      userData.oauthProvider === "google" &&
      Boolean(userData.oauthToken || userData.googleOnboardingToken);

    const body = isGoogleOnboarding
      ? {
          token: userData.oauthToken || userData.googleOnboardingToken,
          name: userData.name?.trim(),
          email: userData.email?.trim().toLowerCase(),
          password: userData.password,
        }
      : {
          name: userData.name?.trim(),
          email: userData.email?.trim().toLowerCase(),
          password: userData.password,
        };

    const endpoint = isGoogleOnboarding ? "/auth/google/complete-signup" : "/auth/signup";
    const response = await api.post(endpoint, body);
    const payload = getData(response);

    if (!isSuccessfulResponse(response, payload) && !payload?.userData && !payload?.userDetail && !payload?.user) {
      return {
        success: false,
        error: payload?.message || "Error occurred while creating account. Please try again later.",
      };
    }

    return { success: true, user: extractUser(payload, body) };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Error occurred while creating account. Please try again later.",
      field: error?.response?.data?.field || null,
      status: error?.response?.status || null,
    };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post("/auth/reset-password", { token, newPassword });
    const payload = getData(response);

    if (!isSuccessfulResponse(response, payload)) {
      return {
        success: false,
        error: payload?.message || "Error occurred while resetting password. Please try again later.",
      };
    }

    return { success: true, message: payload.message };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error occurred while resetting password. Please try again later.",
    };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    const payload = getData(response);

    if (!isSuccessfulResponse(response, payload)) {
      return {
        success: false,
        error: payload?.message || "Error occurred while sending email.",
      };
    }

    return { success: true, message: payload.message };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error occurred while sending email.",
    };
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    const payload = getData(response);

    if (!isSuccessfulResponse(response, payload)) {
      return { success: false, error: "Error while logging out." };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error?.response?.data?.error || "Error while logging out.",
    };
  }
};

export const startOAuthLogin = (provider = "google", redirectTo = "/") => {
  if (typeof window === "undefined") return;

  const url = new URL(buildPath(`/auth/${provider}`));
  if (redirectTo) {
    url.searchParams.set("redirect", redirectTo);
  }

  window.location.assign(url.toString());
};

