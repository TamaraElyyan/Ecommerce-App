import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import VISA from "../assets/PNG/Visa_Logo.png";
import MASTERCARD from "../assets/PNG/MasterCard_Logo.svg.webp";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const { navigate } = useContext(ShopContext);
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* --------- Left Side ------------*/}

      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email address"
        />
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Sreert"
        />
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>
      {/* ----------------Right Side------------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* ---------------PAYMENT METHOD----------------- */}
          <div className="flex gap-3 flex-col lg:flex-row">
            {/* VISA Option */}
            <button
              onClick={() => setMethod("VISA")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Pay with VISA"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "VISA" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={VISA} alt="VISA" />
            </button>

            {/* MasterCard Option */}
            <button
              onClick={() => setMethod("MasterCard")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Pay with MasterCard"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "MasterCard" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={MASTERCARD} alt="MasterCard" />
            </button>

            {/* Cash on Delivery Option */}
            <button
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Cash on Delivery"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </button>
          </div>
        </div>
        <div className="w-full text-end mt-8">
          <button
            onClick={() => navigate("./orders")}
            className="bg-black text-white px-16 py-3 text-sm"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
