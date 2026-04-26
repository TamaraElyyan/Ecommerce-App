import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { productsUrl } from "../config";
import { useLanguage } from "./LanguageContext";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const { t } = useLanguage();
  const currency = "$";
  const delivery_fee = 10;
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const CART_KEY = "book-bazaar-cart";

  const normalizeCart = (raw) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const out = {};
    for (const pid of Object.keys(raw)) {
      const sizes = raw[pid];
      if (!sizes || typeof sizes !== "object" || Array.isArray(sizes)) continue;
      const inner = {};
      for (const sz of Object.keys(sizes)) {
        const n = Number(sizes[sz]);
        if (Number.isFinite(n) && n > 0) inner[sz] = n;
      }
      if (Object.keys(inner).length) out[String(pid)] = inner;
    }
    return out;
  };

  const loadCartFromStorage = () => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return normalizeCart(parsed);
    } catch {
      return {};
    }
  };

  const [cartItems, setCartItems] = useState(() => loadCartFromStorage());
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch {
      /* ignore */
    }
  }, [cartItems]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const tryApi = async () => {
        const r = await fetch(productsUrl(), { cache: "no-store" });
        if (!r.ok) return false;
        const data = await r.json();
        if (!Array.isArray(data) || data.length === 0) return false;
        if (!cancelled) setProducts(data);
        return true;
      };

      const tryLocal = async () => {
        const r = await fetch("/products.json", { cache: "no-store" });
        if (!r.ok) return false;
        const data = await r.json();
        if (!Array.isArray(data) || data.length === 0) return false;
        if (!cancelled) setProducts(data);
        return true;
      };

      try {
        if (await tryApi()) return;
        if (await tryLocal()) return;
        if (!cancelled) toast.error(t("errors.loadProducts"));
      } catch {
        try {
          if (await tryLocal()) return;
        } catch {
          /* ignore */
        }
        if (!cancelled) toast.error(t("errors.loadProducts"));
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once; toast uses t from mount
  }, []);

  const refetchProducts = async () => {
    setProductsLoading(true);
    try {
      const tryApi = async () => {
        const r = await fetch(productsUrl(), { cache: "no-store" });
        if (!r.ok) return false;
        const data = await r.json();
        if (!Array.isArray(data) || data.length === 0) return false;
        setProducts(data);
        return true;
      };
      if (await tryApi()) return;
      const r = await fetch("/products.json", { cache: "no-store" });
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data) && data.length) setProducts(data);
      }
    } catch {
      /* keep existing */
    } finally {
      setProductsLoading(false);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error(t("errors.selectFormat"));
      return;
    }
    const id = String(itemId);
    const cartData = structuredClone(cartItems);
    if (cartData[id]) {
      if (cartData[id][size]) {
        cartData[id][size] += 1;
      } else {
        cartData[id][size] = 1;
      }
    } else {
      cartData[id] = {};
      cartData[id][size] = 1;
    }
    setCartItems(cartData);
  };

  // useEffect(() => {
  //   console.log(cartItems);
  // }, [cartItems]);

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart count:", error);
        }
      }
    }
    return totalCount;
  };

  // const getCartCount = () => {
  //   let totalCount = 0;
  //   for (const items in cartItems) {
  //     for (const item in cartItems[items]) {
  //       try {
  //         if (cartItems[items][item] > 0) {
  //           console.log("Adding:", cartItems[items][item]);
  //           totalCount += cartItems[items][item];
  //         }
  //       } catch (error) {
  //         console.error("Error calculating cart count:", error);
  //       }
  //     }
  //   }
  //   console.log("Total Count:", totalCount);
  //   return totalCount;
  // };

  const updateQuantity = (itemId, size, quantity) => {
    const id = String(itemId);
    const cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      if (!cartData[id]) return;
      delete cartData[id][size];
      if (Object.keys(cartData[id]).length === 0) {
        delete cartData[id];
      }
    } else {
      if (!cartData[id]) cartData[id] = {};
      cartData[id][size] = quantity;
    }
    setCartItems(cartData);
  };

  // const updateQuantity = (itemId, size, quantity) => {
  //   let cartData = structuredClone(cartItems);

  //   if (quantity === 0) {
  //     delete cartData[itemId][size];
  //     if (Object.keys(cartData[itemId]).length === 0) {
  //       delete cartData[itemId];
  //     }
  //   } else {
  //     if (!cartData[itemId]) {
  //       cartData[itemId] = {};
  //     }
  //     cartData[itemId][size] = quantity;
  //   }

  //   setCartItems(cartData);
  // };
  const findProductById = (id) =>
    products.find((product) => String(product._id) === String(id));

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = findProductById(items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart count:", error);
        }
      }
    }
    return totalAmount;
  };

  // إنشاء خريطة للبحث السريع عن المنتجات
  //   const productMap = new Map(products.map((product) => [product._id, product.price]));

  //   for (const itemId in cartItems) {
  //     const itemQuantity = cartItems[itemId];

  //     // تحقق من وجود المنتج في الخريطة
  //     if (productMap.has(itemId)) {
  //       totalAmount += productMap.get(itemId) * itemQuantity;
  //     }
  //   }

  //   return totalAmount;
  // };

  const clearCart = () => {
    setCartItems({});
  };

  const changeFormat = (itemId, oldSize, newSize) => {
    if (!oldSize || !newSize || oldSize === newSize) return;
    const id = String(itemId);
    const cartData = structuredClone(cartItems);
    if (!cartData[id] || !cartData[id][oldSize]) return;
    const qty = cartData[id][oldSize];
    delete cartData[id][oldSize];
    if (!cartData[id][newSize]) {
      cartData[id][newSize] = 0;
    }
    cartData[id][newSize] += qty;
    if (Object.keys(cartData[id]).length === 0) {
      delete cartData[id];
    }
    setCartItems(cartData);
  };

  const value = {
    products,
    productsLoading,
    currency,
    delivery_fee,
    search,
    setSearch,
    addToCart,
    cartItems,
    getCartCount,
    updateQuantity,
    changeFormat,
    getCartAmount,
    findProductById,
    navigate,
    refetchProducts,
    clearCart,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // This will validate the children prop
};

export default ShopContextProvider;
