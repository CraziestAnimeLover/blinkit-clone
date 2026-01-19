// OrderTrackingMap.jsx
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { socket } from "../../socket.js";

// ================= ICONS =================
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
});
const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  iconSize: [30, 30],
});

// ================= MAP FLY TO =================
const MapFlyTo = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], map.getZoom(), { duration: 0.5 });
  }, [lat, lng]);
  return null;
};

// ================= MAIN COMPONENT =================
const OrderTrackingMap = ({ orderId, customerLat, customerLng }) => {
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState(null);
  const markerRef = useRef(null);
  const progressRef = useRef(0); // progress along route

  const fallback = { lat: customerLat || 37.7749, lng: customerLng || -122.4194 };

  // ================= SOCKET: live delivery location =================
useEffect(() => {
  if (!orderId) return;

  socket.emit("joinOrder", orderId);

  const handleLocationUpdate = (data) => {
    if (data?.lat != null && data?.lng != null) setDeliveryLocation(data);
  };

  socket.on("locationUpdate", handleLocationUpdate);

  return () => {
    socket.off("locationUpdate", handleLocationUpdate);
    socket.emit("leaveOrder", orderId);
  };
}, [orderId]);


  // ================= FETCH ROUTE =================
  useEffect(() => {
    if (!deliveryLocation || !customerLat || !customerLng) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${deliveryLocation.lng},${deliveryLocation.lat};${customerLng},${customerLat}?overview=full&geometries=geojson`
        ).then(r => r.json());

        if (!res.routes || res.routes.length === 0) return;

        const coords = res.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        if (coords.length >= 2) setRoute(coords);
        const durationInMin = Math.ceil(res.routes[0].duration / 60);
        setEta(durationInMin);
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [deliveryLocation, customerLat, customerLng]);

  // ================= ANIMATE MARKER =================
  useEffect(() => {
    if (!route.length || !deliveryLocation || !markerRef.current) return;

    const moveMarker = () => {
      const nextIndex = Math.min(Math.floor(progressRef.current), route.length - 1);
      markerRef.current.setLatLng(route[nextIndex]);
      progressRef.current += 0.05; // speed of animation
      if (progressRef.current < route.length) {
        requestAnimationFrame(moveMarker);
      }
    };

    moveMarker();
  }, [route, deliveryLocation]);

  // ================= TRAIL POLYLINE =================
  const trail = route.slice(0, Math.floor(progressRef.current) + 1);

  return (
    <div>
      <MapContainer
        center={[fallback.lat, fallback.lng]}
        zoom={15}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapFlyTo lat={deliveryLocation?.lat || fallback.lat} lng={deliveryLocation?.lng || fallback.lng} />

        {/* Full route */}
        {route.length > 1 && <Polyline positions={route} color="blue" weight={5} />}

        {/* Trail showing progress */}
        {trail.length > 1 && <Polyline positions={trail} color="green" weight={5} />}

        {/* Delivery marker */}
        {route.length > 0 && (
          <Marker ref={markerRef} position={route[0]} icon={deliveryIcon}>
            <Popup>🚴 Delivery Partner <br /> ETA: {eta ? `${eta} min` : "Calculating..."}</Popup>
          </Marker>
        )}

        {/* Customer marker */}
        {customerLat && customerLng && (
          <Marker position={[customerLat, customerLng]} icon={customerIcon}>
            <Popup>🏠 Customer Location</Popup>
          </Marker>
        )}
      </MapContainer>

      {eta && <p className="text-center mt-2 font-semibold text-green-600">⏱ ETA: {eta} min</p>}
    </div>
  );
};

export default OrderTrackingMap;
