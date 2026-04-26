import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import {
  FaBars,
  FaEnvelope,
  FaHome,
  FaInfoCircle,
  FaMoon,
  FaShoppingCart,
  FaStore,
  FaSun,
  FaTimes,
  FaUser,
  FaShoppingBag,
  FaKey,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { useTheme } from "../context/ThemeContext";

const NavItem = ({ to, children, end }) => (
  <NavLink
    to={to}
    end={end}
    className="group flex flex-col items-center gap-1.5 rounded-lg px-3 py-2 outline-none transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-red-800/40"
  >
    {({ isActive }) => (
      <>
        <span
          className={`text-sm font-medium transition-colors duration-300 ${
            isActive
              ? "text-red-900 dark:text-red-400"
              : "text-stone-600 group-hover:text-red-800 dark:text-stone-300 dark:group-hover:text-red-400"
          }`}
        >
          {children}
        </span>
        <span
          className={`h-0.5 max-w-full rounded-full bg-gradient-to-r from-red-800 to-red-700 transition-all duration-300 ease-out ${
            isActive ? "w-9 opacity-100" : "w-0 opacity-0 group-hover:w-9 group-hover:opacity-100"
          }`}
        />
      </>
    )}
  </NavLink>
);

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useContext(ShopContext);
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { isAdmin, ready, logout } = useAdmin();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => {
      if (mq.matches) setVisible(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  const endAdminSession = () => {
    void logout();
    navigate("/", { replace: true });
  };

  const closeDrawer = () => setVisible(false);

  const mobileNavClass = (isActive) =>
    `group flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3.5 text-left text-[15px] font-medium leading-snug transition-all duration-200 sm:text-base ${
      isRTL ? "text-right" : "text-left"
    } ${
      isActive
        ? "border-red-300/70 bg-gradient-to-r from-red-50 via-amber-50/50 to-transparent text-red-900 shadow-sm ring-1 ring-red-200/30 dark:border-red-800/50 dark:from-red-950/50 dark:via-amber-950/20 dark:text-red-100 dark:ring-red-900/20"
        : "border-transparent text-stone-700 hover:border-stone-200/80 hover:bg-stone-100/60 dark:text-stone-200 dark:hover:border-stone-600/50 dark:hover:bg-stone-800/70"
    }`;

  const mobileIconClass = (isActive) =>
    `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base transition ${
      isActive
        ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
        : "bg-stone-100/90 text-stone-500 group-hover:bg-red-100/50 group-hover:text-red-800 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-red-950/30 dark:group-hover:text-red-300"
    }`;

  return (
    <div className="relative flex items-center justify-between py-5 font-medium gap-3">
      <Link
        to="/"
        className="rounded-lg outline-none transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-stone-900/10 focus-visible:ring-2 focus-visible:ring-red-800/50 active:translate-y-0"
      >
        <Logo />
      </Link>

      <ul className="hidden text-sm text-stone-700 sm:flex sm:items-center sm:gap-0.5 md:gap-1 dark:text-stone-200">
        <li>
          <NavItem to="/" end>
            {t("nav.home")}
          </NavItem>
        </li>
        <li>
          <NavItem to="/collection">{t("nav.collection")}</NavItem>
        </li>
        <li>
          <NavItem to="/about">{t("nav.about")}</NavItem>
        </li>
        <li>
          <NavItem to="/contact">{t("nav.contact")}</NavItem>
        </li>
      </ul>
      <div className={`flex items-center gap-2 sm:gap-[1.5rem] ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex items-center overflow-hidden rounded-lg border border-stone-200/90 bg-stone-50/50 p-0.5 text-xs shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-stone-900/5 dark:border-stone-600/50 dark:bg-stone-800/60">
            <button
              type="button"
              onClick={() => setLanguage("ar")}
              className={`rounded-md px-2.5 py-1.5 transition-all duration-200 ${
                language === "ar"
                  ? "bg-red-900 text-white shadow-sm"
                  : "bg-transparent text-stone-600 hover:bg-red-100/50 hover:text-red-900 dark:text-stone-300 dark:hover:bg-red-900/20 dark:hover:text-red-200"
              }`}
              aria-pressed={language === "ar"}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-md px-2.5 py-1.5 transition-all duration-200 ${
                language === "en"
                  ? "bg-red-900 text-white shadow-sm"
                  : "bg-transparent text-stone-600 hover:bg-red-100/50 hover:text-red-900 dark:text-stone-300 dark:hover:bg-red-900/20 dark:hover:text-red-200"
              }`}
              aria-pressed={language === "en"}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200/90 bg-stone-50/50 text-stone-600 transition hover:bg-amber-50 hover:text-amber-800 dark:border-stone-600/50 dark:bg-stone-800/60 dark:text-amber-200 dark:hover:bg-stone-700"
            aria-pressed={isDark}
            aria-label={isDark ? t("theme.toLight") : t("theme.toDark")}
          >
            {isDark ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
          </button>
        </div>
        <Link
          to="/cart"
          className="group relative rounded-lg p-1.5 outline-none transition-all duration-300 ease-out hover:bg-red-50/90 hover:shadow-sm hover:shadow-red-900/5 focus-visible:ring-2 focus-visible:ring-red-800/40"
        >
          <FaShoppingCart
            className="min-w-5 w-5 text-stone-500 transition duration-300 group-hover:scale-110 group-hover:text-red-800 dark:text-stone-400"
            size={20}
            aria-hidden
          />

          <span
            className={`absolute bottom-[-3px] w-4 text-center text-[8px] leading-4 text-white aspect-square rounded-full bg-red-800 shadow-sm transition-transform duration-200 group-hover:scale-110 ${
              isRTL ? "left-[-2px]" : "right-[-2px]"
            }`}
          >
            {getCartCount()}
          </span>
        </Link>
        <div className="group relative z-30">
          <Link
            to={ready && isAdmin ? "/admin" : "/login"}
            className="block rounded-lg p-1.5 text-stone-500 outline-none transition-all duration-300 ease-out hover:bg-red-50/90 hover:shadow-sm hover:shadow-red-900/5 focus-visible:ring-2 focus-visible:ring-red-800/50 dark:text-stone-400 dark:hover:bg-red-950/30"
            aria-haspopup="true"
            aria-label={ready && isAdmin ? t("nav.adminDashboard") : t("nav.adminLogin")}
          >
            <FaUser
              className={`h-5 w-5 transition duration-300 group-hover:scale-110 group-hover:text-red-800 ${
                ready && isAdmin ? "text-red-800" : ""
              }`}
            />
          </Link>
          <div
            className={`absolute top-full z-50 hidden min-w-[12rem] pt-2 group-hover:block ${isRTL ? "left-0" : "right-0"}`}
            role="menu"
            aria-label="Account"
          >
            <div
              className={`overflow-hidden rounded-xl border border-stone-200/90 bg-white py-1.5 shadow-lg shadow-stone-900/10 ring-1 ring-stone-900/5 dark:border-stone-600/50 dark:bg-stone-900 dark:ring-stone-800 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {ready && isAdmin ? (
                <Link
                  to="/admin"
                  role="menuitem"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-stone-700 transition duration-200 hover:bg-red-50 hover:text-red-900 dark:text-stone-200 dark:hover:bg-red-950/40"
                >
                  <FaUserShield className="h-3.5 w-3.5 shrink-0 text-red-800 dark:text-red-500" />
                  <span className="font-medium">{t("nav.adminDashboard")}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  role="menuitem"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-stone-700 transition duration-200 hover:bg-red-50 hover:text-red-900 dark:text-stone-200 dark:hover:bg-red-950/40"
                >
                  <FaUser className="h-3.5 w-3.5 shrink-0 text-stone-500 dark:text-stone-400" />
                  <span className="font-medium">{t("nav.adminLogin")}</span>
                </Link>
              )}
              <Link
                to="/orders"
                role="menuitem"
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-stone-700 transition duration-200 hover:bg-red-50 hover:text-red-900 dark:text-stone-200 dark:hover:bg-red-950/40"
              >
                <FaShoppingBag className="h-3.5 w-3.5 shrink-0 text-stone-500 dark:text-stone-400" />
                <span className="font-medium">{t("nav.orders")}</span>
              </Link>
              {ready && isAdmin && (
                <button
                  type="button"
                  onClick={endAdminSession}
                  className={`flex w-full items-center gap-2.5 border-t border-stone-100 px-3 py-2.5 text-sm text-stone-600 transition duration-200 hover:bg-stone-50 hover:text-stone-900 dark:border-stone-600 dark:hover:bg-stone-800 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <FaSignOutAlt className="h-3.5 w-3.5 shrink-0 text-stone-500 dark:text-stone-400" />
                  <span className="font-medium">{t("nav.logout")}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setVisible(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 transition-all duration-300 ease-out hover:scale-105 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800/40 active:scale-95 dark:hover:bg-stone-800 sm:hidden"
          aria-label="Menu"
          aria-expanded={visible}
        >
          <FaBars
            className={`h-5 w-5 origin-center transition-transform duration-300 ${
              visible ? "scale-90 rotate-90 opacity-70" : ""
            }`}
          />
        </button>
      </div>
      {/* Mobile drawer: backdrop (always mounted for fade in/out) */}
      <div
        className={`pointer-events-none fixed inset-0 z-40 touch-none bg-stone-900/50 backdrop-blur-[3px] sm:hidden ${
          visible ? "pointer-events-auto opacity-100" : "opacity-0"
        } transition-[opacity,backdrop-filter] duration-300 ease-out`}
        onClick={closeDrawer}
        role="presentation"
        aria-hidden={!visible}
      />
      <aside
        data-drawer-open={visible}
        className={`drawer-surface-anim fixed top-0 z-50 flex h-[100dvh] w-full max-w-sm flex-col overflow-y-auto border-stone-200/60 bg-gradient-to-b from-white via-stone-50/80 to-stone-100/40 shadow-[0_0_0_1px_rgba(0,0,0,0.04),-12px_0_40px_-8px_rgba(0,0,0,0.15)] will-change-transform dark:from-stone-900 dark:via-stone-900 dark:to-stone-950/90 dark:shadow-stone-950/40 sm:hidden ${
          isRTL ? "left-0 border-r" : "right-0 border-l"
        } ${visible ? "translate-x-0" : isRTL ? "-translate-x-full" : "translate-x-full"} ${
          visible ? "pointer-events-auto" : "pointer-events-none"
        } ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        aria-hidden={!visible}
      >
        <div className="drawer-hdr-anim">
          <div className="h-1 w-full bg-gradient-to-r from-red-900 via-amber-700 to-red-800" aria-hidden />
          <header
            className="sticky top-0 z-10 border-b border-stone-200/80 bg-white/80 px-3 py-3 backdrop-blur-md dark:border-stone-700/80 dark:bg-stone-900/85"
          >
            <div className="flex items-center justify-between gap-2">
              <Link
                to="/"
                onClick={closeDrawer}
                className="min-w-0 flex-1 overflow-hidden rounded-xl outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-red-800/50"
              >
                <Logo />
              </Link>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200/80 text-stone-500 transition duration-200 hover:rotate-90 hover:bg-stone-100 hover:text-stone-800 active:scale-95 dark:border-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-100"
                aria-label={t("nav.back")}
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          </header>
        </div>
        <nav
          className="drawer-stagger-children flex flex-1 flex-col gap-1.5 px-3 pb-2 pt-4"
          aria-label="Mobile"
        >
          <NavLink
            to="/"
            end
            onClick={closeDrawer}
            className={({ isActive }) => mobileNavClass(isActive)}
          >
            {({ isActive }) => (
              <>
                <span className={mobileIconClass(isActive)}>
                  <FaHome className="h-4 w-4" aria-hidden />
                </span>
                {t("nav.home")}
              </>
            )}
          </NavLink>
          <NavLink
            to="/collection"
            onClick={closeDrawer}
            className={({ isActive }) => mobileNavClass(isActive)}
          >
            {({ isActive }) => (
              <>
                <span className={mobileIconClass(isActive)}>
                  <FaStore className="h-4 w-4" aria-hidden />
                </span>
                {t("nav.collectionMenu")}
              </>
            )}
          </NavLink>
          <NavLink
            to="/about"
            onClick={closeDrawer}
            className={({ isActive }) => mobileNavClass(isActive)}
          >
            {({ isActive }) => (
              <>
                <span className={mobileIconClass(isActive)}>
                  <FaInfoCircle className="h-4 w-4" aria-hidden />
                </span>
                {t("nav.about")}
              </>
            )}
          </NavLink>
          <NavLink
            to="/contact"
            onClick={closeDrawer}
            className={({ isActive }) => mobileNavClass(isActive)}
          >
            {({ isActive }) => (
              <>
                <span className={mobileIconClass(isActive)}>
                  <FaEnvelope className="h-4 w-4" aria-hidden />
                </span>
                {t("nav.contact")}
              </>
            )}
          </NavLink>
          {ready && isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeDrawer}
              className={({ isActive }) => mobileNavClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span className={mobileIconClass(isActive)}>
                    <FaUserShield className="h-4 w-4" aria-hidden />
                  </span>
                  {t("nav.adminDashboard")}
                </>
              )}
            </NavLink>
          )}
          {ready && !isAdmin && (
            <NavLink
              to="/login"
              onClick={closeDrawer}
              className={({ isActive }) => mobileNavClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span className={mobileIconClass(isActive)}>
                    <FaKey className="h-4 w-4" aria-hidden />
                  </span>
                  {t("nav.adminLogin")}
                </>
              )}
            </NavLink>
          )}
        </nav>
        <div className="drawer-footer-anim px-3 pb-4">
          <div
            className="rounded-2xl border border-stone-200/70 bg-white/60 p-3 shadow-inner shadow-stone-200/20 dark:border-stone-600/50 dark:bg-stone-800/40 dark:shadow-stone-950/40"
          >
            <div
              className={`flex items-center justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-xl border border-stone-200/90 bg-stone-50/80 p-0.5 text-xs font-medium dark:border-stone-600/50 dark:bg-stone-800/50">
                <button
                  type="button"
                  onClick={() => setLanguage("ar")}
                  className={`min-h-[2.75rem] flex-1 rounded-[10px] px-2 transition-all duration-200 ${
                    language === "ar"
                      ? "bg-gradient-to-b from-red-800 to-red-900 text-white shadow-sm"
                      : "text-stone-600 hover:bg-red-100/50 hover:text-red-900 dark:text-stone-300 dark:hover:bg-red-900/20"
                  }`}
                  aria-pressed={language === "ar"}
                >
                  عربي
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`min-h-[2.75rem] flex-1 rounded-[10px] px-2 transition-all duration-200 ${
                    language === "en"
                      ? "bg-gradient-to-b from-red-800 to-red-900 text-white shadow-sm"
                      : "text-stone-600 hover:bg-red-100/50 hover:text-red-900 dark:text-stone-300 dark:hover:bg-red-900/20"
                  }`}
                  aria-pressed={language === "en"}
                >
                  EN
                </button>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-stone-200/90 bg-stone-50/90 text-amber-700 shadow-sm transition hover:scale-105 hover:bg-amber-50/90 hover:shadow dark:border-stone-600/50 dark:bg-stone-800/90 dark:text-amber-200 dark:hover:bg-stone-700"
                aria-pressed={isDark}
                aria-label={isDark ? t("theme.toLight") : t("theme.toDark")}
              >
                {isDark ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
export default Navbar;
