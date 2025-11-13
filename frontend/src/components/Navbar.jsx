import { Link } from "react-router-dom";
import { ShoppingCart, User, ChevronDown, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="flex justify-between items-center bg-white shadow-md px-6 py-3 sticky top-0 z-50">
      {/* Logo + Delivery Info */}
      <div className="flex items-center gap-3">
        <Link to="/" className="text-2xl font-bold text-green-600">
          Blinkit
        </Link>
        <div className="flex items-center bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded-md animate-pulse">
          <Clock className="w-4 h-4 mr-1 text-green-600" />
          Delivery in <span className="ml-1 font-bold">8 mins</span>
        </div>
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
        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1.5">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Login / Profile */}
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
              {/* Profile Avatar */}
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
              <ChevronDown className="w-4 h-4 mt-\[2px\]" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
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
                  to="/orders"
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
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
