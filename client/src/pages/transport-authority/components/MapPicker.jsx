import React from 'react';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';

const ClickMap = () => {
  const [position, setPosition] = React.useState(null);

  useMapEvents({
    click: (e) => {
      console.log('You clicked at:', e.latlng);
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You clicked here!</Popup>
    </Marker>
  );
};

const MapPicker = () => {
  return (
    <div>
      <div
        style={{
          height: '400px',
          width: '100%',
          marginTop: '20px',
          border: '2px solid red',
        }}
      >
        <MapContainer
          center={[7.8731, 80.7718]}
          zoom={8}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickMap />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPicker;
