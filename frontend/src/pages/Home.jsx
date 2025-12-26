import React, { useEffect, useState, useRef } from "react";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import AllCategoriesPage from "./Categories/AllCategoriesPage";
import CategoriesSection from "./Categories/CategoriesSection";
import CategoryPage from "./Categories/CategoryPage";

// Use your categories array
const allCategories = [
  {
    title: "Chicken, Meat & Fish",
    items: [
      "Exotic Meat",
      "Fish & Seafood",
      "Chicken",
      "Mutton",
      "Sausage, Salami & Ham",
    ],
  },
  {
    title: "Pet Care",
    items: [
      "Dog Food & Treats",
      "Cat Food & Treats",
      "Pet Grooming & Accessories",
      "Cat Treats",
      "Accessories & Other Supplies",
      "Dog Treat",
      "Other Pet Supplies",
      "Pet Health & Supplements",
      "Pet Litter",
      "Pet Toys",
    ],
  },
  {
    title: "Baby Care",
    items: [
      "Baby Diapers",
      "Baby Feeding Needs",
      "Baby Wipes",
      "Hygiene",
      "Baby's Health & Safety Tools",
      "Oral & Nasal Care",
      "Baby Gift Hampers",
      "Diapers & Wipes",
      "Baby Bathing Needs",
      "Baby Skin & Hair Care",
      "Baby Food",
      "Mom Care",
      "Nursing",
    ],
  },
  {
    title: "Magazines",
    items: [
      "Current Affairs & Business",
      "Children's Books",
      "Lifestyle Books",
      "Hobby Books",
      "Architecture Books",
      "Business Books",
    ],
  },
  {
    title: "Sweet Tooth",
    items: [
      "Flavoured Yogurts",
      "Ice Cream & Frozen Dessert",
      "Indian Sweets",
      "Chocolates",
      "Chocolate Packs",
      "Chocolate Syrup",
      "Candies & Gum",
      "Mouth Fresheners",
      "Cakes and Rolls",
      "Chocolate Bars",
    ],
  },
  {
    title: "Tea, Coffee & Health Drinks",
    items: [
      "Vegan Drinks",
      "Tea",
      "Health Drinks",
      "Herbal Drinks",
      "Milk Drinks",
      "Coffee",
      "Green Tea",
      "Filter Coffee",
      "Instant Coffee",
    ],
  },
  {
    title: "Beauty & Cosmetics",
    items: [
      "Hair Care",
      "Beauty and Makeup",
      "Lipstick",
      "BB & CC cream",
      "Compact",
      "Foundation",
      "Hair Oil",
      "Nail color/paints",
      "Primer",
      "Fragrance Gift Sets",
      "Men's Fragrance",
      "Women's Fragrance",
      "Face Cream & Gel",
      "Concealer",
      "Toners & Mists",
      "Hair Serum",
      "Hair Mask",
    ],
  },
  {
    title: "Dairy, Bread & Eggs",
    items: [
      "Cheese",
      "Curd & Yogurt",
      "Milk",
      "Paneer & Tofu",
      "Butter & More",
      "Bread",
      "Eggs",
      "Cream & Whitener",
      "Oats",
      "Flakes",
    ],
  },
  {
    title: "Breakfast & Instant Food",
    items: [
      "Energy Bars",
      "Breakfast Cereal",
      "Noodles",
      "Soup",
      "Instant Mixes",
      "Pasta",
      "Plant Based Meat",
      "Frozen Snacks",
    ],
  },
  {
    title: "Atta, Rice & Dal",
    items: [
      "Moong & Masoor",
      "Rice",
      "Besan, Sooji & Maida",
      "Rajma, Chhole & Others",
      "Flours",
      "Dried Peas",
    ],
  },
  {
    title: "Cleaning Essentials",
    items: [
      "Detergent Powder & Bars",
      "Toilet Cleaners",
      "Liquid Detergents",
      "Garbage Bags",
      "Air Fresheners",
      "Floor Cleaners",
      "Dishwashing Gels",
      "Brooms & Mops",
      "Scrubbers & Aids",
    ],
  },
  {
    title: "Digital Goods",
    items: ["Antivirus", "System Utilities"],
  },
  {
    title: "Personal Care",
    items: [
      "Shampoo & Conditioner",
      "Soaps",
      "Hair Oil & Serum",
      "Oral Care",
      "Feminine Care",
      "Deodorants & Powders",
      "Men's Grooming",
    ],
  },
  {
    title: "Organic & Gourmet",
    items: [
      "Baby Food",
      "Snacks & Munchies",
      "Healthy Proteins",
      "Oil & Ghee",
      "Spices & Vinegar",
      "Dairy Products",
      "Dry Fruits, Nuts & Seeds",
    ],
  },
  {
    title: "Paan Corner",
    items: ["Hookah Needs", "Paan", "Cigarettes & Tobacco", "Smoking Needs"],
  },
  {
    title: "Pharma & Wellness",
    items: [
      "Healthcare Devices",
      "Cough & Cold",
      "Vitamins & Daily Nutrition",
      "Digestive Care",
      "Condoms",
      "Antiseptic Liquid",
      "Masks & Sanitizers",
      "Sexual Wellness",
    ],
  },
  {
    title: "Cold Drinks & Juices",
    items: [
      "Energy Drinks",
      "Coldpress Juices",
      "Coconut Water",
      "Flavored Milk",
      "Soda",
      "Mineral Water",
      "Cold Coffee",
      "Iced Tea",
    ],
  },
  {
    title: "Ice Cream & Frozen Desserts",
    items: ["Tubs", "Sticks", "Cups", "Cones", "Sandwiches"],
  },
  {
    title: "Bakery & Biscuits",
    items: [
      "Cookies",
      "Cream Biscuits",
      "Sweet & Salty",
      "Healthy & Digestive",
      "Fresh Muffins & Cake",
      "Brown & Multigrain Breads",
    ],
  },
  {
    title: "Sauces & Spreads",
    items: [
      "Cooking Sauces & Paste",
      "Jams",
      "Honey",
      "Pickles & Chutney",
      "Salad Dressings",
      "Peanut Butter",
    ],
  },
  {
    title: "Munchies",
    items: [
      "Namkeen Snacks",
      "Popcorn",
      "Nachos",
      "Healthy Snacks",
      "Chips & Crisps",
      "Bhujia & Mixtures",
    ],
  },
  {
    title: "Home & Office",
    items: [
      "Soft Toys & Greeting Cards",
      "Games",
      "Stationery Needs",
      "Kitchen & Dining Needs",
      "Fresheners",
      "Home Decor & Storage",
    ],
  },
  {
    title: "Vegetables & Fruits",
    items: [
      "Exotics & Premium",
      "Freshly Cut & Sprouts",
      "Fruits",
      "Fresh Vegetables",
      "Combo Offer",
    ],
  },
  {
    title: "Masala, Oil & More",
    items: [
      "Powdered Masala",
      "Oil",
      "Whole Spices",
      "Salt, Sugar & Jaggery",
      "Ghee & Vanaspati",
      "Dry Fruits",
    ],
  },
  {
    title: "Toys & Games",
    items: [
      "Soft Toys",
      "Learning Toys",
      "Action Figures",
      "Puzzles",
      "Remote Control Toys",
      "Board Games",
    ],
  },
  {
    title: "Books",
    items: [
      "Fiction Books",
      "Children's Books",
      "Romance Books",
      "Science Fiction Books",
      "Biographies & Memoirs",
      "Manga & Graphic Novels",
    ],
  },
]; // paste your full category array here
const banners = [
  {
    title: "Paan corner",
    subtitle: "Your favourite paan shop is now online",
    cta: "Shop Now",
    bg: "from-green-500 to-green-700",
    image: "/banners/paan_corner.png",
  },
  {
    title: "Pharmacy at your doorstep",
    subtitle: "Cough syrups, pain relief & more",
    cta: "Order Now",
    bg: "from-teal-400 to-teal-600",
    image: "/banners/masthead_web_pharma.jpg",
  },
  {
    title: "Pet Care supplies in minutes",
    subtitle: "Food, treats & toys",
    cta: "Order Now",
    bg: "from-yellow-400 to-orange-400",
    image: "/banners/masthead_web_pet_care.jpg",
  },
];

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const carouselRef = useRef(null);

  const [currentBanner, setCurrentBanner] = useState(0);
  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  }, 4000);
  return () => clearInterval(interval);
}, []);
  // Fetch products
  const loadProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (!selectedSubCategory) return true;
    return p.subcategory === selectedSubCategory;
  });

  // Carousel scroll
  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      carouselRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="px-6 py-4">
      {/* Hero */}
      {/* <div className="w-full h-48 bg-green-100 flex items-center justify-center text-3xl font-semibold text-green-700 rounded-md">
        Welcome to Blinkit Clone 🛒
      </div> */}
   {/* Hero Masthead */}
