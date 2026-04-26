import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useLanguage } from "../context/LanguageContext";
import Title from "../components/Title";
import { toast } from "react-toastify";

const statusOptions = (t) => [
  { value: "pending", label: t("adminOrder.statusPending") },
  { value: "processing", label: t("adminOrder.statusProcessing") },
  { value: "shipped", label: t("adminOrder.statusShipped") },
  { value: "cancelled", label: t("adminOrder.statusCancelled") },
];

const AdminOrders = () => {
  const { t, isRTL, language } = useLanguage();
  const { authFetch, logout } = useAdmin();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await authFetch("/admin/orders");
      if (!r.ok) {
        if (r.status === 401) {
          await logout();
          navigate("/login", { replace: true });
        }
        throw new Error("load");
      }
      const data = await r.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error(t("adminOrder.loadError"));
    } finally {
      setLoading(false);
    }
  }, [authFetch, logout, navigate, t]);

  useEffect(() => {
    load();
  }, [load]);

  const onStatus = async (orderId, status) => {
    try {
      const r = await authFetch(`/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error("patch");
      const updated = await r.json();
      setOrders((list) => list.map((o) => (o._id === orderId ? updated : o)));
      toast.success(t("adminOrder.statusSaved"));
    } catch {
      toast.error(t("adminOrder.statusError"));
    }
  };

  const formatDate = (ts) => {
    try {
      return new Date(ts).toLocaleString(
        language === "ar" ? "ar" : "en-GB",
        { dateStyle: "medium", timeStyle: "short" }
      );
    } catch {
      return "—";
    }
  };

  return (
    <div className="pb-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-8">
        <Title text1={t("adminOrder.t1")} text2={t("adminOrder.t2")} />
        <p className="mt-2 max-w-2xl text-sm text-stone-600">{t("adminOrder.hint")}</p>
      </div>

      {loading ? (
        <p className="text-sm text-stone-500">{t("app.loading")}</p>
      ) : orders.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-200 bg-stone-50/50 px-4 py-8 text-center text-stone-600">
          {t("adminOrder.empty")}
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li
              key={o._id}
              className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm dark:border-stone-600/80 dark:bg-stone-900/90"
            >
              <div
                className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
                  isRTL ? "sm:flex-row-reverse" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="font-mono text-xs text-stone-500">#{o._id}</p>
                  <p className="text-base font-semibold text-red-900">
                    {o.customer?.firstName} {o.customer?.lastName}
                  </p>
                  <p className="text-sm text-stone-600">{o.customer?.email}</p>
                  {o.customer?.phone && (
                    <p className="text-sm text-stone-600">{o.customer.phone}</p>
                  )}
                  <p className="mt-1 text-xs text-stone-500">
                    {formatDate(o.createdAt)} · {t("adminOrder.payment")}: {o.paymentMethod}
                  </p>
                </div>
                <div
                  className={`flex flex-wrap items-end gap-3 ${
                    isRTL ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  <p className="text-lg font-semibold tabular-nums text-stone-900">
                    ${Number(o.total).toFixed(2)}
                  </p>
                  <label className="flex flex-col gap-0.5 text-xs text-stone-600">
                    {t("adminOrder.statusLabel")}
                    <select
                      value={o.status || "pending"}
                      onChange={(e) => onStatus(o._id, e.target.value)}
                      className="min-w-[10rem] rounded-lg border border-stone-300 bg-rose-50/40 px-2 py-1.5 text-sm font-medium text-red-900 outline-none focus:ring-2 focus:ring-red-800/30"
                    >
                      {statusOptions(t).map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="border-t border-stone-100 bg-stone-50/30 px-4 py-2 dark:border-stone-700/80 dark:bg-stone-800/40">
                <button
                  type="button"
                  onClick={() => setOpenId((id) => (id === o._id ? null : o._id))}
                  className="text-sm font-medium text-red-800 hover:underline"
                >
                  {openId === o._id ? t("adminOrder.hideItems") : t("adminOrder.showItems")}
                </button>
              </div>
              {openId === o._id && o.items && (
                <ul className="space-y-2 border-t border-stone-100 px-4 py-3 dark:border-stone-700/80">
                  {o.items.map((line, i) => (
                    <li
                      key={`${o._id}-${i}`}
                      className={`flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between ${
                        isRTL ? "sm:flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex min-w-0 items-start gap-3 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        {line.image && (
                          <img
                            src={line.image}
                            alt=""
                            className="h-14 w-11 shrink-0 rounded object-cover bg-stone-100"
                          />
                        )}
                        <div>
                          <p className="font-medium text-stone-900">{line.name}</p>
                          <p className="text-stone-600">
                            {t("orders.size")}: {line.format} · {t("orders.qty")}:{" "}
                            {line.qty}
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 font-medium tabular-nums text-stone-800">
                        ${Number(line.lineTotal).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              {openId === o._id && o.customer && (
                <div
                  className={`border-t border-stone-100 px-4 py-3 text-sm text-stone-700 dark:border-stone-700/80 dark:text-stone-300 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <p className="mb-1 font-medium text-stone-800">
                    {t("adminOrder.address")}
                  </p>
                  <p>
                    {[o.customer.street, o.customer.city, o.customer.state, o.customer.zip, o.customer.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminOrders;
