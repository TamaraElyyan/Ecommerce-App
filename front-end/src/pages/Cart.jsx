import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import Title from "../components/Title";
import { FaShoppingBag, FaTrashAlt } from "react-icons/fa";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    changeFormat,
    findProductById,
    navigate,
    currency,
  } = useContext(ShopContext);
  const { t, isRTL } = useLanguage();

  const labelForFormat = (code) => {
    if (code === "Paperback") return t("format.paperback");
    if (code === "Hardcover") return t("format.hardcover");
    return code;
  };
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const hasItems = cartData.length > 0;

  return (
    <div className="border-t border-stone-200/90 bg-gradient-to-b from-stone-50/40 via-white to-stone-50/20 pb-16 pt-8 dark:from-stone-950/80 dark:via-stone-950 dark:to-stone-900/90 dark:border-stone-800 sm:pb-20 sm:pt-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 sm:mb-10">
          <div className="text-2xl sm:text-3xl">
            <Title text1={t("cart.title1")} text2={t("cart.title2")} />
          </div>
        </header>

        {!hasItems ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300/80 bg-white/60 px-6 py-20 text-center shadow-[0_2px_24px_rgba(0,0,0,0.04)] dark:border-stone-600/80 dark:bg-stone-900/50 sm:py-24">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300">
              <FaShoppingBag className="h-7 w-7" aria-hidden />
            </div>
            <p className="text-base font-medium text-stone-800 dark:text-stone-200 sm:text-lg">
              {t("cart.empty")}
            </p>
            <Link
              to="/collection"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-red-800 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-900 hover:shadow-lg"
            >
              {t("cart.browse")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-10 xl:gap-12">
            <div className="flex flex-col gap-4 sm:gap-5">
              {cartData.map((item) => {
                const productData = findProductById(item._id);
                if (!productData || !productData.image?.[0]) return null;
                const lineId = `${String(item._id)}-${String(item.size).replace(/\s+/g, "-")}`;
                const maxQty = Math.max(20, item.quantity, 1);
                const qtyOptions = Array.from({ length: maxQty }, (_, i) => i + 1);
                const lineTotal = (productData.price * item.quantity).toFixed(2);
                return (
                  <div
                    key={lineId}
                    className="group flex flex-col gap-4 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm transition duration-200 hover:border-red-200/60 hover:shadow-md dark:border-stone-600/80 dark:bg-stone-900/90 sm:p-5"
                  >
                    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
                      <div
                        className={`flex gap-4 sm:gap-5 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-100 shadow-inner sm:h-28 sm:w-24">
                          <img
                            className="h-full w-full object-cover object-center"
                            src={productData.image[0]}
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-base font-semibold leading-snug text-stone-900 sm:text-lg">
                            {productData.name}
                          </h2>
                          <div
                            className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <p className="text-sm text-stone-500">
                              {currency}
                              <span className="font-semibold text-red-900 tabular-nums">
                                {productData.price}
                              </span>
                              <span className="text-stone-400"> · </span>
                              <span className="text-stone-600">
                                {t("cart.qty")} {item.quantity}
                              </span>
                            </p>
                            {productData.sizes?.length > 0 ? (
                              <label
                                className="inline-flex min-w-0 items-center gap-1.5"
                                htmlFor={`format-${lineId}`}
                              >
                                <span className="sr-only">{t("product.format")}</span>
                                <select
                                  id={`format-${lineId}`}
                                  value={item.size}
                                  onChange={(e) =>
                                    changeFormat(item._id, item.size, e.target.value)
                                  }
                                  className="max-w-[10.5rem] cursor-pointer rounded-lg border border-stone-200 bg-stone-50/80 py-1.5 ps-2.5 pe-7 text-xs font-medium text-stone-800 transition focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20 sm:max-w-xs sm:text-sm"
                                >
                                  {productData.sizes.map((s) => (
                                    <option key={s} value={s}>
                                      {labelForFormat(s)}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            ) : (
                              <span className="inline-flex rounded-lg border border-stone-200/90 bg-stone-50 px-2 py-0.5 text-xs text-stone-700 sm:text-sm">
                                {labelForFormat(item.size)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`flex flex-wrap items-end justify-between gap-3 border-t border-stone-100 pt-3 sm:border-t-0 sm:pt-0 md:flex-nowrap ${
                          isRTL ? "flex-row-reverse sm:justify-end" : ""
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <label
                            htmlFor={`qty-${lineId}`}
                            className="text-xs font-medium text-stone-500"
                          >
                            {t("cart.qty")}
                          </label>
                          <select
                            id={`qty-${lineId}`}
                            value={item.quantity}
                            onChange={(e) => {
                              const n = Number(e.target.value);
                              updateQuantity(item._id, item.size, n);
                            }}
                            className="w-[4.75rem] cursor-pointer rounded-lg border border-stone-200 bg-white py-1.5 ps-2.5 pe-6 text-sm font-medium text-stone-900 shadow-sm focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20"
                            dir="ltr"
                          >
                            {qtyOptions.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div
                          className={`flex w-full items-center justify-between gap-3 sm:w-auto ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <p className="text-sm text-stone-500">
                            {t("cartTotal.subtotal")}{" "}
                            <span className="font-semibold text-stone-900 tabular-nums">
                              {currency}
                              {lineTotal}
                            </span>
                          </p>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.size, 0)}
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200/90 bg-white text-stone-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-800"
                            title={t("cart.remove")}
                            aria-label={t("cart.remove")}
                          >
                            <FaTrashAlt className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="self-start lg:sticky lg:top-24">
              <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <div className="border-b border-stone-100 bg-gradient-to-b from-stone-50/80 to-white px-5 py-4 sm:px-6 sm:py-5">
                  <CartTotal compact />
                </div>
                <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-5 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/place-order")}
                    className="w-full rounded-xl bg-red-800 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-900 hover:shadow-lg active:scale-[0.99]"
                  >
                    {t("cart.checkout")}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
