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

    if (payload?.user) {
      return { success: true, user: payload.user };
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

    const user = payload?.user || null;
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
 * Reset password using email and new password.
 * @param {string} email
 * @param {string} newPassword
 */
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { email, newPassword });
    const payload = getData(response);

    if (!payload?.success) {
      return {
        success: false,
        error: payload?.message || 'Error occurred while resetting password. Please try again later.',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        'Error occurred while resetting password. Please try again later.',
    };
  }
};

/**
 * Send forgot password email.
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    const payload = getData(response);

    if (!payload?.success) {
      return {
        success: false,
        error: payload?.message || 'Error occurred while sending email.',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        'Error occurred while sending email.',
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