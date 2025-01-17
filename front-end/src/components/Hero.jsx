import HeroImg from "../assets/PNG/HeroIMG.jpg";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero left side  */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-5 sm:py-0">
        {" "}
        {/* Reduced padding here */}
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">Get your</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-4xl leading-relaxed">
            {" "}
            {/* Reduced text size */}
            New Book
          </h1>
          <div className="flex gap-2 items-center">
            <p className="font-semibold text-sm md:text-base"> Collection</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      {/* Hero Right Side  */}
      <img
        className="w-full sm:w-1/2 object-cover h-[300px] sm:h-[400px] "
        src={HeroImg}
        alt="Hero img"
      />
    </div>
  );
};

export default Hero;
