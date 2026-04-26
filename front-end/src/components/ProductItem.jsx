import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      to={`/product/${id}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-red-800/35 focus-visible:ring-offset-2 dark:ring-offset-stone-900"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-red-200/70 group-hover:shadow-[0_12px_40px_-12px_rgba(127,29,29,0.18)] dark:border-stone-700/80 dark:bg-stone-900/90 dark:shadow-stone-950/40">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gradient-to-b from-stone-50 to-stone-100/90 dark:from-stone-800/80 dark:to-stone-900">
          <img
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            src={image[0]}
            alt={`Image of ${name}`}
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-1.5 pt-3 pb-1.5">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-stone-800 transition-colors duration-200 group-hover:text-stone-950 dark:text-stone-200 dark:group-hover:text-stone-100">
            {name}
          </p>
          <p className="mt-1.5 text-sm font-semibold tabular-nums text-red-900/90 dark:text-red-500">
            {currency}
            {price}
          </p>
        </div>
      </article>
    </Link>
  );
};

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default ProductItem;
