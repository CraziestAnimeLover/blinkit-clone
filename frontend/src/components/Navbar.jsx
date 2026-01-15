import {
  useState,
  useContext,
  useMemo,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  User,
  ChevronDown,
  Clock,
  Menu,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { allCategories } from "../data/allCategories";

// 🔥 Lazy loaded components (CHUNKING)
const LocationDropdown = lazy(() => import("./LocationDropdown"));
const SearchDropdown = lazy(() => import("./SearchDropdown"));

// 🔹 API function (outside component)
const fetchProducts = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/products`
  );
  return res.data.products;
};

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState({
    label: "HOME",
    address:
      "B62, Pocket B, South City I, Sector 30, Gurugram, Haryana 122001, India",
  });

  // 🔥 React Query (cached API)
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  // 🔹 Cart count optimization
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // 🔹 Search results (optimized)
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    const productResults = products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        type: "Product",
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

    return [...productResults, ...categoryResults];
  }, [query, products]);

  // 🔹 ESC key close (optimized)
  useEffect(() => {
    if (!showSearch) return;

    const handler = (e) => e.key === "Escape" && setShowSearch(false);
    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [showSearch]);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="text-2xl font-bold text-green-600"
        >
          Blinkit
        </Link>

        {/* DELIVERY INFO */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="bg-green-100 text-green-700 text-sm px-3 py-2 rounded">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                Delivery in <b>10 mins</b>
              </span>
            </div>
            <p className="text-xs truncate max-w-[250px]">
              {selectedAddress.address}
            </p>
          </div>

          <Suspense fallback={null}>
            <LocationDropdown
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          </Suspense>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {!isAdmin && (
            <Link to="/cart" className="relative">
              <ShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* USER MENU */}
          <div className="hidden md:block relative">
            {!user ? (
              <Link to="/login" className="flex items-center gap-1">
                <User /> Login
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2"
                >
                  <img
                    loading="lazy"
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                    className="w-8 h-8 rounded-full border"
                  />
                  <ChevronDown />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow">
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
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSearch(true);
            }}
            placeholder="Search products..."
            className="w-full bg-gray-100 rounded px-4 py-2 text-sm"
          />

          {showSearch && (
            <Suspense fallback={null}>
              <SearchDropdown
                results={searchResults}
                onClose={() => {
                  setShowSearch(false);
                  setQuery("");
                }}
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 space-y-3 border-t">
          <Suspense fallback={null}>
            <LocationDropdown
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          </Suspense>

          {!user ? (
            <Link to="/login">Login</Link>
          ) : (
            <>
              <Link to="/profile">My Profile</Link>
              <Link to="/myorders">My Orders</Link>
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
