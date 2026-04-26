import Title from "../components/Title";
import AboutUs from "../assets/PNG/AboutUS.jpg";
import NewsLatterBox from "../components/NewsLetterBox";
import { useLanguage } from "../context/LanguageContext";
import { FaAward, FaRegClock, FaHandHoldingHeart } from "react-icons/fa";

const About = () => {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  const pillars = [
    { titleKey: "about.qa", subKey: "about.qaSub", Icon: FaAward },
    { titleKey: "about.conv", subKey: "about.convSub", Icon: FaRegClock },
    { titleKey: "about.exc", subKey: "about.excSub", Icon: FaHandHoldingHeart },
  ];

  const whyCardClass =
    "group flex h-full min-h-0 flex-col items-center justify-center rounded-2xl border border-red-900/50 bg-red-800 px-5 py-8 text-center text-white shadow-md shadow-red-900/20 transition-all duration-300 hover:-translate-y-1 hover:brightness-105 hover:shadow-lg hover:shadow-red-900/30 sm:px-6 sm:py-9";
  const whyIconWrap =
    "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white transition-transform duration-300 group-hover:scale-105";

  return (
    <div className="pb-16">
      {/* Header */}
      <header className="border-t border-gray-200 pt-10 pb-8 text-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-2xl sm:text-3xl">
          <Title text1={t("about.page1")} text2={t("about.page2")} />
        </div>
      </header>

      {/* Story + image */}
      <section
        className={`mx-auto flex max-w-6xl flex-col gap-10 py-4 md:gap-14 md:py-8 lg:flex-row lg:items-stretch ${
          language === "ar" ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div className="flex w-full flex-shrink-0 items-center justify-center lg:max-w-sm lg:flex-1">
          <div
            className="relative aspect-[3/4] w-[min(100%,19rem)] max-w-full overflow-hidden rounded-[50%] border-[10px] border-white bg-white shadow-lg ring-1 ring-gray-200/90 sm:w-[20rem] md:w-[22rem] md:border-[12px]"
          >
            <img
              className="h-full w-full object-cover object-center"
              src={AboutUs}
              alt=""
            />
          </div>
        </div>
        <div
          className="flex flex-1 flex-col justify-center gap-5 text-base leading-relaxed text-gray-600 md:gap-6 md:text-[1.02rem] lg:max-w-xl"
          dir={dir}
        >
          <p className="text-gray-700">{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
          <div className="rounded-xl border-s-4 border-s-red-800 bg-gray-50/90 px-5 py-4">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-red-800">
              {t("about.mission")}
            </p>
            <p className="text-gray-700">{t("about.p3")}</p>
          </div>
          <p>{t("about.p4")}</p>
        </div>
      </section>

      {/* Why us — same red card style as OurPolicy (home) */}
      <section className="mt-6 w-full py-4 md:mt-8 md:py-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 text-center text-2xl sm:text-3xl md:mb-10">
            <div className="inline-block">
              <Title text1={t("about.why1")} text2={t("about.why2")} />
            </div>
          </div>
          <div
            className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-3.5 md:gap-4 lg:gap-5"
            dir={dir}
          >
            {pillars.map(({ titleKey, subKey, Icon }, i) => (
              <div key={i} className={whyCardClass}>
                <div className={whyIconWrap}>
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-white sm:text-lg">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/90 sm:text-base">
                  {t(subKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <div className="mx-auto mt-12 max-w-3xl border-t border-gray-200 pt-12 md:mt-16 md:pt-16">
        <NewsLatterBox />
      </div>
    </div>
  );
};

export default About;
