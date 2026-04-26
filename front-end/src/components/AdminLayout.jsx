import { NavLink, Outlet } from "react-router-dom";
import { FaBook, FaShoppingBag } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-red-100/80 text-red-900 shadow-sm ring-1 ring-red-200/60 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-800/40"
      : "bg-rose-50/60 text-stone-700 hover:bg-rose-100/80 hover:text-red-900 dark:bg-stone-800/50 dark:text-stone-200 dark:hover:bg-stone-700/50 dark:hover:text-red-300"
  }`;

const AdminLayout = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6 mt-6 border-b border-stone-200/80 pb-5 dark:border-stone-600/80">
        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/admin" end className={linkClass}>
            {({ isActive }) => (
              <>
                <FaBook
                  className={`h-4 w-4 shrink-0 ${isActive ? "text-red-800" : "text-stone-500"}`}
                  aria-hidden
                />
                {t("admin.navCatalog")}
              </>
            )}
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            {({ isActive }) => (
              <>
                <FaShoppingBag
                  className={`h-4 w-4 shrink-0 ${isActive ? "text-red-800" : "text-stone-500"}`}
                  aria-hidden
                />
                {t("admin.navOrders")}
              </>
            )}
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
