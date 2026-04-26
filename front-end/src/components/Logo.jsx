import { FaBook } from "react-icons/fa"; // Import the icon

const Logo = () => {
  return (
    <div className="group flex items-center space-x-1 transition-opacity duration-300 hover:opacity-90 md:space-x-2">
      <FaBook
        size={20}
        className="text-black transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 dark:text-stone-100"
        aria-hidden
      />
      <span className="text-1xl font-bold text-red-800 transition-colors duration-300 group-hover:text-red-900 dark:text-red-500 md:text-2xl">
        BOOK BAZZAR
      </span>
    </div>
  );
};

export default Logo;
