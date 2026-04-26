import { useLanguage } from "../context/LanguageContext";

const NewsLetterBox = () => {
  const { t, isRTL, language } = useLanguage();
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center" dir={language === "ar" ? "rtl" : "ltr"}>
      <p className="text-2xl font-medium text-stone-800 dark:text-stone-100">
        {t("newsletter.title")}
      </p>
      <p className="mt-3 text-stone-500 dark:text-stone-400">
        {t("newsletter.sub")}
      </p>
      <form
        onSubmit={onSubmitHandler}
        className={`group mx-auto my-6 flex w-full max-w-lg items-center gap-3 border border-stone-200 ps-3 transition-all duration-200 focus-within:border-stone-500 focus-within:shadow-sm dark:border-stone-600 sm:w-1/2 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <input
          className="w-full bg-transparent text-stone-800 outline-none transition-shadow placeholder:text-stone-400 dark:text-stone-200 dark:placeholder:text-stone-500 sm:flex-1"
          type="email"
          placeholder={t("newsletter.placeholder")}
          required
        />
        <button
          type="submit"
          className="shrink-0 bg-red-800 px-10 py-4 text-xs text-white transition-all duration-200 hover:bg-red-900 active:scale-[0.98]"
        >
          {t("newsletter.cta")}
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
