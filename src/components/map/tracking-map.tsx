import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";

// Fix Leaflet default marker icons in bundled envs.
const pickupIcon = L.divIcon({
  className: "",
  html: `<div style="width:24px;height:24px;border-radius:9999px;background:#2563EB;box-shadow:0 0 0 4px rgba(37,99,235,.25);display:grid;place-items:center;color:white;font-weight:700;font-size:11px">P</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
const destIcon = L.divIcon({
  className: "",
  html: `<div style="width:24px;height:24px;border-radius:9999px;background:#22C55E;box-shadow:0 0 0 4px rgba(34,197,94,.25);display:grid;place-items:center;color:white;font-weight:700;font-size:11px">D</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
const truckIcon = L.divIcon({
  className: "",
  html: `<div style="width:34px;height:34px;border-radius:12px;background:#F97316;box-shadow:0 4px 12px rgba(0,0,0,.25);display:grid;place-items:center;color:white">🚚</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(points as L.LatLngBoundsLiteral, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export function TrackingMap({
  pickup,
  destination,
  progress = 0.4,
  height = 380,
}: {
  pickup: { lat: number; lng: number; label?: string };
  destination: { lat: number; lng: number; label?: string };
  progress?: number;
  height?: number;
}) {
  const route = useMemo<[number, number][]>(() => {
    // build a slight curve between pickup and destination
    const steps = 40;
    const pts: [number, number][] = [];
    const midLat = (pickup.lat + destination.lat) / 2 + (destination.lng - pickup.lng) * 0.05;
    const midLng = (pickup.lng + destination.lng) / 2 - (destination.lat - pickup.lat) * 0.05;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = (1 - t) * (1 - t) * pickup.lat + 2 * (1 - t) * t * midLat + t * t * destination.lat;
      const lng = (1 - t) * (1 - t) * pickup.lng + 2 * (1 - t) * t * midLng + t * t * destination.lng;
      pts.push([lat, lng]);
    }
    return pts;
  }, [pickup.lat, pickup.lng, destination.lat, destination.lng]);

  const [t, setT] = useState(progress);
  useEffect(() => {
    const id = window.setInterval(() => {
      setT((prev) => (prev >= 0.98 ? progress : Math.min(0.98, prev + 0.005)));
    }, 400);
    return () => window.clearInterval(id);
  }, [progress]);

  const truckPos = route[Math.min(route.length - 1, Math.floor(t * (route.length - 1)))]!;

  return (
    <div className="overflow-hidden rounded-2xl border" style={{ height }}>
      <MapContainer
        center={[(pickup.lat + destination.lat) / 2, (pickup.lng + destination.lng) / 2]}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={route} pathOptions={{ color: "#2563EB", weight: 4, opacity: 0.7, dashArray: "6 8" }} />
        <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />
        <Marker position={[destination.lat, destination.lng]} icon={destIcon} />
        <Marker position={truckPos} icon={truckIcon} />
        <FitBounds points={[[pickup.lat, pickup.lng], [destination.lat, destination.lng]]} />
      </MapContainer>
    </div>
  );
}