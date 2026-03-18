import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG train icon
const trainIcon = L.divIcon({
    className: '',
    html: `<div style="
    width:44px;height:44px;background:#1565c0;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 0 8px rgba(21,101,192,0.25);
    font-size:22px;
  ">🚂</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
});

export default function TrainMap({ train }) {
    const { lat, lon, trainName, trainNo, currentStation, speed } = train;

    return (
        <div style={{ borderRadius: 20, overflow: 'hidden', height: 460, border: '1px solid var(--border)' }}>
            <MapContainer
                center={[lat, lon]}
                zoom={9}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                    subdomains="abcd"
                    maxZoom={19}
                />

                {/* Accuracy radius */}
                <Circle
                    center={[lat, lon]}
                    radius={5000}
                    pathOptions={{ color: '#1565c0', fillColor: '#1565c0', fillOpacity: 0.08, weight: 1 }}
                />

                {/* Train marker */}
                <Marker position={[lat, lon]} icon={trainIcon}>
                    <Popup>
                        <div style={{ fontFamily: 'Outfit, sans-serif', minWidth: 180 }}>
                            <strong>{trainNo} — {trainName}</strong><br />
                            📍 {currentStation}<br />
                            ⚡ {speed} km/h
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
