import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function VenueMap({ venues }) {
  // Center of Addis Ababa
  const center = [9.0300, 38.7400];

  return (
    <div className="h-[500px] w-full rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {venues.map((venue) => (
          <Marker 
            key={venue._id} 
            position={[venue.coordinates?.lat || 9.0300, venue.coordinates?.lng || 38.7400]}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <img src={venue.image} alt={venue.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                <h3 className="font-bold text-zinc-900">{venue.name}</h3>
                <p className="text-sm text-zinc-600">{venue.category}</p>
                <p className="text-yellow-600 font-bold">⭐ {venue.rating}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default VenueMap;
