import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';

const ClickMap = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      console.log('You clicked at:', e.latlng);

      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const SingleMarker = ({ position }) => {
  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected location</Popup>
    </Marker>
  );
};

const SearchControl = ({ onSearchResult }) => {
  const map = useMap();

  useEffect(() => {
    const SearchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider({
        params: {
          countrycodes: 'lk',
        },
      }),
      style: 'bar',
      autoClose: true,
      keepResult: true,
      showMarker: false,
      notFoundMessage: 'Sorry, that address could not be found.',
    });

    map.addControl(SearchControl);

    map.on('geosearch/showlocation', (result) => {
      if (onSearchResult) {
        onSearchResult(result.location.y, result.location.x);
      }
    });

    return () => {
      map.off('geosearch/showlocation');
      map.removeControl(SearchControl);
    };
  }, [map, onSearchResult]);

  return null;
};

const MapPicker = ({ onSelectLocation, onClose }) => {
  const [tempCoords, setTempCoords] = useState(null);

  const handleConfirm = () => {
    if (tempCoords) {
      onSelectLocation(tempCoords.lat, tempCoords.lng);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Select Bus Halt Location
        </h3>

        <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
          <MapContainer
            center={[7.8731, 80.7718]}
            zoom={8}
            scrollWheelZoom={true}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SearchControl
              onSearchResult={(lat, lng) => setTempCoords({ lat, lng })}
            />
            <ClickMap
              onLocationSelect={(lat, lng) => setTempCoords({ lat, lng })}
            />
            <SingleMarker
              position={tempCoords ? [tempCoords.lat, tempCoords.lng] : null}
            />
          </MapContainer>
        </div>

        {tempCoords && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-700">
              <strong>Selected:</strong> Lat: {tempCoords.lat}, Lng:{' '}
              {tempCoords.lng}
            </p>
          </div>
        )}

        <div className="flex justify-end mt-4 gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md 
            hover:shadow-gray-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Close
          </button>
          <button
            onClick={handleConfirm}
            disabled={!tempCoords}
            className="px-6 py-2 rounded-full bg-yellow-200 hover:bg-yellow-300 shadow-md 
            hover:shadow-yellow-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
