import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Optional: custom icons
const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  iconSize: [30, 30],
});
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [30, 30],
});

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);

  if (!order)
    return (
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold">No Order Found</h1>
        <Link to="/" className="text-green-600 underline mt-2 block">
          Go Back Home
        </Link>
      </div>
    );

  // Set customer location once
  useEffect(() => {
    if (order.customerLat && order.customerLng) {
      setCustomerLocation({ lat: order.customerLat, lng: order.customerLng });
    }
  }, [order]);

  // Fetch delivery boy location every 5 seconds
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/orders/${order._id}/location`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDeliveryLocation(res.data.location);
      } catch (err) {
        console.error("Failed to fetch delivery location", err);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [order._id, BACKEND_URL, token]);

  // Map center logic
  const mapCenter =
    deliveryLocation || customerLocation
      ? [
          (deliveryLocation?.lat || 0 + customerLocation?.lat || 0) / 2,
          (deliveryLocation?.lng || 0 + customerLocation?.lng || 0) / 2,
        ]
      : [20, 77]; // default center

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">🎉 Order Confirmed!</h1>
      <p>
        <strong>Order ID:</strong> {order._id}
      </p>
      <p>
        <strong>Total:</strong> ₹{order.totalAmount}
      </p>
      <p>
        <strong>Address:</strong> {order.address}
      </p>
      <p className="mt-4">Thank you for shopping with us!</p>

      {customerLocation && (
        <div className="mt-6 h-80">
          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Customer Marker */}
            <Marker position={[customerLocation.lat, customerLocation.lng]} icon={customerIcon}>
              <Popup>Customer Location</Popup>
            </Marker>

            {/* Delivery Marker */}
            {deliveryLocation && (
              <Marker position={[deliveryLocation.lat, deliveryLocation.lng]} icon={deliveryIcon}>
                <Popup>Delivery Boy Current Location</Popup>
              </Marker>
            )}

            {/* Line between customer and delivery boy */}
            {deliveryLocation && (
              <Polyline
                positions={[
                  [customerLocation.lat, customerLocation.lng],
                  [deliveryLocation.lat, deliveryLocation.lng],
                ]}
                color="blue"
              />
            )}
          </MapContainer>
        </div>
      )}

      <Link
        to="/my-orders"
        className="inline-block mt-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        View My Orders
      </Link>
    </div>
  );
};

export default OrderConfirmation;
