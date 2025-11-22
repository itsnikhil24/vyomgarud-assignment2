// src/components/MapDisplay.jsx
import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon bug in Leaflet when using React
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapDisplay = ({ lat, lon }) => {
  const position = [lat, lon];

  return (
    <div className="bg-card-bg border border-border rounded-xl p-4 shadow-xl flex flex-col h-full">
      <div className="flex items-center text-sm font-semibold text-text-secondary mb-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243" />
        </svg>
        <span className="ml-2 uppercase tracking-wider">Position</span>
      </div>

      {/* Leaflet Map */}
      <div className="grow rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          {/* Dark Map (Carto Dark Matter) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Moving Marker */}
          <Marker position={position} icon={markerIcon}></Marker>
        </MapContainer>
      </div>

      {/* Coordinates */}
      <div className="text-xs text-[#4c84ff] mt-2 font-mono">
        LAT: <span className="text-white">{lat.toFixed(5)}°</span> |
        LON: <span className="text-white">{lon.toFixed(5)}°</span>
      </div>
    </div>
  );
};

export default MapDisplay;
