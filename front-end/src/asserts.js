// Import images at the top
import image1 from "./assets/PNG/bookassert.jpg";
import image2 from "./assets/PNG/bookassert.jpg";
import image3 from "./assets/PNG/bookassert.jpg";

export const products = [
  {
    _id: "1",
    name: "Women Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with no collar.",
    price: 100,
    image: [image1, image2, image3], // Use imported images
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716634345448,
    bestSeller: true,
  },
  {
    _id: "2",
    name: "Men's Casual Shirt",
    description:
      "A button-down casual shirt, perfect for an evening out or office wear.",
    price: 120,
    image: [image1, image2, image3], // Use imported images
    category: "Men",
    subCategory: "Shirts",
    sizes: ["M", "L", "XL"],
    date: 1716634345450,
    bestSeller: false,
  },
  {
    _id: "3",
    name: "Unisex Hoodie",
    description: "A comfortable, loose-fitting hoodie for all genders.",
    price: 90,
    image: [image1, image2, image3], // Use imported images
    category: "Unisex",
    subCategory: "Outerwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716634345452,
    bestSeller: true,
  },
  {
    _id: "4",
    name: "Women's Floral Dress",
    description: "A beautiful floral dress, perfect for summer occasions.",
    price: 150,
    image: [image1, image2, image3], // Use imported images
    category: "Women",
    subCategory: "Dresses",
    sizes: ["S", "M"],
    date: 1716634345454,
    bestSeller: true,
  },
  {
    _id: "5",
    name: "Men's Sports T-Shirt",
    description:
      "Breathable, lightweight, and designed for physical activities.",
    price: 80,
    image: [image1, image2, image3], // Use imported images
    category: "Men",
    subCategory: "T-Shirts",
    sizes: ["M", "L", "XL"],
    date: 1716634345456,
    bestSeller: false,
  },
  {
    _id: "6",
    name: "Kid's Cartoon Hoodie",
    description: "A fun hoodie for kids with vibrant cartoon characters.",
    price: 60,
    image: [image1, image2, image3], // Use imported images
    category: "Kids",
    subCategory: "Outerwear",
    sizes: ["XS", "S", "M"],
    date: 1716634345458,
    bestSeller: true,
  },
  {
    _id: "7",
    name: "Men's Leather Jacket",
    description: "Premium leather jacket for an elegant and bold look.",
    price: 300,
    image: [image1, image2, image3], // Use imported images
    category: "Men",
    subCategory: "Jackets",
    sizes: ["L", "XL"],
    date: 1716634345460,
    bestSeller: true,
  },
  {
    _id: "8",
    name: "Women's Yoga Pants",
    description:
      "Stretchy, comfortable yoga pants ideal for workouts and relaxation.",
    price: 70,
    image: [image1, image2, image3], // Use imported images
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L"],
    date: 1716634345462,
    bestSeller: false,
  },
  {
    _id: "9",
    name: "Unisex Sneakers",
    description: "Stylish and comfortable sneakers for all-day wear.",
    price: 110,
    image: [image1, image2, image3], // Use imported images
    category: "Unisex",
    subCategory: "Footwear",
    sizes: ["6", "7", "8", "9", "10"],
    date: 1716634345464,
    bestSeller: true,
  },
  {
    _id: "10",
    name: "Men's Formal Pants",
    description: "Classic formal pants for office or formal gatherings.",
    price: 130,
    image: [image1, image2, image3], // Use imported images
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345466,
    bestSeller: false,
  },
];
