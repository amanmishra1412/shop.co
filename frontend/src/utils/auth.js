import api, { getData } from './api';

// ─────────────────────────────────────────────
// Auth APIs
// ─────────────────────────────────────────────

/**
 * Verify if the current user's token is valid.
 */
export const getToken = async () => {
  try {
    const response = await api.post('/auth/verify-me');
    const payload = getData(response);

    if (!payload?.success) {
      return { success: false, error: 'Error while verifying token.' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Error while verifying token.' };
  }
};

/**
 * Get current logged-in user details.
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.post('/auth/verify-me');
    const payload = getData(response);

    if (!payload?.success) {
      return { success: false, error: 'Error while verifying token.' };
    }

    return { success: true, user: payload?.user || null };
  } catch {
    return { success: false, error: 'Error while verifying token.' };
  }
};

/**
 * Login a user with email and password.
 * @param {string} email
 * @param {string} password
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const payload = getData(response);

    if (payload?.userData) {
      return { success: true, user: payload.userData };
    }

    return {
      success: false,
      error: payload?.message || 'Unable to sign in. Please check your credentials and try again.',
    };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        'Unable to sign in. Please check your credentials and try again.',
    };
  }
};

/**
 * Register a new user (supports both normal and Google OAuth onboarding).
 * @param {Object} userData
 */
export const registerUser = async (userData) => {
  try {
    const isGoogleOnboarding =
      userData.oauthProvider === 'google' &&
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

    const endpoint = isGoogleOnboarding
      ? '/auth/google/complete-signup'
      : '/auth/signup';

    const response = await api.post(endpoint, body);
    const payload = getData(response);

    const user = payload?.userDetail || null;
    const success = Boolean(user || payload?.success || response.status === 201);

    if (success) {
      return { success: true, user };
    }

    return {
      success: false,
      error: payload?.message || 'Error occurred while creating account. Please try again later.',
    };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error.message ||
        'Error occurred while creating account. Please try again later.',
      field: error?.response?.data?.field || null,
      status: error?.response?.status || null,
    };
  }
};

/**
 * Reset password using token and new password.
 * @param {string} token
 * @param {string} newPassword
 */
export const resetPassword = async (
  token,
  newPassword
) => {
  try {
    const response = await api.post(
      "/auth/reset-password",
      {
        token,
        newPassword,
      }
    );

    const payload = getData(response);

    if (!payload.success) {
      return {
        success: false,
        error: payload.message,
      };
    }

    return {
      success: true,
      message: payload.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Something went wrong.",
    };
  }
};

/**
 * Send forgot password email.
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    const payload = getData(response);

    if (!payload.success) {
      return {
        success: false,
        error: payload.message,
      };
    }

    return {
      success: true,
      message: payload.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Something went wrong.",
    };
  }
};

/**
 * Logout the current user.
 */
export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    const payload = getData(response);

    if (!payload?.success) {
      return { success: false, error: 'Error while logging out.' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || 'Error while logging out.',
    };
  }
};