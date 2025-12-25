import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  User,
  ChevronDown,
  Clock,
  Menu,
} from "lucide-react";
import axios from "axios";

import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import LocationDropdown from "./LocationDropdown";
import SearchDropdown from "./SearchDropdown";
import { allCategories } from "../data/allCategories.js";

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [selectedAddress, setSelectedAddress] = useState({
    label: "HOME",
    name: "Craziest Anime's Lover",
    address:
      "B62, Pocket B, South City I, Sector 30, Gurugram, Haryana 122001, India",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔍 Search states
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // Products
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error(err));
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Auto-close profile dropdown
  useEffect(() => {
    if (dropdownOpen) {
      const timer = setTimeout(() => setDropdownOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [dropdownOpen]);

  // 🔍 Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase();

      const productResults = products
        .filter((p) => p.name.toLowerCase().includes(q))
        .slice(0, 5)
        .map((p) => ({
          name: p.name,
          type: "Product",
          image: p.image,
          link: `/product/${p._id}`,
        }));

      const categoryResults = allCategories
        .filter((c) => c.title.toLowerCase().includes(q))
        .slice(0, 3)
        .map((c) => ({
          name: c.title,
          type: "Category",
          link: `/category/${encodeURIComponent(c.title)}`,
        }));

      setResults([...productResults, ...categoryResults]);
      setShowSearch(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, products]);

  // ESC closes search
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && setShowSearch(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="text-2xl font-bold text-green-600"
        >
          Blinkit
        </Link>

        {/* Desktop Delivery Info */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex flex-col bg-green-100 text-green-700 text-sm font-semibold px-3 py-2 rounded-md max-w-[300px]">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                Delivery in <b>10 mins</b>
              </span>
            </div>
            <span className="text-xs truncate">
              {selectedAddress.address}
            </span>
          </div>

          <LocationDropdown
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!isAdmin && (
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1.5">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Desktop User */}
          <div className="hidden md:block relative">
            {!user ? (
              <Link
                to="/login"
                className="flex items-center gap-1 text-gray-700"
              >
                <User className="w-5 h-5" /> Login
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                    className="w-8 h-8 rounded-full border"
                  />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/myorders"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="px-4 pb-3">
        <div className="relative md:w-2/3 lg:w-1/2 mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowSearch(true)}
            placeholder="Search for fruits, snacks, and more..."
            className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none"
          />

          {showSearch && (
            <SearchDropdown
              results={results}
              onClose={() => {
                setShowSearch(false);
                setQuery("");
              }}
            />
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-3 bg-white">
          <LocationDropdown
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />

          {!user ? (
            <Link to="/login" className="block">
              Login
            </Link>
          ) : (
            <>
              <Link to="/profile" className="block">
                My Profile
              </Link>
              <Link to="/myorders" className="block">
                My Orders
              </Link>
              <button onClick={logout} className="text-red-500">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
