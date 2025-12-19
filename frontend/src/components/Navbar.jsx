import { Link } from "react-router-dom";
import { ShoppingCart, User, ChevronDown, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import LocationDropdown from "./LocationDropdown";

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
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Auto-close dropdown after 3 seconds
  useEffect(() => {
    if (dropdownOpen) {
      const timer = setTimeout(() => setDropdownOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [dropdownOpen]);

  return (
    <nav className="flex justify-between items-center bg-white shadow-md px-6 py-3 sticky top-0 z-50">
      {/* Logo + Delivery Info */}
      <div className="flex items-center gap-3">
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="text-2xl font-bold text-green-600"
        >
          Blinkit
        </Link>

        {/* Always visible delivery info */}
        <div className="flex flex-col bg-green-100 text-green-700 text-sm font-semibold px-3 py-2 rounded-md animate-pulse">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-green-600" />
            <span>
              Delivery in <span className="font-bold">10 mins</span>
            </span>
          </div>
          <span className="text-xs mt-1">{selectedAddress.address}</span>
        </div>

        {/* Dropdown to change address */}
        <LocationDropdown
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
      </div>

      {/* Search Bar */}
      <div className="flex items-center w-1/2 bg-gray-100 rounded-lg px-4 py-2">
        <input
          type="text"
          placeholder="Search for fruits, snacks, and more..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* Right Section */}
      <div className="flex gap-4 items-center relative">
        {!isAdmin && (
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1.5">
                {totalItems}
              </span>
            )}
          </Link>
        )}

        {!user ? (
          <Link
            to="/login"
            className="flex items-center gap-1 text-gray-700 hover:text-green-600"
          >
            <User className="w-5 h-5" /> <span>Login</span>
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-green-600"
            >
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                alt="profile"
                className="w-8 h-8 rounded-full border"
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold leading-tight">
                  {user.name.split(" ")[0]}
                </span>
                <span className="text-[10px] text-gray-500 -mt-1">
                  My Account
                </span>
              </div>
              <ChevronDown className="w-4 h-4 mt-[2px]" />
            </button>

            {/* Dropdown Menu with animation */}
            <div
              className={`absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
                dropdownOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <p className="px-4 py-2 text-sm text-gray-700 border-b">
                Hi, {user.name}
              </p>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                to="/myorders"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Orders
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
