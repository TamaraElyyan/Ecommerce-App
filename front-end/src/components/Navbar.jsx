import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import {
  FaArrowLeft,
  FaBars,
  FaShoppingCart,
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaSignOutAlt,
} from "react-icons/fa";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const { setShowSearch, getCartCount } = useContext(ShopContext);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <Logo />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700 ">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/Collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-[1.5rem]">
        <FaSearch
          onClick={() => setShowSearch(true)}
          className="text-gray-500 cursor-pointer w-5"
          size={20}
        />

        <div className="group relative">
          <Link to={"/login"}>
            <FaUser size={20} className="text-gray-500 w-5 cursor-pointer" />
          </Link>
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <div className="flex items-center gap-2 cursor-pointer hover:text-black">
                <FaUser size={16} />
                <p>My Profile</p>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-black">
                <FaShoppingBag size={16} />
                <p>Orders</p>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-black">
                <FaSignOutAlt size={16} />
                <p>Logout</p>
              </div>
            </div>
          </div>
        </div>
        <Link to="/cart" className="relative">
          <FaShoppingCart
            className="text-gray-500 cursor-pointer w-5 min-w-5"
            size={20}
          />

          <span className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-red-700  text-white aspect-square  rounded-full text-[8px]">
            {getCartCount()}
          </span>
        </Link>

        <FaBars
          onClick={() => setVisible(true)}
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>
      {/* Side Menu for small Screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : " w-0"
        }`}
      >
        <div className=" flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className=" flex items-center gap-4 cursor-pointer p-3"
          >
            <FaArrowLeft className="h-4" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/categories"
          >
            CATEGORIES
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
