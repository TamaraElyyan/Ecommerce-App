import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { FaSlidersH } from "react-icons/fa";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import SearchBar from "../components/SearchBar";

const CATEGORY_OPTIONS = [
  { value: "Fiction", labelKey: "collection.cat.fiction" },
  { value: "Non-Fiction", labelKey: "collection.cat.nonFiction" },
  { value: "Children", labelKey: "collection.cat.children" },
];

const TYPE_OPTIONS = [
  { value: "Novel", labelKey: "collection.type.novel" },
  { value: "Fantasy", labelKey: "collection.type.fantasy" },
  { value: "Science Fiction", labelKey: "collection.type.scifi" },
  { value: "Classic", labelKey: "collection.type.classic" },
  { value: "Self-Help", labelKey: "collection.type.selfhelp" },
  { value: "History", labelKey: "collection.type.history" },
  { value: "Memoir", labelKey: "collection.type.memoir" },
  { value: "Science", labelKey: "collection.type.science" },
  { value: "Middle Grade", labelKey: "collection.type.middleGrade" },
  { value: "Picture Books", labelKey: "collection.type.pictureBooks" },
];

const Collection = () => {
  const { products, search } = useContext(ShopContext);
  const { t, isRTL, language } = useLanguage();
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [Category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    const v = e.target.value;
    if (Category.includes(v)) {
      setCategory((prev) => prev.filter((item) => item !== v));
    } else {
      setCategory((prev) => [...prev, v]);
    }
  };

  const toggleSubCategory = (e) => {
    const v = e.target.value;
    if (subCategory.includes(v)) {
      setSubCategory((prev) => prev.filter((item) => item !== v));
    } else {
      setSubCategory((prev) => [...prev, v]);
    }
  };

  useEffect(() => {
    let list = products.slice();
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((item) => item.name.toLowerCase().includes(q));
    }
    if (Category.length > 0) {
      list = list.filter((item) => Category.includes(item.category));
    }
    if (subCategory.length > 0) {
      list = list.filter((item) => subCategory.includes(item.subCategory));
    }

    const next = list.slice();
    if (sortType === "low-high") {
      next.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      next.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(next);
  }, [Category, subCategory, search, products, sortType]);

  const filterPanelClass = showFilter ? "block" : "hidden sm:block";

  return (
    <div className="border-t border-stone-200/90 pb-16 pt-8 dark:border-stone-700/80 sm:pt-10 md:pb-20">
      <div
        className={`flex flex-col gap-8 lg:gap-10 lg:flex-row lg:items-start ${
          isRTL ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Sidebar filters */}
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:max-w-[17.5rem]">
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-red-200/80 bg-red-50/40 px-4 py-3.5 text-left text-sm font-semibold text-red-950 shadow-sm transition-colors hover:bg-red-50 sm:hidden ${
              isRTL ? "text-right" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <FaSlidersH className="h-4 w-4 text-red-800" aria-hidden />
              {t("collection.filters")}
            </span>
            <span className="text-xs font-normal text-red-800/80">
              {showFilter ? "−" : "+"}
            </span>
          </button>

          <div className={`${filterPanelClass} mt-4 sm:mt-0`}>
            <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-gradient-to-b from-stone-50/90 to-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:border-stone-600/80 dark:from-stone-900/90 dark:to-stone-950">
              <div className="hidden border-b border-stone-200/80 px-4 py-3.5 dark:border-stone-600/80 sm:block">
                <h2 className="text-sm font-semibold tracking-wide text-red-900">
                  {t("collection.filters")}
                </h2>
              </div>

              <div className="divide-y divide-stone-200/80">
                <div className="px-4 py-4 sm:py-5">
                  <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-stone-500">
                    {t("collection.sections")}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {CATEGORY_OPTIONS.map(({ value, labelKey }) => (
                      <label
                        key={value}
                        htmlFor={`cat-${value}`}
                        className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-stone-800 transition-colors hover:bg-red-50/50 dark:text-stone-200 dark:hover:bg-red-950/30"
                      >
                        <input
                          id={`cat-${value}`}
                          type="checkbox"
                          className="h-4 w-4 shrink-0 rounded border-stone-300 text-red-800 accent-red-800 focus:ring-2 focus:ring-red-800/25"
                          value={value}
                          checked={Category.includes(value)}
                          onChange={toggleCategory}
                        />
                        <span>{t(labelKey)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-4 sm:py-5">
                  <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-stone-500">
                    {t("collection.types")}
                  </p>
                  <div className="max-h-[min(55vh,22rem)] overflow-y-auto pr-1 [scrollbar-gutter:stable]">
                    <div className="flex flex-col gap-0.5">
                      {TYPE_OPTIONS.map(({ value, labelKey }) => (
                        <label
                          key={value}
                          htmlFor={`type-${value}`}
                          className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-stone-800 transition-colors hover:bg-red-50/50 dark:text-stone-200 dark:hover:bg-red-950/30"
                        >
                          <input
                            id={`type-${value}`}
                            type="checkbox"
                            className="h-4 w-4 shrink-0 rounded border-stone-300 text-red-800 accent-red-800 focus:ring-2 focus:ring-red-800/25"
                            value={value}
                            checked={subCategory.includes(value)}
                            onChange={toggleSubCategory}
                          />
                          <span>{t(labelKey)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div
          className="min-w-0 flex-1 space-y-6"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <div className="space-y-3">
            <div className="text-2xl sm:text-3xl">
              <Title text1={t("collection.title1")} text2={t("collection.title2")} />
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-stone-600 dark:text-stone-400 sm:text-[0.95rem]">
              {t("collection.sub")}
            </p>
            <SearchBar />
          </div>

          <div
            className={`flex flex-col gap-4 border-b border-stone-200/90 pb-4 sm:flex-row sm:items-center sm:justify-between ${
              isRTL ? "sm:flex-row-reverse" : ""
            }`}
          >
            <p className="text-sm text-stone-600 dark:text-stone-400">
              <span className="font-semibold tabular-nums text-red-900">
                {filterProducts.length}
              </span>{" "}
              {t("collection.books")}
            </p>
            <div className="flex items-center gap-2 sm:shrink-0">
              <label htmlFor="collection-sort" className="sr-only">
                {t("collection.sortLabel")}
              </label>
              <span className="hidden text-sm text-stone-500 sm:inline">
                {t("collection.sortLabel")}
              </span>
              <select
                id="collection-sort"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="w-full cursor-pointer rounded-xl border-2 border-stone-200 bg-white py-2.5 pl-3 pr-10 text-sm font-medium text-stone-900 shadow-sm transition-all duration-200 hover:border-red-300 focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 sm:w-auto sm:min-w-[12.5rem]"
                dir="ltr"
              >
                <option value="relevant">{t("collection.sortRelevant")}</option>
                <option value="low-high">{t("collection.sortLow")}</option>
                <option value="high-low">{t("collection.sortHigh")}</option>
              </select>
            </div>
          </div>

          {filterProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300/90 bg-stone-50/50 px-6 py-16 text-center dark:border-stone-600/80 dark:bg-stone-900/40">
              <p className="mx-auto max-w-md text-sm leading-relaxed text-stone-600 dark:text-stone-400 sm:text-base">
                {t("collection.noResults")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 gap-y-7 md:gap-y-8">
              {filterProducts.map((item, index) => (
                <ProductItem
                  key={item._id ?? index}
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
