
const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const unwrapPayload = (payload) => {
  if (payload && typeof payload === 'object' && payload.data && typeof payload.data === 'object') {
    return payload.data;
  }

  return payload;
};


const requestAuthJson = async (path, options = {}) => {
  const response = await fetch(path, {
    cache: 'no-store',
    credentials: 'include',
    ...options,
    headers: {
      ...JSON_HEADERS,
      ...(options.headers || {}),
    },
  });

  const rawPayload = await safeJson(response);
  const payload = unwrapPayload(rawPayload);

  return {
    response,
    rawPayload,
    payload,
  };
};



export const getToken = async () => {
try {
    const response = await fetch('/auth/verify-me', {
      method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        return {
          success: false,
          error: "Error while verify token.",
        };
      }

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: "Error while verify token.",
      };
    }

};



// export const getCurrentUser = () => {
//   const token = getToken();
//   if (!token) return null;
//   return decodeToken(token);
// };



export const loginUser = async (email, password) => {
  try {
    const submitLogin = async (token) => requestAuthJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    let loginResponse = await submitLogin(csrfToken);

    const { response, payload } = loginResponse;

    if (response.ok && payload?.user) {
      return {
        success: true,
        user: payload.user,
      };
    }

    return {
      success: false,
      error: 'Unable to sign in. Please check your credentials and try again.',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Unable to sign in. Please check your credentials and try again.',
    };
  }
};



export const registerUser = async (userData) => {
  try {
    const isGoogleOnboarding =
      userData.oauthProvider === 'google' &&
      Boolean(userData.oauthToken || userData.googleOnboardingToken);

    const payload = isGoogleOnboarding
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

    const submitSignup = async () => requestAuthJson(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    let signupResponse = await submitSignup();

    const { response, payload: responsePayload } = signupResponse;
    const user = responsePayload?.user || null;
    const success =
      response.ok &&
      Boolean(
        user ||
        responsePayload?.success ||
        response.status === 201
      );

    if (success) {
      return {
        success: true,
        user,
      };
    }

    return {
      success: false,
      error: "Error occurred while creating account. Please try again later.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error occurred while creating account. Please try again later.",
      field: error?.field || null,
      status: error?.status || null,
    };
  }
};

export const resetPassword = async (email , newPassword) => {
  
  
  
  try {
    const response = await fetch('auth/reset-password', {
      method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        return {
          success: false,
          error: "Error occurred while resetting password. Please try again later.",
        };
      }

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: "Error occurred while resetting password. Please try again later.",
      };
    }
  };

export const forgotPassword = async (email) => {
  
  try {
    const response = await fetch('/auth/forgot-password', {
      method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        return {
          success: false,
          error: "Error occurred while sending Email.",
        };
      }

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: "Error occurred while sending Email.",
      };
    }
  };


export const logoutUser = async() => {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        return {
          success: false,
          error: "Error while logging out.",
        };
      }

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: "Error while logging out.",
      };
    }
  };