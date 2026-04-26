import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { apiUrl } from "../config";

const STORAGE_KEY = "book-bazaar-admin-token";

const AdminContext = createContext();

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within AdminContextProvider");
  }
  return ctx;
};

const adminEndpoint = (path) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return apiUrl(p);
};

export const AdminContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setReady(true);
        return;
      }
      setReady(false);
      try {
        const r = await fetch(adminEndpoint("/admin/verify"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        if (!r.ok) {
          setToken("");
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* keep token on network error */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (username, password) => {
    let r;
    try {
      r = await fetch(adminEndpoint("/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
    } catch {
      const e = new Error("network");
      e.code = "network";
      throw e;
    }
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const e = new Error(data.error || "Login failed");
      e.status = r.status;
      throw e;
    }
    if (!data.token) {
      throw new Error("No token in response");
    }
    setToken(data.token);
    try {
      localStorage.setItem(STORAGE_KEY, data.token);
    } catch {
      /* ignore */
    }
    return data.token;
  }, []);

  const logout = useCallback(async () => {
    const t = token;
    setToken("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (t) {
      try {
        await fetch(adminEndpoint("/admin/logout"), {
          method: "POST",
          headers: { Authorization: `Bearer ${t}` },
        });
      } catch {
        /* ignore */
      }
    }
  }, [token]);

  const authFetch = useCallback(
    (path, init = {}) => {
      if (!token) {
        return Promise.reject(new Error("Not authenticated"));
      }
      return fetch(adminEndpoint(path), {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    },
    [token]
  );

  const value = useMemo(
    () => ({
      ready,
      token,
      isAdmin: Boolean(token),
      login,
      logout,
      authFetch,
    }),
    [ready, token, login, logout, authFetch]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

AdminContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
