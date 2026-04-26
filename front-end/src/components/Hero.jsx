import HeroImg from "../assets/PNG/HeroIMG.jpg";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { t, isRTL } = useLanguage();
  return (
    <div
      className={`group/hero flex flex-col overflow-hidden border border-stone-400 shadow-sm transition-shadow duration-500 hover:shadow-md dark:border-stone-600 ${
        isRTL ? "sm:flex-row-reverse" : ""
      } sm:flex-row`}
    >
      <div className="flex w-full items-center justify-center bg-stone-50 py-5 dark:bg-stone-900/50 sm:w-1/2 sm:py-0">
        <div className="animate-fadeInUp px-4 text-stone-700 dark:text-stone-200 sm:px-0">
          <div
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <p className="h-[2px] w-8 origin-left scale-x-100 bg-stone-600 transition-transform duration-500 group-hover/hero:scale-x-110 dark:bg-stone-400 md:w-11" />
            <p className="text-sm font-medium md:text-base">{t("hero.line1")}</p>
          </div>
          <h1 className="prata-regular text-3xl leading-relaxed sm:py-3 lg:text-4xl">
            {t("hero.title")}
          </h1>
          <div
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <p className="text-sm font-semibold md:text-base">{t("hero.line2")}</p>
            <p className="h-px w-8 origin-right scale-x-100 bg-stone-600 transition-transform duration-500 group-hover/hero:scale-x-110 dark:bg-stone-400 md:w-11" />
          </div>
        </div>
      </div>
      <div className="relative w-full sm:w-1/2 h-[300px] sm:h-[400px] overflow-hidden">
        <img
          className="h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover/hero:scale-[1.03]"
          src={HeroImg}
          alt=""
        />
      </div>
    </div>
  );
};

export default Hero;
