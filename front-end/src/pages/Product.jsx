import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { FaCheckCircle, FaStar, FaTimes } from "react-icons/fa";
import RelatedProducts from "../components/RelatedProducts";

const getDescription = (product, language) => {
  if (!product) return "";
  if (language === "en" && product.descriptionEn) return product.descriptionEn;
  return product.description || product.descriptionEn || "";
};

const Product = () => {
  const { productId } = useParams();
  const { products, productsLoading, currency, addToCart } = useContext(ShopContext);
  const { t, isRTL, language } = useLanguage();

  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("desc");
  const [addedModal, setAddedModal] = useState(false);

  const productData = useMemo(
    () => products.find((item) => String(item._id) === String(productId)) ?? null,
    [products, productId]
  );

  const labelForFormat = (code) => {
    if (code === "Paperback") return t("format.paperback");
    if (code === "Hardcover") return t("format.hardcover");
    return code;
  };

  useEffect(() => {
    if (!productData?.image?.[0]) return;
    setImage(productData.image[0]);
    setSize("");
  }, [productId, productData]);

  useEffect(() => {
    if (!addedModal) return;
    const onKey = (e) => e.key === "Escape" && setAddedModal(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [addedModal]);

  const handleAddToCart = () => {
    if (!size) {
      addToCart(productData._id, size);
      return;
    }
    addToCart(productData._id, size);
    setAddedModal(true);
  };

  const longDesc = productData ? getDescription(productData, language) : "";
  const dir = language === "ar" ? "rtl" : "ltr";

  if (productsLoading) {
    return (
      <div className="border-t border-stone-200/90 py-10 dark:border-stone-800" dir={dir}>
        <div className="flex animate-pulse flex-col gap-10 sm:flex-row sm:gap-12">
          <div className="h-[min(72vh,30rem)] flex-1 rounded-2xl bg-stone-200/80" />
          <div className="flex flex-1 flex-col gap-4">
            <div className="h-9 w-3/4 rounded-lg bg-stone-200/80" />
            <div className="h-4 w-1/2 rounded bg-stone-200/60" />
            <div className="h-10 w-40 rounded bg-stone-200/60" />
            <div className="h-24 w-full rounded-lg bg-stone-200/50" />
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-stone-500">{t("product.loading")}</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div
        className="border-t border-stone-200/90 py-16 text-center text-stone-600 dark:border-stone-800 dark:text-stone-400"
        dir={dir}
      >
        <p className="text-sm sm:text-base">{t("product.notFound")}</p>
        <Link
          to="/collection"
          className="mt-4 inline-block text-sm font-medium text-red-800 underline-offset-2 hover:underline"
        >
          {t("nav.collection")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="border-t border-stone-200/90 pb-10 pt-8 dark:border-stone-800 sm:pb-12 sm:pt-10">
        <div
          className={`flex flex-col gap-10 sm:gap-12 lg:gap-14 lg:items-stretch ${
            isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          {/* Gallery */}
          <div
            className={`flex min-w-0 flex-1 flex-col-reverse gap-3 sm:h-[min(72vh,32rem)] sm:min-h-[280px] sm:flex-row sm:gap-4 ${
              isRTL ? "sm:flex-row-reverse" : ""
            }`}
          >
            <div
              className="flex h-full min-h-0 w-full max-sm:overflow-x-auto max-sm:gap-2 max-sm:pb-1 sm:min-w-[5.5rem] sm:max-w-[6.5rem] sm:flex-col sm:gap-2 sm:overflow-y-auto sm:pr-0.5"
              role="list"
              aria-label="Thumbnails"
            >
              {productData.image.map((item, index) => {
                const isActive = item === image;
                return (
                  <div
                    key={index}
                    className="w-[22%] max-sm:max-w-[4.2rem] max-sm:shrink-0 sm:aspect-[2/3] sm:max-h-full sm:w-full sm:min-h-0 sm:flex-1"
                  >
                    <button
                      type="button"
                      onClick={() => setImage(item)}
                      onKeyDown={(e) => e.key === "Enter" && setImage(item)}
                      className={`h-full w-full overflow-hidden rounded-xl bg-stone-100 text-left ring-2 ring-transparent transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-800/50 ${
                        isActive
                          ? "ring-red-800 shadow-md"
                          : "hover:ring-stone-300/80"
                      }`}
                    >
                      <img
                        className="h-full w-full object-cover object-center"
                        src={item}
                        alt=""
                      />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="min-h-0 w-full max-sm:aspect-[2/3] sm:min-w-0 sm:h-full sm:flex-1 sm:overflow-hidden">
              <div className="h-full w-full overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-50 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] dark:border-stone-600/60 dark:bg-stone-800/30">
                <img
                  className="h-full w-full object-cover object-center"
                  src={image}
                  alt={productData.name}
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col" dir={dir}>
            <h1 className="text-2xl font-semibold leading-tight text-stone-900 dark:text-stone-100 sm:text-3xl">
              {productData.name}
            </h1>
            <div
              className={`mt-3 flex items-center gap-1 text-sm text-stone-500 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="inline-flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} className="h-3.5 w-3.5" />
                ))}
              </span>
              <span className="ps-1.5 text-stone-500">{t("product.ratingLine")}</span>
            </div>

            <p className="mt-4 text-3xl font-semibold tabular-nums text-red-900">
              {currency}
              {productData.price}
            </p>

            <p className="mt-5 text-base leading-relaxed text-stone-600 dark:text-stone-400 sm:max-w-xl">
              {longDesc}
            </p>

            <div className="mt-8">
              <p className="text-sm font-medium text-stone-800">{t("product.format")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {productData.sizes.map((item, index) => (
                  <button
                    type="button"
                    onClick={() => setSize(item)}
                    className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                      item === size
                        ? "border-red-800 bg-red-50 text-red-950 shadow-sm ring-2 ring-red-800/20"
                        : "border-stone-200 bg-white text-gray-800 hover:border-red-200 hover:bg-stone-50/80"
                    }`}
                    key={index}
                  >
                    {labelForFormat(item)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 w-full max-w-3xl rounded-2xl border border-stone-200/90 bg-stone-50/60 p-3.5 sm:p-4">
              <div className="grid w-full min-w-0 grid-cols-1 divide-y divide-stone-200/80 text-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-stone-200/80">
                <p className="min-w-0 py-2 sm:py-0 sm:pe-3">
                  <span className="font-semibold text-stone-800">{t("product.author")}</span>{" "}
                  <span className="text-stone-600">{productData.author || "—"}</span>
                </p>
                <p className="min-w-0 py-2 sm:px-3 sm:py-0">
                  <span className="font-semibold text-stone-800">{t("product.publisher")}</span>{" "}
                  <span className="text-stone-600">{productData.publisher || "—"}</span>
                </p>
                <p className="min-w-0 break-words py-2 sm:py-0 sm:ps-3">
                  <span className="whitespace-nowrap font-semibold text-stone-800">
                    {t("product.isbn")}
                  </span>{" "}
                  <span className="break-all text-stone-600 tabular-nums">
                    {productData.isbn || "—"}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 w-full max-w-sm rounded-xl bg-red-800 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-red-900 hover:shadow-lg active:scale-[0.99] sm:w-auto"
            >
              {t("product.addToCart")}
            </button>
          </div>
        </div>

        {/* Tabs + detail */}
        <div className="mt-12 sm:mt-16" dir={dir}>
          <div
            className={`flex w-full max-w-3xl border-b border-stone-200/90 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTab("desc")}
              className={`px-4 py-3 text-sm font-medium transition-colors sm:px-6 sm:py-3.5 sm:text-base ${
                activeTab === "desc"
                  ? "border-b-2 border-red-800 text-red-900"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {t("product.descTab")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("review")}
              className={`px-4 py-3 text-sm font-medium transition-colors sm:px-6 sm:py-3.5 sm:text-base ${
                activeTab === "review"
                  ? "border-b-2 border-red-800 text-red-900"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {t("product.reviewTab")} {t("product.reviewCount")}
            </button>
          </div>
          <div className="mt-0 rounded-b-2xl border border-t-0 border-stone-200/90 bg-white px-4 py-6 sm:px-8 sm:py-8">
            {activeTab === "desc" ? (
              <p className="text-sm leading-relaxed text-stone-600 sm:text-base">{longDesc}</p>
            ) : (
              <p className="text-sm text-stone-500 sm:text-base">
                {t("product.reviewTab")} — {t("product.ratingLine")}
              </p>
            )}
          </div>
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />

      {addedModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="added-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-stone-900/45 backdrop-blur-[2px] transition-opacity"
            onClick={() => setAddedModal(false)}
            aria-label="Close"
          />
          <div
            className="relative w-full max-w-md rounded-2xl border border-stone-200/90 bg-white p-6 shadow-2xl shadow-stone-900/15"
            dir={dir}
          >
            <button
              type="button"
              onClick={() => setAddedModal(false)}
              className="absolute end-3 top-3 rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            >
              <FaTimes className="h-4 w-4" />
            </button>
            <div className="flex flex-col items-center text-center sm:pt-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-800">
                <FaCheckCircle className="h-6 w-6" aria-hidden />
              </div>
              <h2
                id="added-modal-title"
                className="text-lg font-semibold text-stone-900 sm:text-xl"
              >
                {t("product.addedTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {t("product.addedHint")}
              </p>
            </div>
            <div
              className={`mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              <Link
                to="/cart"
                onClick={() => setAddedModal(false)}
                className="flex flex-1 items-center justify-center rounded-xl bg-red-800 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-900"
              >
                {t("product.viewCart")}
              </Link>
              <button
                type="button"
                onClick={() => setAddedModal(false)}
                className="flex flex-1 items-center justify-center rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-800 transition hover:border-stone-300 hover:bg-stone-50"
              >
                {t("product.continueShopping")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
