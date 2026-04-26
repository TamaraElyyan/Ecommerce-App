import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { DEMO_ADMIN } from "../config";

const Login = () => {
  const { t, isRTL } = useLanguage();
  const { login, isAdmin, ready } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && isAdmin) {
      navigate(typeof from === "string" && from !== "/login" ? from : "/admin", { replace: true });
    }
  }, [ready, isAdmin, navigate, from]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate(
        typeof from === "string" && from !== "/login" ? from : "/admin",
        { replace: true }
      );
    } catch (err) {
      if (err?.code === "network") {
        setError(t("login.apiUnreachable"));
      } else if (err?.status === 404) {
        setError(t("login.apiNotFound"));
      } else {
        setError(
          err?.message === "Invalid credentials" || err?.status === 401
            ? t("login.badCreds")
            : err?.message || t("login.badCreds")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <p
        className={`m-auto max-w-96 py-20 text-center text-sm text-stone-600 dark:text-stone-400 ${
          isRTL ? "text-right" : ""
        }`}
      >
        {t("app.loading")}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`m-auto flex w-[90%] max-w-96 flex-col gap-4 text-stone-800 dark:text-stone-100 ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`mb-2 mt-10 inline-flex items-center gap-2 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <p className="prata-regular text-2xl sm:text-3xl">{t("login.adminTitle")}</p>
        <span className="h-[2px] w-8 rounded-full bg-red-800 dark:bg-red-500" />
      </div>
      <p className="text-sm text-stone-600 dark:text-stone-400">{t("login.adminHint")}</p>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </p>
      )}

      <label className="flex flex-col gap-1.5 text-sm text-stone-700 dark:text-stone-300">
        {t("login.username")}
        <input
          type="text"
          autoComplete="username"
          className="rounded-lg border border-stone-400 bg-white px-3 py-2.5 transition focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800/30 dark:border-stone-600 dark:bg-stone-800"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-stone-700 dark:text-stone-300">
        {t("login.password")}
        <input
          type="password"
          autoComplete="current-password"
          className="rounded-lg border border-stone-400 bg-white px-3 py-2.5 transition focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800/30 dark:border-stone-600 dark:bg-stone-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <button
        type="button"
        onClick={() => {
          setError("");
          setUsername(DEMO_ADMIN.user);
          setPassword(DEMO_ADMIN.password);
        }}
        className="w-full rounded-lg border-2 border-dashed border-stone-300 bg-rose-50/80 py-2.5 text-sm font-medium text-red-900 transition hover:border-red-300 hover:bg-rose-100/80 dark:border-stone-500 dark:bg-red-950/20 dark:text-red-200 dark:hover:bg-red-950/40"
      >
        {t("login.demoFill")}
      </button>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-red-900 py-2.5 text-sm font-medium text-white transition hover:bg-red-800 disabled:opacity-60 dark:bg-red-800 dark:hover:bg-red-700"
      >
        {loading ? t("login.signing") : t("login.signIn")}
      </button>
    </form>
  );
};

export default Login;
