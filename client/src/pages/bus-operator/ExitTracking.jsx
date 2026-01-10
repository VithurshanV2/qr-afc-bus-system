import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import { ArrowBigLeft, MoveLeft, MoveRight } from 'lucide-react';

const ExitTracking = () => {
  const { backendUrl } = useContext(AppContext);

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [currentHaltIndex, setCurrentHaltIndex] = useState(0);
  const [halts, setHalts] = useState([]);
  const [exitCounts, setExitCounts] = useState({});

  const selectedBus = buses.find((bus) => bus.id === selectedBusId);

  const fetchBusesWithActiveTrips = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendUrl + '/api/trip/operator-buses');

      if (data.success) {
        const activeBuses = data.buses.filter(
          (bus) => bus.Trip && bus.Trip.length > 0,
        );
        setBuses(activeBuses);

        if (activeBuses.length > 0 && !selectedBusId) {
          setSelectedBusId(activeBuses[0].id);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const loadHaltsForSelectedBus = () => {
    if (!selectedBus || !selectedBus.Trip || selectedBus.Trip.length === 0) {
      setHalts([]);
      setCurrentHaltIndex(0);
      return;
    }

    const activeTrip = selectedBus.Trip[0];
    const route = selectedBus.route;

    if (!route) {
      setHalts([]);
      return;
    }

    const haltsData =
      activeTrip.direction === 'DIRECTIONA' ? route.haltsA : route.haltsB;
    setHalts(haltsData.halts);
    setCurrentHaltIndex(0);
  };

  const fetchExitCountsForAllHalts = async () => {
    if (
      !selectedBus ||
      !selectedBus.Trip ||
      selectedBus.Trip.length === 0 ||
      halts.length === 0
    ) {
      return;
    }

    const activeTrip = selectedBus.Trip[0];
    const counts = {};

    try {
      for (let i = 0; i < halts.length; i++) {
        const halt = halts[i];

        const { data } = await axios.get(
          backendUrl + `/api/trip/${activeTrip.id}/next-halt-exit`,
          { params: { currentHaltId: halt.id } },
        );

        if (data.success) {
          if (data.nextHalt) {
            counts[data.nextHalt.id] = data.exitCount;
          } else if (data.isLastHalt) {
            counts[halt.id] = data.exitCount;
          }
        }
      }

      setExitCounts(counts);
    } catch (error) {
      console.error('Failed to fetch exit count', error);
    }
  };

  useEffect(() => {
    fetchBusesWithActiveTrips();
  }, []);

  useEffect(() => {
    loadHaltsForSelectedBus();
  }, [selectedBus]);

  useEffect(() => {
    if (halts.length > 0) {
      fetchExitCountsForAllHalts();
    }
  }, [halts]);

  const handlePreviousHalt = () => {
    if (currentHaltIndex > 0) {
      setCurrentHaltIndex(currentHaltIndex - 1);
    }
  };

  const handleNextHalt = () => {
    if (currentHaltIndex < halts.length - 1) {
      setCurrentHaltIndex(currentHaltIndex + 1);
    }
  };

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Passenger Exit Tracking
        </h2>
        {/* Bus tab */}
        <div className="flex gap-2 mb-6">
          {buses.map((bus) => (
            <button
              key={bus.id}
              onClick={() => setSelectedBusId(bus.id)}
              className={`px-4 py-2 rounded-full transition-all duration-200 transform active:scale-95 active:shadow-lg ${
                selectedBusId === bus.id
                  ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }
            `}
            >
              {bus.registrationNumber} ({bus.requestedBusType || '-'})
            </button>
          ))}
        </div>
        {loading && (
          <div className="flex justify-center py-12">
            <BounceLoader size={40} color="#FFB347" />
          </div>
        )}
        {!loading && buses.length === 0 && (
          <div className="text-center text-gray-700 text-lg py-12">
            No active trips found
          </div>
        )}

        {!loading && buses.length > 0 && selectedBus && (
          <div>
            {/* Bus related info */}
            <div className="border border-gray-200 p-5 rounded-xl mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                {selectedBus.registrationNumber}
              </h3>
              <p className="text-xl font-medium text-gray-700 mb-4">
                {selectedBus.Trip[0]?.direction === 'DIRECTIONA'
                  ? selectedBus.route?.haltsA?.directionName
                  : selectedBus.route?.haltsB.directionName}{' '}
                ({selectedBus.route?.number})
              </p>

              <div className="flex justify-center gap-10 mb-6">
                <div>
                  <label className="text-gray-700 text-sm">Upcoming Halt</label>
                  <p className="text-3xl">
                    {halts[currentHaltIndex + 1]?.englishName ||
                      halts[currentHaltIndex]?.englishName}
                  </p>
                </div>
                <div>
                  <label className="text-gray-700 text-sm">Exit Count</label>
                  <p className="text-3xl">
                    {halts[currentHaltIndex + 1]
                      ? exitCounts[halts[currentHaltIndex + 1].id] || 0
                      : exitCounts[halts[currentHaltIndex]?.id] || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={handlePreviousHalt}
                disabled={currentHaltIndex === 0}
                className={`px-6 py-2 rounded-full transition-all duration-200 transform active:scale-95 active:shadow-lg 
              bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 flex gap-3`}
              >
                <MoveLeft />
                Previous Halt
              </button>
              <button
                onClick={handleNextHalt}
                disabled={currentHaltIndex === halts.length - 1}
                className={`px-6 py-2 rounded-full transition-all duration-200 transform active:scale-95 active:shadow-lg 
              bg-yellow-200 text-yellow-800 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50 flex gap-3`}
              >
                Next Halt
                <MoveRight />
              </button>
            </div>

            {/* Halts table */}
            <div className="border border-gray-200 rounded-xl overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">No</th>
                    <th className="px-4 py-2 text-left">Halt Name</th>
                    <th className="px-4 py-2 text-left">Passengers Exiting</th>
                  </tr>
                </thead>

                <tbody>
                  {halts.length === 0 && (
                    <tr>
                      <td
                        className="py-6 text-gray-700 text-lg text-center"
                        colSpan="3"
                      >
                        No active trip for this bus
                      </td>
                    </tr>
                  )}

                  {halts.map((halt, index) => {
                    const isPassed = index < currentHaltIndex;
                    const isCurrent = index === currentHaltIndex;

                    return (
                      <tr
                        key={halt.id}
                        className={`${isCurrent ? 'bg-yellow-100 font-semibold' : isPassed ? 'bg-gray-50 text-gray-500' : ''}`}
                      >
                        <td className="px-4 py-2">{halt.id}</td>
                        <td className="px-4 py-2">{halt.englishName}</td>
                        <td className="px-4 py-2">
                          {exitCounts[halt.id] || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitTracking;
