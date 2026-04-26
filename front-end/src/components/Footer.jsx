import Logo from "./Logo";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t, language } = useLanguage();
  const y = new Date().getFullYear();
  return (
    <div className="w-full" dir={language === "ar" ? "rtl" : "ltr"}>
      <div
        className={
          "mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center text-sm " +
          "mb-10 mt-24 sm:mb-10 sm:mt-40 sm:grid sm:grid-cols-[3fr_1fr_1fr] sm:items-start sm:gap-14 sm:text-start"
        }
      >
        <div className="flex w-full max-w-md flex-col items-center sm:max-w-none sm:items-start">
          <Logo className="w-32" />
          <p
            className="mt-5 w-full max-w-prose text-stone-600 leading-relaxed dark:text-stone-400 sm:max-w-none"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            {t("footer.blurb")}
          </p>
        </div>
        <div className="flex w-full flex-col items-center sm:items-start">
          <p className="mb-5 text-xl font-medium text-stone-800 dark:text-stone-100">
            {t("footer.company")}
          </p>
          <ul className="flex flex-col items-center gap-1 text-stone-600 dark:text-stone-400 sm:items-start">
            <li>
              <Link
                to="/"
                className="inline-block rounded-sm outline-none transition-colors duration-200 hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-stone-400 dark:hover:text-stone-100"
              >
                {t("footer.fHome")}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="inline-block rounded-sm outline-none transition-colors duration-200 hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-stone-400 dark:hover:text-stone-100"
              >
                {t("footer.fAbout")}
              </Link>
            </li>
            <li>{t("footer.fDelivery")}</li>
            <li>{t("footer.fPrivacy")}</li>
          </ul>
        </div>
        <div className="flex w-full flex-col items-center sm:items-start">
          <p className="mb-5 text-xl font-medium text-stone-800 dark:text-stone-100">
            {t("footer.getInTouch")}
          </p>
          <ul className="flex flex-col items-center gap-1 text-stone-600 dark:text-stone-400 sm:items-start">
            <li>+972-56-456-7890</li>
            <li>contact@BookBazzar.com</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl">
        <hr className="border-stone-200 dark:border-stone-700" />
        <p
          className="px-2 py-5 text-center text-sm text-stone-600 dark:text-stone-400"
          dir="ltr"
        >
          © {y} {t("footer.copyright")}
        </p>
      </div>
    </div>
  );
};

export default Footer;
