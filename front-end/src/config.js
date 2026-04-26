/** sessionStorage: recent orders for “My orders” (same browser) */
export const ORDERS_SESSION_KEY = "book-bazaar-my-orders";

/**
 * Default admin credentials (must match server ADMIN_USER / ADMIN_PASSWORD when not set in server .env)
 */
export const DEMO_ADMIN = {
  user: "admin",
  password: "bookbazaar2026",
};

/** API base: empty in dev (Vite proxy to Express). In prod: full origin e.g. https://api.example.com */
export const getApiBase = () => (import.meta.env.VITE_API_URL || "").trim();

/**
 * @param {string} path - API subpath, e.g. "/products" or "/admin/login" (no "/api" prefix)
 * @returns {string} Absolute same-origin URL in the browser, or a full URL when VITE_API_URL is set
 */
export const apiUrl = (path) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  const rel = p.startsWith("/api") ? p : `/api${p}`;
  const base = getApiBase();
  if (base.startsWith("http://") || base.startsWith("https://")) {
    return `${base.replace(/\/$/, "")}${rel}`;
  }
  // Same-origin absolute URL — avoids path-relative bugs (e.g. /product/1 → wrong /product/api/…)
  if (typeof globalThis !== "undefined" && globalThis.location?.origin) {
    return new URL(rel, globalThis.location.origin).href;
  }
  return rel;
};

export const productsUrl = () => apiUrl("/products");
