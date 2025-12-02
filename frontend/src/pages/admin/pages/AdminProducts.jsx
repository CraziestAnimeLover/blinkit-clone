import React, { useEffect, useState } from "react";
import axios from "axios";
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

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const token = localStorage.getItem("token");

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      // Sort by newest first for latest products
      setProducts(res.data.products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") setForm({ ...form, image: e.target.files[0] });
    else setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("✔ Product Added");
      loadProducts();
      setForm({ name: "", description: "", price: "", category: "", stock: "", image: null });
    } catch (err) {
      alert("Failed: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑 Deleted");
      loadProducts();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">Products</h1>

      {/* LATEST PRODUCTS CAROUSEL */}
      {/* {products.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Latest Products</h2>
          <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
            {products.slice(0, 10).map((p) => (
              <div
                key={p._id}
                className="min-w-[180px] border rounded p-2 bg-white shadow hover:shadow-md transition flex-shrink-0"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="text-sm font-semibold truncate">{p.name}</h3>
                <p className="text-green-600 font-bold">₹{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )} */}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT — PRODUCTS TABLE */}
        <div className="flex-1 overflow-x-auto border rounded bg-white p-3">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border hover:bg-gray-50 transition">
                  <td className="p-2 border">
                    <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="p-2 border font-medium">{p.name}</td>
                  <td className="p-2 border">₹{p.price}</td>
                  <td className="p-2 border">{p.category}</td>
                  <td className="p-2 border">{p.stock}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT — ADD PRODUCT FORM */}
        <div className="w-full lg:w-1/3 border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-4 text-center lg:text-left">Add Product</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <input
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Select Category</option>
              {allCategories.map((group) => (
                <optgroup key={group.title} label={group.title}>
                  {group.items.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <input
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
