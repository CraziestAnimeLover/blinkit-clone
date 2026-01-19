import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { socket } from "../../socket.js";
import scootyImg from "../../assets/binkitscooter.jpg";
import customerImg from "../../assets/binkitscooter.jpg";

// ================= ICONS =================
// Scooty icon for delivery partner
const deliveryIcon = new L.Icon({
  iconUrl: scootyImg,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -15],
  shadowUrl: null,
});



// Customer house icon
const customerIcon = new L.Icon({
  iconUrl: customerImg,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -10],
  shadowUrl: null,
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
  const progressRef = useRef(0);
  const animationRef = useRef(null);

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
        ).then((r) => r.json());

        if (!res.routes || res.routes.length === 0) return;

        const coords = res.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        setRoute(coords);
        progressRef.current = 0; // reset animation
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
    if (!route.length || !markerRef.current) return;

    const animate = () => {
      if (progressRef.current < route.length) {
        const nextIndex = Math.floor(progressRef.current);
        markerRef.current.setLatLng(route[nextIndex]);
        progressRef.current += 0.05;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationRef.current);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, [route]);

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

        {/* Delivery marker (Scooty) */}
        {route.length > 0 && (
          <Marker ref={markerRef} position={route[0]} icon={deliveryIcon}>
            <Popup>🏍️ Delivery Partner <br /> ETA: {eta ? `${eta} min` : "Calculating..."}</Popup>
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
