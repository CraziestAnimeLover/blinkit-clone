import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { socket } from "../socket"; // same socket instance used in customer side

// Marker icon
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
});

// Auto move map
const MapUpdater = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom(), { duration: 1 });
    }
  }, [lat, lng, map]);

  return null;
};

const LiveMap = ({ customerLat, customerLng, address, orderId }) => {
  const [deliveryLat, setDeliveryLat] = useState(null);
  const [deliveryLng, setDeliveryLng] = useState(null);
  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState(null);

  // ================ SEND LIVE LOCATION =================
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeliveryLat(latitude);
        setDeliveryLng(longitude);

        // Send location to server
        socket.emit("updateLocation", {
          orderId,
          lat: latitude,
          lng: longitude,
        });
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [orderId]);

  // ================ FETCH ROUTE =================
  useEffect(() => {
    if (!deliveryLat || !deliveryLng || !customerLat || !customerLng) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${deliveryLng},${deliveryLat};${customerLng},${customerLat}?overview=full&geometries=geojson`
        ).then((r) => r.json());

        const coords = res.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(coords);
        setEta(Math.ceil(res.routes[0].duration / 60));
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [deliveryLat, deliveryLng, customerLat, customerLng]);

  if (!deliveryLat || !deliveryLng) return <p>Waiting for GPS signal...</p>;

  return (
    <div className="h-72 w-full rounded border mt-3">
      <MapContainer center={[deliveryLat, deliveryLng]} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater lat={deliveryLat} lng={deliveryLng} />

        {/* Delivery marker */}
        <Marker position={[deliveryLat, deliveryLng]} icon={deliveryIcon}>
          <Popup>🚴 You are here <br /> ETA: {eta ? `${eta} min` : "Calculating..."}</Popup>
        </Marker>

        {/* Customer marker */}
        <Marker position={[customerLat, customerLng]}>
          <Popup>{address}</Popup>
        </Marker>

        {/* Route */}
        {route.length > 0 && <Polyline positions={route} color="blue" weight={5} />}
      </MapContainer>

      {eta && <p className="text-center mt-2 font-semibold text-green-600">⏱ ETA: {eta} minutes</p>}
    </div>
  );
};

export default LiveMap;
