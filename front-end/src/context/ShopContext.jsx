import { createContext, useState } from "react";
import { products } from "../assets/asserts";
import PropTypes from "prop-types"; // Import PropTypes
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
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

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
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
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
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

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    addToCart,
    cartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // This will validate the children prop
};

export default ShopContextProvider;
