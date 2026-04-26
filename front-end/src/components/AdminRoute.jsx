import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useLanguage } from "../context/LanguageContext";

const AdminRoute = ({ children }) => {
  const { isAdmin, ready } = useAdmin();
  const location = useLocation();
  const { t } = useLanguage();

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center text-stone-600 text-sm">
        {t("app.loading")}
      </div>
    );
  }
  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

export default AdminRoute;
