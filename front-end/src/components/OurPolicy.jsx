import { FaExchangeAlt, FaUndoAlt, FaHeadset } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const OurPolicy = () => {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const cardClass =
    "group flex h-full min-h-0 flex-1 flex-col items-center justify-center rounded-2xl border border-red-900/50 bg-red-800 px-5 py-8 text-center text-white shadow-md shadow-red-900/20 transition-all duration-300 hover:-translate-y-1 hover:brightness-105 hover:shadow-lg hover:shadow-red-900/30 sm:px-6 sm:py-9";
  const iconWrap =
    "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white transition-transform duration-300 group-hover:scale-105";

  return (
    <div
      className="grid w-full grid-cols-1 gap-6 py-16 text-xs sm:grid-cols-3 sm:gap-3.5 md:gap-4 lg:gap-5 sm:text-sm md:py-20 md:text-base"
    >
      <div className={cardClass} dir={dir}>
        <div className={iconWrap}>
          <FaExchangeAlt className="h-6 w-6" aria-hidden />
        </div>
        <p className="font-semibold text-white">{t("policy.exchange")}</p>
        <p className="mt-2 max-w-xs text-white/90 leading-relaxed">{t("policy.exchangeSub")}</p>
      </div>

      <div className={cardClass} dir={dir}>
        <div className={iconWrap}>
          <FaUndoAlt className="h-6 w-6" aria-hidden />
        </div>
        <p className="font-semibold text-white">{t("policy.return")}</p>
        <p className="mt-2 max-w-xs text-white/90 leading-relaxed">{t("policy.returnSub")}</p>
      </div>

      <div className={cardClass} dir={dir}>
        <div className={iconWrap}>
          <FaHeadset className="h-6 w-6" aria-hidden />
        </div>
        <p className="font-semibold text-white">{t("policy.support")}</p>
        <p className="mt-2 max-w-xs text-white/90 leading-relaxed">{t("policy.supportSub")}</p>
      </div>
    </div>
  );
};

export default OurPolicy;
