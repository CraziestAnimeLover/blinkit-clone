import React, { useEffect, useState, useContext } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Address = () => {
  const { cart, total } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const DELIVERY_CHARGE = 25;
  const HANDLING_CHARGE = 2;
  const SMALL_CART_CHARGE = 20;
  const grandTotal = total + DELIVERY_CHARGE + HANDLING_CHARGE + SMALL_CART_CHARGE;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({ name: "", line1: "", city: "", state: "", zip: "" });
  const [loading, setLoading] = useState(true);

  // Format address object to string
  const formatAddress = (addr) => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;
    return `${addr.line1 || ""}, ${addr.city || ""}, ${addr.state || ""} - ${addr.zip || ""}`.trim();
  };

  // Fetch saved addresses
  useEffect(() => {
    if (!user) return;

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const safeAddresses = res.data.addresses?.filter(addr => addr) || [];
        setAddresses(safeAddresses);
        if (safeAddresses.length) setSelectedAddress(safeAddresses[0]._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const handlePlaceOrder = async () => {
  if (!selectedAddress && !newAddress.line1) {
    alert("Please select or enter an address");
    return;
  }

  let addressToUse;

  if (selectedAddress) {
    addressToUse = addresses.find(a => a && a._id === selectedAddress);
    if (!addressToUse) {
      alert("Selected address is invalid");
      return;
    }
  } else {
    addressToUse = newAddress;

    // Save new address first
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/addresses`,
        addressToUse,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.address || !res.data.address._id) {
        alert("Failed to save new address");
        return;
      }

      addressToUse = res.data.address;
      setAddresses(prev => [...prev, addressToUse]);
      setSelectedAddress(addressToUse._id);
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
      return;
    }
  }

  // Format address for backend
  const formattedAddress = `${addressToUse.line1 || ""}, ${addressToUse.city || ""}, ${addressToUse.state || ""} - ${addressToUse.zip || ""}`;

  // Place order
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
      {
        items: cart.map(i => ({ product: i._id, quantity: i.quantity, price: i.price })),
        address: formattedAddress,
        totalAmount: total + DELIVERY_CHARGE + HANDLING_CHARGE + SMALL_CART_CHARGE,
        paymentMethod: "COD",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate(`/payment/${response.data.order._id}`);
  } catch (err) {
    console.error(err);
    alert("Failed to place order");
  }
};
  if (!user || loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Delivery Address</h1>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Saved Addresses</h2>
          {addresses.map((addr, idx) => (
            addr && (
              <div key={addr._id || idx} className="border p-4 rounded mb-2 flex items-center">
                <input
                  type="radio"
                  name="address"
                  value={addr._id}
                  checked={selectedAddress === addr._id}
                  onChange={() => setSelectedAddress(addr._id)}
                  className="mr-2"
                />
                <div>
                  <p className="font-semibold">{addr.name}</p>
                  <p>{addr.line1}, {addr.city}, {addr.state} - {addr.zip}</p>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Add New Address */}
      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Add New Address</h2>
        <input
          type="text"
          placeholder="Address Name"
          value={newAddress.name}
          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Line 1"
          value={newAddress.line1}
          onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="City"
          value={newAddress.city}
          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="State"
          value={newAddress.state}
          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="ZIP"
          value={newAddress.zip}
          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
      </div>

      {/* Order Summary */}
      <div className="border rounded-lg p-4 mb-6 bg-gray-50 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery Charge</span>
          <span>₹{DELIVERY_CHARGE}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Handling Charge</span>
          <span>₹{HANDLING_CHARGE}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Small Cart Charge</span>
          <span>₹{SMALL_CART_CHARGE}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {/* Place Order */}
      <button
        onClick={handlePlaceOrder}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default Address;
