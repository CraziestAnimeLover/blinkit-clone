// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  const usefulLinks = [
    "Blog",
    "Privacy",
    "Terms",
    "FAQs",
    "Security",
    "Contact",
    "Partner",
    "Franchise",
    "Seller",
    "Warehouse",
    "Deliver",
  ];

  const resources = [
    "Recipes",
    "Bistro",
    "District",
  ];

  const categories = [
    "Vegetables & Fruits",
    "Dairy & Breakfast",
    "Munchies",
    "Cold Drinks & Juices",
    "Instant & Frozen Food",
    "Tea, Coffee & Health Drinks",
    "Bakery & Biscuits",
    "Sweet Tooth",
  ];

  return (
    <footer className="bg-gray-100 mt-10 pt-10 pb-6 text-gray-700">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {/* Useful Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            {usefulLinks.map((item, index) => (
              <li key={index} className="hover:text-green-600 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            {resources.map((item, index) => (
              <li key={index} className="hover:text-green-600 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((item, index) => (
              <li key={index} className="hover:text-green-600 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/all-categories"
            className="inline-block mt-3 text-green-600 font-medium hover:underline"
          >
            See All →
          </Link>
        </div>

        {/* App Info */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Download App</h3>
          <div className="space-y-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Play_Store_badge_EN.svg"
              alt="Play Store"
              className="w-32 cursor-pointer"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/96/Download_on_the_App_Store_Badge.svg"
              alt="App Store"
              className="w-32 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="max-w-6xl mx-auto px-6 mt-10 text-xs text-gray-500">
        <p>
          © Blink Commerce Private Limited, 2016–2025
        </p>
        <p className="mt-2">
          “Blinkit” is owned & managed by "Blink Commerce Private Limited" and is not related, linked or interconnected in whatsoever manner or nature, to “GROFFR.COM”.
        </p>
      </div>
    </footer>
  );
}
