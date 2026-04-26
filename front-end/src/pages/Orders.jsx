import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useLanguage } from "../context/LanguageContext";
import { ORDERS_SESSION_KEY } from "../config";

const readStoredOrders = () => {
  try {
    const raw = sessionStorage.getItem(ORDERS_SESSION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Orders = () => {
  const { products, currency } = useContext(ShopContext);
  const { t, language, isRTL } = useLanguage();
  const location = useLocation();
  const [stored, setStored] = useState(() => readStoredOrders());

  useEffect(() => {
    if (location.state?.order) {
      setStored(readStoredOrders());
    }
  }, [location.state]);

  const fromSession = useMemo(() => {
    if (location.state?.order) {
      const o = location.state.order;
      return [o, ...stored.filter((x) => x && x._id !== o._id)];
    }
    return stored;
  }, [location.state, stored]);

  const labelForFormat = (code) => {
    if (code === "Paperback") return t("format.paperback");
    if (code === "Hardcover") return t("format.hardcover");
    return code;
  };

  const formatDate = (ts) => {
    try {
      return new Date(ts).toLocaleString(language === "ar" ? "ar" : "en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "—";
    }
  };

  if (fromSession.length > 0) {
    return (
      <div className="border-t pt-10 sm:pt-16" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="text-2xl">
          <Title text1={t("orders.t1")} text2={t("orders.t2")} />
        </div>
        <p className="mb-6 mt-2 text-sm text-stone-600">{t("orders.hintLocal")}</p>
        <ul className="space-y-6">
          {fromSession.map((o) => (
            <li
              key={o._id}
              className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm"
            >
              <div
                className={`border-b border-stone-100 bg-stone-50/50 px-4 py-3 sm:px-5 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <p className="font-mono text-xs text-stone-500">#{o._id}</p>
                <p className="text-sm font-medium text-stone-800">
                  {o.customer?.firstName} {o.customer?.lastName} · {o.customer?.email}
                </p>
                <p className="text-xs text-stone-500">
                  {formatDate(o.createdAt)} · {t("cartTotal.total")}: {currency}
                  {Number(o.total).toFixed(2)}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                  <p className="text-sm text-stone-700">
                    {t("orders.status")}: {o.status || t("adminOrder.statusPending")}
                  </p>
                </div>
              </div>
              <ul className="divide-y divide-stone-100">
                {(o.items || []).map((line, i) => (
                  <li
                    key={i}
                    className={`flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
                      isRTL ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex items-start gap-4 text-sm ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      {line.image && (
                        <img
                          className="h-20 w-16 shrink-0 rounded object-cover bg-stone-100"
                          src={line.image}
                          alt=""
                        />
                      )}
                      <div>
                        <p className="font-medium text-stone-900">{line.name}</p>
                        <p className="text-stone-600">
                          {t("orders.price")}: {currency}
                          {line.unitPrice} · {t("orders.size")}:{" "}
                          {labelForFormat(line.format)}
                        </p>
                        <p>
                          {t("orders.qty")}: {line.qty}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-medium text-stone-800">
                      {currency}
                      {Number(line.lineTotal).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="border-t pt-16" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="text-2xl">
        <Title text1={t("orders.t1")} text2={t("orders.t2")} />
      </div>
      <p className="mb-6 mt-2 text-sm text-stone-600">{t("orders.emptyHint")}</p>
      <div>
        {products.slice(1, 4).map((item, index) => (
          <div
            key={index}
            className={`flex flex-col gap-4 border-b border-t border-stone-200 py-4 text-stone-700 md:flex-row md:items-center md:justify-between ${
              isRTL ? "md:flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-start gap-6 text-sm ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <img
                className="h-20 w-16 shrink-0 rounded-sm object-cover object-center bg-stone-100 sm:h-24 sm:w-20"
                src={item.image[0]}
                alt={item.name}
              />
              <div>
                <p className="font-medium sm:text-base">{item.name}</p>
                <div className="mt-2 text-base text-stone-700">
                  <p>
                    {t("orders.price")}: {currency}
                    {item.price}
                  </p>
                  <p>
                    {t("orders.size")}: {labelForFormat(item.sizes?.[0] || "Paperback")}
                  </p>
                  <p>
                    {t("orders.qty")}: {item.quantity || 1}
                  </p>
                </div>
                <p className="mt-2 text-stone-500">
                  {t("orders.date")}{" "}
                  <span className="text-stone-400">25, Jul, 2024</span>
                </p>
              </div>
            </div>
            <div
              className={`flex w-full justify-between md:w-1/2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <p className="h-2 min-w-2 rounded-full bg-green-500" />
                <p className="text-sm md:text-base">{t("orders.status")}</p>
              </div>
              <button
                type="button"
                className="rounded-sm border px-4 py-2 text-sm font-medium"
              >
                {t("orders.track")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
