import React, { useEffect, useRef } from 'react';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet-routing-machine';
import L from 'leaflet';

const RoutingMachine = ({ positions }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || positions.length < 2) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const waypoints = [];

    for (let i = 0; i < positions.length; i++) {
      waypoints.push(L.latLng(positions[i][0], positions[i][1]));
    }

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
      lineOptions: {
        styles: [{ color: 'blue', weight: 5, opacity: 0.7 }],
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => {
        return null;
      },
    }).addTo(map);

    routingControlRef.current = routingControl;

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, positions]);
};

const RouteMapViewer = ({ haltsA, haltsB, activeDirection, onClose }) => {
  const getValidPositions = (halts) => {
    const positions = [];

    for (let i = 0; i < halts.length; i++) {
      const halt = halts[i];
      const lat = halt.latitude;
      const lng = halt.longitude;

      if (lat !== '' && lng !== '' && lat !== null && lng !== null) {
        positions.push([Number(lat), Number(lng)]);
      }
    }

    return positions;
  };

  const positionsA = getValidPositions(haltsA);
  const positionsB = getValidPositions(haltsB);

  const activePosition = activeDirection === 'A' ? positionsA : positionsB;

  const startPosition = activePosition.length > 0 ? activePosition[0] : null;
  const endPosition =
    activePosition.length > 0
      ? activePosition[activePosition.length - 1]
      : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Route Map - Direction {activeDirection}
        </h3>

        {activePosition.length >= 2 ? (
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

              <RoutingMachine positions={activePosition} />

              {startPosition && (
                <Marker position={startPosition}>
                  <Popup>Start</Popup>
                </Marker>
              )}

              {endPosition && (
                <Marker position={endPosition}>
                  <Popup>End</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-700">
              Not enough data to show route on map. Add at least 2 halts
              coordinates to see.
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
        </div>
      </div>
    </div>
  );
};

export default RouteMapViewer;
