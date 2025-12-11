import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

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
];

export default function AllCategoriesPage() {
  const carouselRef = useRef(null);

  const scroll = (direction = "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;

      let newScrollLeft = scrollLeft + scrollAmount;

      // Loop back to start if we reach the end
      if (newScrollLeft >= scrollWidth - clientWidth) {
        newScrollLeft = 0;
      }

      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      scroll("right");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-8xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-600">All Categories</h1>

      <div>
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto scroll-smooth py-4"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
          }}
        >
          {allCategories.map((cat, index) => (
            <Link
              key={index}
              to={`/category/${encodeURIComponent(cat.title)}`}
              className="min-w-[200px] bg-white rounded-xl shadow-md p-4 hover:shadow-lg cursor-pointer flex-shrink-0 transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                {cat.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export { allCategories };