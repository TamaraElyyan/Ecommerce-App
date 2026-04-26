import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import {
  FaArrowLeft,
  FaBars,
  FaShoppingCart,
  FaUser,
  FaShoppingBag,
  FaSignOutAlt,
  FaUserShield,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useContext, useState } from "react";
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

  const endAdminSession = () => {
    void logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium gap-3">
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 transition-all duration-300 ease-out hover:scale-105 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800/40 dark:hover:bg-stone-800 sm:hidden"
          aria-label="Menu"
        >
          <FaBars className="h-5 w-5" />
        </button>
      </div>
      {/* Side Menu for small Screens */}
      <div
        className={`absolute top-0 ${
          isRTL ? "left-0" : "right-0"
        } bottom-0 z-50 overflow-hidden bg-white shadow-2xl transition-all duration-300 ease-out dark:bg-stone-900 dark:shadow-stone-950/50 ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-stone-600 dark:text-stone-300">
          <div
            onClick={() => setVisible(false)}
            className=" flex items-center gap-4 cursor-pointer p-3"
          >
            <FaArrowLeft className={`h-4 ${isRTL ? "rotate-180" : ""}`} />
            <p>{t("nav.back")}</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="border py-2 ps-6 transition-all duration-200 hover:bg-red-50/60 hover:pl-7 hover:text-red-900 active:bg-red-100/40"
            to="/"
          >
            {t("nav.home")}
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="border py-2 ps-6 transition-all duration-200 hover:bg-red-50/60 hover:pl-7 hover:text-red-900 active:bg-red-100/40"
            to="/collection"
          >
            {t("nav.collectionMenu")}
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="border py-2 ps-6 transition-all duration-200 hover:bg-red-50/60 hover:pl-7 hover:text-red-900 active:bg-red-100/40"
            to="/about"
          >
            {t("nav.about")}
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="border py-2 ps-6 transition-all duration-200 hover:bg-red-50/60 hover:pl-7 hover:text-red-900 active:bg-red-100/40"
            to="/contact"
          >
            {t("nav.contact")}
          </NavLink>
          {ready && isAdmin && (
            <NavLink
              onClick={() => setVisible(false)}
              className="border py-2 ps-6 transition-all duration-200 hover:bg-red-50/60 hover:pl-7 hover:text-red-900 active:bg-red-100/40"
              to="/admin"
            >
              {t("nav.adminDashboard")}
            </NavLink>
          )}
          {ready && !isAdmin && (
            <NavLink
              onClick={() => setVisible(false)}
              className="border py-2 ps-6 transition-all duration-200 hover:bg-red-50/60 hover:pl-7 hover:text-red-900 active:bg-red-100/40"
              to="/login"
            >
              {t("nav.adminLogin")}
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
