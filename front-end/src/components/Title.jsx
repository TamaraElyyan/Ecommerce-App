import PropTypes from "prop-types";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-stone-500 dark:text-stone-400">
        {text1}{" "}
        <span className="font-medium text-red-800 dark:text-red-500">{text2}</span>
      </p>
      <p className="h-[1px] w-8 bg-red-800 dark:bg-red-600 sm:h-[2px] sm:w-12" />
    </div>
  );
};

Title.propTypes = {
  text1: PropTypes.string,
  text2: PropTypes.string,
};

export default Title;
