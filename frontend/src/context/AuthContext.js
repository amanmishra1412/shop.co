"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/utils/auth";
import { normalizeUser } from "@/utils/normalize";

const AuthContext = createContext(null);
const STORAGE_KEY = "shopco_user";

const readStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) || window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? normalizeUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const writeStoredUser = (user) => {
  if (typeof window === "undefined") return;

  try {
    if (!user) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    const serialized = JSON.stringify(user);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    window.sessionStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Storage is best-effort only.
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((nextUser) => {
    const normalized = nextUser ? normalizeUser(nextUser) : null;
    setUser(normalized);
    writeStoredUser(normalized);
    return normalized;
  }, []);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      const cached = readStoredUser();
      if (active) {
        setUser(cached);
      }

      try {
        const result = await getCurrentUser();
        if (!active) return;

        if (result.success && result.user) {
          persistUser(result.user);
        } else if (!cached) {
          persistUser(null);
        }
      } catch {
        if (active && !cached) {
          persistUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      active = false;
    };
  }, [persistUser]);

  const login = useCallback(
    (userData) => {
      persistUser(userData);
    },
    [persistUser]
  );

  const logout = useCallback(async () => {
    await logoutUser().catch(() => null);
    persistUser(null);
  }, [persistUser]);

  const isAuthenticated = Boolean(user?.id || user?.email || user?.name);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
