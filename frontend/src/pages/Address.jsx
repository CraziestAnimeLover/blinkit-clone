import React, { useEffect, useState, useContext, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import SmoothMarker from "./SmoothMarker";
import "leaflet/dist/leaflet.css";

/* ================= LEAFLET ICON FIX ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================= REVERSE GEOCODE ================= */
const reverseGeocode = async (lat, lng) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/addresses/reverse`,
      { params: { lat, lon: lng } }
    );
    return res.data.address || {};
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return {};
  }
};

/* ================= MAP CLICK HANDLER ================= */
const MapClickHandler = ({ setNewAddress }) => {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      const addr = await reverseGeocode(lat, lng);

      setNewAddress((prev) => ({
        ...prev,
        lat,
        lng,
        line1:
          (addr.house_number ? `${addr.house_number}, ` : "") +
          (addr.road || addr.pedestrian || addr.neighbourhood || ""),
        city: addr.city || addr.town || addr.village || addr.county || "",
        state: addr.state || addr.region || "",
        zip: addr.postcode || "",
      }));
    },
  });
  return null;
};

/* ================= RECENTER MAP ================= */
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 16, { duration: 1 });
  }, [lat, lng]);
  return null;
};

/* ================= MAIN COMPONENT ================= */
const Address = () => {
  const { cart, total } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const DELIVERY_CHARGE = 25;
  const HANDLING_CHARGE = 2;
  const SMALL_CART_CHARGE = 20;
  const grandTotal =
    parseFloat(total || 0) +
    DELIVERY_CHARGE +
    HANDLING_CHARGE +
    SMALL_CART_CHARGE;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const [newAddress, setNewAddress] = useState({
    name: "",
    line1: "",
    city: "",
    state: "",
    zip: "",
    lat: null,
    lng: null,
    label: "Home",
    instructions: "",
    isDefault: false,
  });

  const mapRef = useRef(null);

  /* ================= FETCH ADDRESSES ================= */
  useEffect(() => {
    if (!user) return;

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/addresses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses(res.data.addresses || []);
        if (res.data.addresses?.length)
          setSelectedAddress(res.data.addresses[0]._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  /* ================= CURRENT LOCATION ================= */
  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const addr = await reverseGeocode(lat, lng);

        setNewAddress((prev) => ({
          ...prev,
          lat,
          lng,
          line1:
            (addr.house_number ? `${addr.house_number}, ` : "") +
            (addr.road || addr.pedestrian || addr.neighbourhood || ""),
          city: addr.city || addr.town || addr.village || addr.county || "",
          state: addr.state || addr.region || "",
          zip: addr.postcode || "",
        }));
      },
      () => alert("Location permission denied")
    );
  };

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    let addressToUse;

    if (selectedAddress) {
      addressToUse = addresses.find((a) => a._id === selectedAddress);
    } else {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/addresses`,
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addressToUse = res.data.address;
    }

    const formattedAddress = [
      addressToUse.line1,
      addressToUse.city,
      addressToUse.state,
      addressToUse.zip,
    ]
      .filter(Boolean)
      .join(", ");

    const payload = {
      userId: user._id,
      items: cart.map((i) => ({
        productId: i._id,
        name: i.name,
        price: Number(i.price),
        quantity: Number(i.quantity),
      })),
      totalAmount: Number(grandTotal),
      address: formattedAddress,
      paymentMethod: "COD",
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/payment/${res.data.order._id}`);
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
    }
  };

  /* ================= FIX MAP SIZE ================= */
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 400);
    }
  }, [newAddress.lat, newAddress.lng]);

  if (!user || loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Delivery Address</h1>

      {/* SAVED ADDRESSES */}
      {addresses.map((addr) => (
        <label
          key={addr._id}
          className="border p-4 rounded flex gap-3 cursor-pointer"
        >
          <input
            type="radio"
            checked={selectedAddress === addr._id}
            onChange={() => setSelectedAddress(addr._id)}
          />
          <div>
            <p className="font-semibold">{addr.name}</p>
            <p className="text-sm text-gray-600">
              {[
                addr.line1,
                addr.city,
                addr.state,
                addr.zip,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </label>
      ))}

      {/* ADD NEW ADDRESS */}
      <div className="border rounded p-4 bg-gray-50 space-y-3">
        <h2 className="font-semibold text-lg">Add New Address</h2>

        <button
          onClick={detectLocation}
          className="text-green-600 font-semibold"
        >
          📍 Use current location
        </button>

        <div className="w-full h-[240px] rounded overflow-hidden">
          <MapContainer
            ref={mapRef}
            center={
              newAddress.lat && newAddress.lng
                ? [newAddress.lat, newAddress.lng]
                : [28.6139, 77.209]
            }
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler setNewAddress={setNewAddress} />
            <RecenterMap lat={newAddress.lat} lng={newAddress.lng} />
            {newAddress.lat && newAddress.lng && (
              <SmoothMarker
                position={{ lat: newAddress.lat, lng: newAddress.lng }}
              />
            )}
          </MapContainer>
        </div>

        <input
          placeholder="Flat / House No"
          className="input"
          value={newAddress.line1}
          onChange={(e) =>
            setNewAddress({ ...newAddress, line1: e.target.value })
          }
        />
        <input
          placeholder="City"
          className="input"
          value={newAddress.city}
          onChange={(e) =>
            setNewAddress({ ...newAddress, city: e.target.value })
          }
        />
        <input
          placeholder="State"
          className="input"
          value={newAddress.state}
          onChange={(e) =>
            setNewAddress({ ...newAddress, state: e.target.value })
          }
        />
        <input
          placeholder="ZIP"
          className="input"
          value={newAddress.zip}
          onChange={(e) =>
            setNewAddress({ ...newAddress, zip: e.target.value })
          }
        />

        <div className="flex gap-2">
          {["Home", "Work", "Other"].map((l) => (
            <button
              key={l}
              onClick={() => setNewAddress({ ...newAddress, label: l })}
              className={`px-3 py-1 rounded-full border ${
                newAddress.label === l ? "bg-green-600 text-white" : ""
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Delivery instructions"
          className="input"
          value={newAddress.instructions}
          onChange={(e) =>
            setNewAddress({ ...newAddress, instructions: e.target.value })
          }
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newAddress.isDefault}
            onChange={(e) =>
              setNewAddress({ ...newAddress, isDefault: e.target.checked })
            }
          />
          Set as default
        </label>
      </div>

      {/* ORDER SUMMARY */}
      <div className="border rounded p-4 bg-gray-50">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">₹{grandTotal}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default Address;
