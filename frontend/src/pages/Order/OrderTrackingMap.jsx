import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { socket } from "../../socket.js"; // shared socket

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

// ================= SMOOTH MARKER =================
const SmoothMarker = ({ position }) => {
  const markerRef = useRef();
  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLatLng([position.lat, position.lng]);
    }
  }, [position]);

  if (!position || position.lat == null || position.lng == null) return null;

  return (
    <Marker ref={markerRef} position={[position.lat, position.lng]} icon={icon}>
      <Popup>🚴 Delivery Partner is here</Popup>
    </Marker>
  );
};

// ================= MAIN COMPONENT =================
const OrderTrackingMap = ({ orderId, customerLat, customerLng }) => {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState(null);

  // Fallback coordinates
  const fallback = { lat: customerLat || 37.7749, lng: customerLng || -122.4194 };

  useEffect(() => {
    if (!orderId) return;

    // Join the order room
    socket.emit("joinOrder", orderId);

    // Listen for live location updates
    const handleLocationUpdate = (data) => {
      if (data && data.lat != null && data.lng != null) {
        setLocation(data);
      }
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

  const markerPosition = location || fallback;

  return (
    <div>
      <MapContainer
        center={[markerPosition.lat, markerPosition.lng]}
        zoom={15}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater lat={markerPosition.lat} lng={markerPosition.lng} />
        <SmoothMarker position={markerPosition} />

        {/* Customer marker */}
        {customerLat && customerLng && (
          <Marker position={[customerLat, customerLng]}>
            <Popup>🏠 Customer Location</Popup>
          </Marker>
        )}

        {/* Route */}
        {route.length > 0 && <Polyline positions={route} color="blue" weight={5} />}
      </MapContainer>

      {eta && <p className="text-center mt-2 font-semibold text-green-600">⏱ ETA: {eta} min</p>}
    </div>
  );
};

export default OrderTrackingMap;
