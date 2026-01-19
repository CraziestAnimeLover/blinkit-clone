// LiveMap.jsx
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
});

// Smooth fly-to
const MapFlyTo = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], map.getZoom(), { duration: 1 });
  }, [lat, lng, map]);
  return null;
};

const LiveMap = ({ customerLat, customerLng, deliveryLat, deliveryLng, address }) => {
  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState(null);
  const lastRoutePosRef = useRef(null);

  // Fetch route when delivery moves
  useEffect(() => {
    if (!deliveryLat || !deliveryLng || !customerLat || !customerLng) return;

    const last = lastRoutePosRef.current;
    const dist = (lat1, lng1, lat2, lng2) => {
      const R = 6371000;
      const toRad = (deg) => (deg * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    if (last && dist(last.lat, last.lng, deliveryLat, deliveryLng) < 50 && route.length) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${deliveryLng},${deliveryLat};${customerLng},${customerLat}?overview=full&geometries=geojson`
        ).then((r) => r.json());

        const coords = res.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(coords);
        setEta(Math.ceil(res.routes[0].duration / 60));
        lastRoutePosRef.current = { lat: deliveryLat, lng: deliveryLng };
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [deliveryLat, deliveryLng, customerLat, customerLng, route.length]);

  if (!deliveryLat || !deliveryLng) return <p>Waiting for GPS signal...</p>;

  return (
    <div className="h-72 w-full rounded border mt-3">
      <MapContainer center={[deliveryLat, deliveryLng]} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapFlyTo lat={deliveryLat} lng={deliveryLng} />

        <Marker position={[deliveryLat, deliveryLng]} icon={deliveryIcon}>
          <Popup>🚴 On the way! <br /> ETA: {eta ? `${eta} min` : "Calculating..."}</Popup>
        </Marker>

        <Marker position={[customerLat, customerLng]}>
          <Popup>{address}</Popup>
        </Marker>

        {route.length > 0 && <Polyline positions={route} color="blue" weight={5} />}
      </MapContainer>

      {eta && <p className="text-center mt-2 font-semibold text-green-600">⏱ ETA: {eta} minutes</p>}
    </div>
  );
};

export default LiveMap;
