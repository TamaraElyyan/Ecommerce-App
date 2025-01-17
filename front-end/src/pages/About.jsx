import Title from "../components/Title";
import AboutUs from "../assets/PNG/AboutUS.jpg";
import NewsLatterBox from "../components/NewsLetterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-[450px] " src={AboutUs} alt="Library" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Welcome to our Library of Books, where knowledge and stories come to
            life. Our collection includes a wide range of books from various
            genres, from fiction to non-fiction, self-development, history, and
            more. We aim to inspire a love for reading and make knowledge
            accessible to all.
          </p>
          <p>
            Whether you&apos;re looking to expand your knowledge or enjoy a good
            story, we have something for everyone.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission is to cultivate a passion for reading, learning, and
            personal growth. We strive to offer a wide array of books that
            empower individuals and inspire curiosity.
          </p>
          <p>
            Through our library, we aim to bridge the gap between knowledge and
            accessibility, ensuring every reader finds their next great book.
          </p>
        </div>
      </div>

      <div className="text-xl py-4 ">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row  text-sm mb-20 ">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-lg text-gray-800">Quality Assurance</b>
          <p className="text-gray-600">
            We carefully curate and maintain our collection to ensure it meets
            the highest standards of quality and relevance.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-lg text-gray-800">Convenience</b>
          <p className="text-gray-600">
            Explore and borrow books with ease through our user-friendly website
            and seamless borrowing process.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-lg text-gray-800">Exceptional Customer Service</b>
          <p className="text-gray-600">
            Our dedicated team is here to assist you, ensuring a smooth and
            enjoyable experience with every visit.
          </p>
        </div>
      </div>
      <NewsLatterBox />
    </div>
  );
};

export default About;
