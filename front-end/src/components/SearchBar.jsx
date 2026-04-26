import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const { search, setSearch } = useContext(ShopContext);
  const { t, language } = useLanguage();

  return (
    <div className="w-full" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="group flex w-full max-w-2xl items-center rounded-full border border-stone-200 bg-white px-4 py-3 transition-all duration-200 focus-within:border-red-800/50 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-red-800/20 dark:border-stone-600 dark:bg-stone-900/80">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400 dark:text-stone-100 dark:placeholder:text-stone-500"
          type="search"
          placeholder={t("search.placeholder")}
          autoComplete="off"
        />
        <FaSearch
          className="ms-2 w-4 shrink-0 text-red-800/80 transition-transform duration-200 group-focus-within:scale-110"
          aria-hidden
        />
      </div>
    </div>
  );
};

export default SearchBar;
