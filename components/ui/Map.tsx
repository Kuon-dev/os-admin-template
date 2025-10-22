'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface MapComponentProps {
  center?: LatLngExpression;
  zoom?: number;
  markerText?: string;
  className?: string;
}

// Dynamic MapView component that uses react-leaflet
function MapView({ center, zoom = 13, markerText, className }: MapComponentProps) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center as LatLngExpression}>
          {markerText && (
            <Popup>
              <div className="font-body text-sm">{markerText}</div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}

// Dynamically import to avoid SSR issues
const DynamicMap = dynamic(() => Promise.resolve(MapView), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-muted">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

// Generate random coordinates around Paris (example location)
function generateRandomLocation(): LatLngExpression {
  // Paris coordinates: ~48.8566° N, 2.3522° E
  // Add some randomness (±0.1 degrees = ~11km variance)
  const lat = 48.8566 + (Math.random() - 0.5) * 0.2;
  const lng = 2.3522 + (Math.random() - 0.5) * 0.2;
  return [lat, lng];
}

export function Map({
  center,
  zoom = 13,
  markerText = 'We are here!',
  className = 'h-[400px] w-full rounded-lg overflow-hidden'
}: MapComponentProps) {
  const [location, setLocation] = useState<LatLngExpression>([48.8566, 2.3522]);

  useEffect(() => {
    // Generate random location on client side
    setLocation(center || generateRandomLocation());
  }, [center]);

  return (
    <DynamicMap
      center={location}
      zoom={zoom}
      markerText={markerText}
      className={className}
    />
  );
}
