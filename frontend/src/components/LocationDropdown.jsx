import { useState, useRef, useEffect } from "react";
import { ChevronDown, MapPin } from "lucide-react";

const addresses = [
  {
    label: "HOME",
    name: "Craziest Anime's Lover",
    address:
      "B62, Pocket B, South City I, Sector 30, Gurugram, Haryana 122001, India",
  },
  {
    label: "WORK",
    name: "Sunny",
    address: "Pant house Pocket C, Sanjay Gandhi Memorial Nagar, Sector 48, Faridabad",
  },
  {
    label: "OTHER",
    name: "Trc Phase 4",
    address: "Udyog Vihar, Sector 18, Gurugram",
  },
];

const LocationDropdown = ({ selectedAddress, setSelectedAddress }) => {
  const [open, setOpen] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode using OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const liveAddress = {
            label: "Home",
            name: "Current Location",
            address: data.display_name || "Location not found",
          };

          setSelectedAddress(liveAddress);
          setOpen(false);
        } catch (err) {
          console.error("Error fetching location:", err);
          alert("Could not get your address.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        alert("Permission denied or location not available.");
        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-green-700 font-semibold px-2 py-1 rounded-md hover:bg-green-200 transition"
      >
        <span>{selectedAddress.label}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-2">
          {/* Detect live location */}
          <button
            onClick={detectLocation}
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 font-semibold text-blue-600"
          >
            <MapPin className="w-4 h-4" />
            {loadingLocation ? "Detecting..." : "Use my current location"}
          </button>

          <hr className="my-1 border-gray-200" />

          {/* Saved addresses */}
          {addresses.map((addr, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedAddress(addr);
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
            >
              <span className="font-semibold">{addr.label}</span> - {addr.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationDropdown;
