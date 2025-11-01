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
  const [_selectedHalt, setSelectedHalt] = useState(null);

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
        <div>
          <p>
            <span>Route:</span> {activeTicket.trip?.route?.name} - (
            {activeTicket.trip?.route?.number})
          </p>
          <p>
            <span>Boarding Halt:</span> {boardingHalt.replace(/\((.*?)\)/g, '')}
          </p>
        </div>
      )}

      {/* Destination halt list */}
      {loading ? (
        <div>
          <BounceLoader size={60} color="#FFB347" />
          <p>Loading upcoming halts...</p>
        </div>
      ) : (
        <div>
          {upcomingHalts.length > 0 ? (
            upcomingHalts.map((halt) => (
              <button
                key={halt.id}
                onClick={() => selectDestinationHalt(halt)}
                disabled={loading}
              >
                {halt.englishName}
              </button>
            ))
          ) : (
            <p>No upcoming halts available</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DestinationSelection;
