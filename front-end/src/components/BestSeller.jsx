import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const { t, language } = useLanguage();
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestSeller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10 ">
      <div className="text-center text-3xl py-8">
        <Title text1={t("bestSeller.t1")} text2={t("bestSeller.t2")} />
        <p
          className="m-auto w-3/4 text-xs text-stone-600 sm:text-sm md:text-base dark:text-stone-400"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {t("home.bestSellersSub")}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5 gap-y-7 md:gap-y-8">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
