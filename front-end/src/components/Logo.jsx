import { FaBook } from "react-icons/fa"; // Import the icon

const Logo = () => {
  return (
    <div className="flex items-center space-x-1 md:space-x-2">
      {/* Icon with adjusted position */}
      <FaBook size={20} className="text-black " />

      {/* Site name */}
      <span className="font-bold text-1xl md:text-2xl text-red-800">
        BOOK BAZZAR
      </span>
    </div>
  );
};

export default Logo;
