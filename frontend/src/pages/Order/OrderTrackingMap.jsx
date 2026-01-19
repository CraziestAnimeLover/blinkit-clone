import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { socket } from "../../socket.js"; // import your shared socket

// ================= ICON SETUP =================
const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
});

// ================= MAP UPDATER =================
const MapUpdater = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (lat != null && lng != null) {
      map.flyTo([lat, lng], map.getZoom(), { duration: 1 });
    }
  }, [lat, lng]);

  return null;
};

// ================= SMOOTH & BLINKING MARKER =================
const SmoothMarker = ({ position }) => {
  const markerRef = useRef();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!position || position.lat == null || position.lng == null) return;

    const interval = setInterval(() => setVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, [position]);

  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLatLng([position.lat, position.lng]);
      setVisible(true); // ensure marker visible after move
    }
  }, [position]);

  if (!position || position.lat == null || position.lng == null || !visible) return null;

  return (
    <Marker ref={markerRef} position={[position.lat, position.lng]} icon={icon}>
      <Popup>
        {position ? "🚴 Delivery Partner is here" : "Waiting for delivery partner..."}
      </Popup>
    </Marker>
  );
};

// ================= MAIN COMPONENT =================
const OrderTrackingMap = ({ orderId }) => {
  const [location, setLocation] = useState(null);
  const [connected, setConnected] = useState(socket.connected);

  // Fallback coordinates while waiting
  const fallback = { lat: 37.7749, lng: -122.4194 };

  useEffect(() => {
    if (!orderId) return;

    console.log("📦 Tracking order:", orderId);

    // Join the order room
    socket.emit("joinOrder", orderId);

    // Listen for live location updates
    const handleLocationUpdate = (data) => {
      if (data && data.lat != null && data.lng != null) {
        console.log("📡 Live location:", data);
        setLocation(data);
      }
    };

    const handleConnect = () => {
      console.log("✅ Connected to server");
      setConnected(true);
      socket.emit("joinOrder", orderId); // rejoin room on reconnect
    };

    const handleDisconnect = () => {
      console.log("⚠️ Disconnected from server");
      setConnected(false);
    };

    socket.on("locationUpdate", handleLocationUpdate);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("locationUpdate", handleLocationUpdate);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [orderId]);

  if (!connected) return <p className="text-center p-4">Reconnecting to server...</p>;

  // Use location if available, otherwise fallback
  const markerPosition = location || fallback;

  return (
    <MapContainer
      center={[markerPosition.lat, markerPosition.lng]}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapUpdater lat={markerPosition.lat} lng={markerPosition.lng} />
      <SmoothMarker position={markerPosition} />
    </MapContainer>
  );
};

export default OrderTrackingMap;
