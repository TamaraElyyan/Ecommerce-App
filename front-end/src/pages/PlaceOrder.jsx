import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import VISA from "../assets/PNG/Visa_Logo.png";
import MASTERCARD from "../assets/PNG/MasterCard_Logo.svg.webp";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { apiUrl, ORDERS_SESSION_KEY } from "../config";
import { toast } from "react-toastify";

const fieldClass =
  "w-full rounded-xl border-2 border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-red-800 focus:ring-2 focus:ring-red-800/20 dark:border-stone-600 dark:bg-stone-800/90 dark:text-stone-100 dark:placeholder:text-stone-500";

const PayOption = ({ active, onClick, children, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    aria-label={label}
    className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-start transition ${
      active
        ? "border-red-800 bg-red-50/50 shadow-sm ring-1 ring-red-800/20 dark:bg-red-950/40"
        : "border-stone-200/90 bg-white hover:border-stone-300 hover:bg-stone-50/80 dark:border-stone-600 dark:bg-stone-800/60 dark:hover:bg-stone-800"
    }`}
  >
    <span
      className={`grid h-4 w-4 shrink-0 place-content-center rounded-full border-2 ${
        active
          ? "border-red-800 bg-red-800"
          : "border-stone-300 bg-white dark:border-stone-500 dark:bg-stone-700"
      }`}
    >
      {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
    </span>
    {children}
  </button>
);

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });
  const {
    navigate,
    cartItems,
    findProductById,
    getCartAmount,
    delivery_fee,
    getCartCount,
    clearCart,
  } = useContext(ShopContext);
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  const sub = getCartAmount();
  const hasItems = getCartCount() > 0 && sub > 0;
  const total = hasItems ? sub + delivery_fee : 0;

  const onField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const onSubmit = async () => {
    if (!hasItems) {
      toast.error(t("placeOrder.emptyCart"));
      return;
    }
    if (!form.firstName.trim() || !form.email.trim()) {
      toast.error(t("placeOrder.fillRequired"));
      return;
    }
    setSubmitting(true);
    const items = [];
    for (const productId of Object.keys(cartItems)) {
      const p = findProductById(productId);
      if (!p) continue;
      for (const [format, qty] of Object.entries(cartItems[productId] || {})) {
        if (!Number.isFinite(qty) || qty <= 0) continue;
        const q = Math.floor(qty);
        const lineTotal = p.price * q;
        items.push({
          productId,
          name: p.name,
          image: p.image?.[0] || "",
          format,
          qty: q,
          unitPrice: p.price,
          lineTotal,
        });
      }
    }
    if (items.length === 0) {
      toast.error(t("placeOrder.emptyCart"));
      setSubmitting(false);
      return;
    }
    const body = {
      customer: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip: form.zip.trim(),
        country: form.country.trim(),
      },
      paymentMethod: method,
      items,
      subtotal: sub,
      shipping: hasItems ? delivery_fee : 0,
      total,
    };
    try {
      const r = await fetch(apiUrl("/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data.error || "order failed");
      }
      if (data.order) {
        try {
          const prev = JSON.parse(sessionStorage.getItem(ORDERS_SESSION_KEY) || "[]");
          const list = Array.isArray(prev) ? prev : [];
          list.unshift(data.order);
          sessionStorage.setItem(ORDERS_SESSION_KEY, JSON.stringify(list.slice(0, 30)));
        } catch {
          /* ignore */
        }
        clearCart();
        toast.success(t("placeOrder.success"));
        navigate("/orders", { state: { fromCheckout: true, order: data.order } });
      } else {
        throw new Error("no order");
      }
    } catch {
      toast.error(t("placeOrder.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-[70vh] border-t border-stone-200/90 bg-gradient-to-b from-stone-50/40 via-white to-stone-50/20 pb-16 pt-8 dark:from-stone-950/80 dark:via-stone-950 dark:to-stone-900/90 dark:border-stone-800 sm:min-h-[75vh] sm:pb-20 sm:pt-10"
      dir={dir}
    >
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 sm:mb-10">
          <div className="text-2xl sm:text-3xl">
            <Title text1={t("placeOrder.t1")} text2={t("placeOrder.t2")} />
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-10">
          <section className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:border-stone-600/80 dark:bg-stone-900/90 sm:p-6">
            <h2 className="sr-only">{`${t("placeOrder.t1")} ${t("placeOrder.t2")}`}</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  className={fieldClass}
                  type="text"
                  value={form.firstName}
                  onChange={onField("firstName")}
                  placeholder={t("placeOrder.first")}
                  required
                />
                <input
                  className={fieldClass}
                  type="text"
                  value={form.lastName}
                  onChange={onField("lastName")}
                  placeholder={t("placeOrder.last")}
                />
              </div>
              <input
                className={fieldClass}
                type="email"
                value={form.email}
                onChange={onField("email")}
                placeholder={t("placeOrder.email")}
                autoComplete="email"
                required
              />
              <input
                className={fieldClass}
                type="text"
                value={form.street}
                onChange={onField("street")}
                placeholder={t("placeOrder.street")}
                autoComplete="street-address"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  className={fieldClass}
                  type="text"
                  value={form.city}
                  onChange={onField("city")}
                  placeholder={t("placeOrder.city")}
                />
                <input
                  className={fieldClass}
                  type="text"
                  value={form.state}
                  onChange={onField("state")}
                  placeholder={t("placeOrder.state")}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  className={fieldClass}
                  type="text"
                  value={form.zip}
                  onChange={onField("zip")}
                  inputMode="numeric"
                  placeholder={t("placeOrder.zip")}
                  autoComplete="postal-code"
                />
                <input
                  className={fieldClass}
                  type="text"
                  value={form.country}
                  onChange={onField("country")}
                  placeholder={t("placeOrder.country")}
                  autoComplete="country-name"
                />
              </div>
              <input
                className={fieldClass}
                type="tel"
                value={form.phone}
                onChange={onField("phone")}
                placeholder={t("placeOrder.phone")}
                autoComplete="tel"
              />
            </div>
          </section>

          <aside className="flex flex-col gap-5 self-start lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-stone-600/80 dark:bg-stone-900/90">
              <div className="border-b border-stone-100 bg-gradient-to-b from-stone-50/80 to-white px-5 py-4 dark:from-stone-800/50 dark:to-stone-900 sm:px-6 sm:py-5">
                <CartTotal compact />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm dark:border-stone-600/80 dark:bg-stone-900/90 sm:p-6">
              <div className="text-base sm:text-lg">
                <Title text1={t("placeOrder.pay1")} text2={t("placeOrder.pay2")} />
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                <PayOption
                  active={method === "VISA"}
                  onClick={() => setMethod("VISA")}
                  label="VISA"
                >
                  <img className="h-6 w-auto object-contain" src={VISA} alt="" />
                </PayOption>
                <PayOption
                  active={method === "MasterCard"}
                  onClick={() => setMethod("MasterCard")}
                  label="MasterCard"
                >
                  <img
                    className="h-6 w-auto max-w-[120px] object-contain"
                    src={MASTERCARD}
                    alt=""
                  />
                </PayOption>
                <PayOption active={method === "cod"} onClick={() => setMethod("cod")} label={t("placeOrder.cod")}>
                  <span className="text-sm font-medium text-stone-800">{t("placeOrder.cod")}</span>
                </PayOption>
              </div>
            </div>

            <div className="w-full">
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="w-full rounded-xl bg-red-800 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-900 hover:shadow-lg active:scale-[0.99] disabled:opacity-60 sm:py-3"
              >
                {submitting ? t("placeOrder.sending") : t("placeOrder.cta")}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
