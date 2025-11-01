import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../../context/AppContext';
import { CommuterContext } from '../../../context/CommuterContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';

const DestinationSelection = () => {
  const { backendUrl } = useContext(AppContext);
  const { activeTicket, boardingHalt, setScanStep, setActiveTicket } =
    useContext(CommuterContext);

  const [loading, setLoading] = useState(false);
  const [upcomingHalts, setUpcomingHalts] = useState([]);
  const [selectedHalt, setSelectedHalt] = useState(null);

  // Fetch upcoming destination halts
  useEffect(() => {
    const fetchHalts = async () => {
      if (!activeTicket) {
        return;
      }

      setLoading(true);

      try {
        axios.defaults.withCredentials = true;

        const { data } = await axios.get(
          backendUrl + `/api/ticket/upcoming-halts/${activeTicket.id}`,
        );

        if (data.success) {
          setUpcomingHalts(data.upcomingHalts);
        } else {
          toast.error(data.message || 'Failed to fetch upcoming halts');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchHalts();
  }, [backendUrl, activeTicket]);

  // selecting a destination halt
  const selectDestinationHalt = async (halt) => {
    if (!activeTicket) {
      return;
    }

    setSelectedHalt(halt.id);
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + `/api/ticket/destination-halt/${activeTicket.id}`,
        { destinationHalt: halt },
      );

      if (data.success) {
        setActiveTicket(data.ticket);
        toast.success(
          data.message || 'Destination halt is selected successfully ',
        );
        setScanStep(3);
      } else {
        toast.error(data.message || 'Failed to select destination halt');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="destination"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-gray-900 text-2xl font-semibold text-center mb-4">
        Select Your Destination Halt
      </h2>

      {/* Trip info */}
      {activeTicket && (
        <div className=" text-gray-700 mb-4">
          <p className="mb-1">
            <span className="font-semibold text-gray-900">Route:</span>{' '}
            {activeTicket.trip?.route?.name} - (
            {activeTicket.trip?.route?.number})
          </p>
          <p>
            <span className="font-semibold text-gray-900">Boarding Halt:</span>{' '}
            {boardingHalt.replace(/\((.*?)\)/g, '')}
          </p>
        </div>
      )}

      {/* Destination halt list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <BounceLoader size={60} color="#FFB347" />
          <p className="mt-2 text-gray-700 font-medium">
            Loading upcoming halts...
          </p>
        </div>
      ) : (
        <div
          className="max-h-72 overflow-y-auto flex flex-col gap-3 mt-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          {upcomingHalts.length > 0 ? (
            upcomingHalts.map((halt) => (
              <button
                key={halt.id}
                onClick={() => selectDestinationHalt(halt)}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl boarder transition-all duration-200 
                  ${
                    selectedHalt === halt.id
                      ? 'bg-yellow-300 border-yellow-400 text-gray-800 shadow-md'
                      : 'bg-gray-100 boarder-gray-200 text-gray-800 hover:bg-gray-200'
                  }`}
              >
                {halt.englishName}
              </button>
            ))
          ) : (
            <p className="text-center text-gray-700 ">
              No upcoming halts available
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DestinationSelection;
