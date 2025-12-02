import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import axios from "axios";

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

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Fetch products from backend
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
    if (!selectedSubCategory) return true; // show all if no subcategory selected
    return p.subcategory === selectedSubCategory; // assume product has `subcategory` field
  });

  return (
    <div className="px-6 py-4">
      {/* Hero */}
      <div className="w-full h-48 bg-green-100 flex items-center justify-center text-3xl font-semibold text-green-700 rounded-md">
        Welcome to Blinkit Clone 🛒
      </div>

      {/* Main Categories */}
      <h2 className="text-xl font-bold mt-6 mb-3">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {allCategories.map((cat) => (
          <div
            key={cat.title}
            className={`p-2 cursor-pointer rounded ${
              selectedMainCategory === cat.title ? "bg-green-200" : ""
            }`}
            onClick={() =>
              setSelectedMainCategory(
                selectedMainCategory === cat.title ? "" : cat.title
              )
            }
          >
            <p className="text-center font-medium">{cat.title}</p>
          </div>
        ))}
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
                  setSelectedSubCategory(
                    selectedSubCategory === sub ? "" : sub
                  )
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

      <Footer />
    </div>
  );
};

export default Home;
