import { Marker, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";

const SmoothMarker = ({ position }) => {
  const markerRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (!position || !markerRef.current) return;

    const marker = markerRef.current;
    const start = marker.getLatLng();
    const end = L.latLng(position.lat, position.lng);

    const duration = 500;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);

      const lat = start.lat + (end.lat - start.lat) * progress;
      const lng = start.lng + (end.lng - start.lng) * progress;

      marker.setLatLng([lat, lng]);

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    map.panTo(end, { animate: true, duration: 0.5 });

  }, [position]);

  return (
    <Marker
      ref={markerRef}
      position={[position.lat, position.lng]}
    />
  );
};

export default SmoothMarker;