<div className="relative w-full h-60 rounded-xl overflow-hidden mb-8">
  <div
    className={`w-full h-full bg-gradient-to-r ${banners[currentBanner].bg} flex items-center justify-between px-10`}
  >
    {/* Left Content */}
    <div className="text-white max-w-md">
      <h1 className="text-3xl font-bold mb-2">
        {banners[currentBanner].title}
      </h1>
      <p className="text-sm mb-4 opacity-90">
        {banners[currentBanner].subtitle}
      </p>
      <button className="bg-white text-green-700 px-4 py-2 rounded-md font-semibold text-sm hover:bg-green-100">
        {banners[currentBanner].cta}
      </button>
    </div>

    {/* Right Image */}
    <img
      src={banners[currentBanner].image}
      alt="banner"
      className="h-44 object-contain"
    />
  </div>
</div>



      {/* Main Categories Carousel */}
      {/* <h2 className="text-xl font-bold mt-6 mb-3">Categories</h2> */}
      {/* <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-green-100 z-10"
        >
          &#8592;
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-green-100 z-10"
        >
          &#8594;
        </button>

        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        >
          {allCategories.map((cat) => (
            <div
              key={cat.title}
              className={`min-w-[180px] p-3 rounded-lg cursor-pointer text-center font-medium transition 
                ${selectedMainCategory === cat.title ? "bg-green-200" : "bg-gray-100 hover:bg-green-100"}`}
              onClick={() =>
                setSelectedMainCategory(
                  selectedMainCategory === cat.title ? "" : cat.title
                )
              }
            >
              {cat.title}
            </div>
          ))}
        </div>
      </div> */}

{/* Main Categories Carousel */}
<div className="relative">
  <AllCategoriesPage/>
</div>
      {/* Subcategories */}
      {selectedMainCategory && (
        <div className="mt-4 mb-6 flex flex-wrap gap-2">
          {allCategories
            .find((c) => c.title === selectedMainCategory)
            .items.map((sub) => (
              <button
                key={sub}
                onClick={() =>
                  setSelectedSubCategory(selectedSubCategory === sub ? "" : sub)
                }
                className={`px-3 py-1 rounded border ${
                  selectedSubCategory === sub
                    ? "bg-green-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {sub}
              </button>
            ))}
        </div>
      )}

      {/* Products */}
      <h2 className="text-xl font-bold mt-8 mb-3">
        {selectedSubCategory || "Popular"} Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
          <CategoriesSection/>
          {/* <CategoryPage/> */}
      <Footer />
    </div>
  );
};

export default Home;
