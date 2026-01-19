import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { socket } from "../../socket.js";

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

// ================= MARKER ALONG ROUTE =================
const RouteFollowerMarker = ({ route }) => {
  const markerRef = useRef();
  const indexRef = useRef(0);

  useEffect(() => {
    if (!route || route.length === 0 || !markerRef.current) return;

    let animationFrame;
    const speed = 0.0005; // movement speed (adjust to your liking)

    const moveAlongRoute = () => {
      if (indexRef.current >= route.length - 1) return;

      const [lat1, lng1] = route[indexRef.current];
      const [lat2, lng2] = route[indexRef.current + 1];

      const latDiff = lat2 - lat1;
      const lngDiff = lng2 - lng1;

      let progress = 0;

      const step = () => {
        progress += speed;
        if (progress >= 1) {
          indexRef.current += 1;
          progress = 0;
        }

        const lat = lat1 + latDiff * progress;
        const lng = lng1 + lngDiff * progress;

        markerRef.current.setLatLng([lat, lng]);
        animationFrame = requestAnimationFrame(step);
      };

      step();
    };

    moveAlongRoute();

    return () => cancelAnimationFrame(animationFrame);
  }, [route]);

  if (!route || route.length === 0) return null;

  return (
    <Marker ref={markerRef} position={route[0]} icon={icon}>
      <Popup>🚴 Delivery Partner</Popup>
    </Marker>
  );
};

// ================= MAIN COMPONENT =================
const OrderTrackingMap = ({ orderId, customerLat, customerLng }) => {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState(null);

  const fallback = { lat: customerLat || 37.7749, lng: customerLng || -122.4194 };

  // Listen for live location via socket
  useEffect(() => {
    if (!orderId) return;

    socket.emit("joinOrder", orderId);

    const handleLocationUpdate = (data) => {
      if (data?.lat != null && data?.lng != null) setLocation(data);
    };

    socket.on("locationUpdate", handleLocationUpdate);

    return () => {
      socket.off("locationUpdate", handleLocationUpdate);
      socket.emit("leaveOrder", orderId);
    };
  }, [orderId]);

  // Fetch route whenever location updates
  useEffect(() => {
    if (!location || !customerLat || !customerLng) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${customerLng},${customerLat}?overview=full&geometries=geojson`
        ).then((r) => r.json());

        const coords = res.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(coords);
        setEta(Math.ceil(res.routes[0].duration / 60));
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [location, customerLat, customerLng]);

  return (
    <div>
      <MapContainer
        center={[fallback.lat, fallback.lng]}
        zoom={15}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater lat={location?.lat || fallback.lat} lng={location?.lng || fallback.lng} />

        {/* Route Polyline */}
        {route.length > 0 && <Polyline positions={route} color="blue" weight={5} />}

        {/* Marker following the route */}
        {route.length > 0 && <RouteFollowerMarker route={route} />}

        {/* Customer Marker */}
        {customerLat && customerLng && (
          <Marker position={[customerLat, customerLng]}>
            <Popup>🏠 Customer Location</Popup>
          </Marker>
        )}
      </MapContainer>

      {eta && <p className="text-center mt-2 font-semibold text-green-600">⏱ ETA: {eta} min</p>}
    </div>
  );
};

export default OrderTrackingMap;
