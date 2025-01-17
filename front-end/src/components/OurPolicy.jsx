import { FaExchangeAlt, FaUndoAlt, FaHeadset } from "react-icons/fa"; // Import the icons

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700 ">
      {/* Easy Exchange Policy */}
      <div>
        {/* Exchange icon */}
        <FaExchangeAlt className="w-12 h-12 m-auto mb-5 text-green-800" />
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-400">We offer hassle-free exchange policy</p>
      </div>

      {/* 7 Days Return Policy */}
      <div>
        {/* Return icon */}
        <FaUndoAlt className="w-12 h-12 m-auto mb-5 text-green-800" />
        <p className="font-semibold">7 Days Return Policy</p>
        <p className="text-gray-400">We provide 7 days free return policy</p>
      </div>

      {/* Best Customer Support */}
      <div>
        {/* Support icon */}
        <FaHeadset className="w-12 h-12 m-auto mb-5 text-green-800" />
        <p className="font-semibold">Best Customer Support</p>
        <p className="text-gray-400">We provide 7/24 customer support</p>
      </div>
    </div>
  );
};

export default OurPolicy;
