import { useContext } from "react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import Title from "./Title";

const CartTotal = ({ compact = false }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const { t } = useLanguage();
  const sub = getCartAmount();
  const hasItems = sub > 0;
  const total = hasItems ? sub + delivery_fee : 0;

  return (
    <div className="w-full">
      <div className={compact ? "text-base sm:text-lg" : "text-lg sm:text-xl"}>
        <Title text1={t("cartTotal.title1")} text2={t("cartTotal.title2")} />
      </div>
      <div
        className={`flex flex-col text-sm ${
          compact ? "mt-3 gap-2.5" : "mt-5 gap-4 sm:mt-6"
        }`}
      >
        <div className="flex justify-between gap-4 text-stone-600 dark:text-stone-400">
          <span>{t("cartTotal.subtotal")}</span>
          <span className="font-medium tabular-nums text-stone-900 dark:text-stone-100">
            {currency} {sub.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-stone-600 dark:text-stone-400">
          <span>{t("cartTotal.shipping")}</span>
          <span className="font-medium tabular-nums text-stone-900 dark:text-stone-100">
            {hasItems ? `${currency} ${delivery_fee.toFixed(2)}` : `${currency} 0.00`}
          </span>
        </div>
        <div
          className={`flex justify-between border-t border-stone-200/90 text-stone-900 dark:border-stone-600/80 ${
            compact
              ? "mt-1.5 pt-3 text-base sm:text-base"
              : "mt-2 pt-4 text-base sm:pt-5 sm:text-lg"
          }`}
        >
          <b className="text-stone-800 dark:text-stone-100">{t("cartTotal.total")}</b>
          <b className="tabular-nums text-red-900 dark:text-red-500">
            {currency} {total.toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

CartTotal.propTypes = {
  compact: PropTypes.bool,
};

export default CartTotal;
