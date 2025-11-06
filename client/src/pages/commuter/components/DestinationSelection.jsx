import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../../context/AppContext';
import { CommuterContext, SCAN_STEPS } from '../../../context/CommuterContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import ConfirmModal from '../../../components/ConfirmModal';

const DestinationSelection = () => {
  const { backendUrl } = useContext(AppContext);
  const {
    activeTicket,
    boardingHalt,
    setScanStep,
    setActiveTicket,
    resetCommuter,
  } = useContext(CommuterContext);

  const [loading, setLoading] = useState(false);
  const [upcomingHalts, setUpcomingHalts] = useState([]);
  const [selectedHalt, setSelectedHalt] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const selectedHaltRef = useRef(null);

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

          if (activeTicket?.destinationHalt) {
            setSelectedHalt(activeTicket.destinationHalt.id);
          }
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

  // Confirm selected destination halt
  const handleConfirm = async () => {
    if (!activeTicket || !selectedHalt) {
      return;
    }

    const halt = upcomingHalts.find(
      (destinationHalt) => destinationHalt.id === selectedHalt,
    );

    if (!halt) {
      return;
    }

    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + `/api/ticket/destination-halt/${activeTicket.id}`,
        { destinationHalt: halt },
      );

      if (data.success) {
        setActiveTicket(data.ticket);
        setScanStep(SCAN_STEPS.PASSENGERS);
      } else {
        toast.error(data.message || 'Failed to select destination halt');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Cancel ticket
  const handleCancel = async () => {
    if (!activeTicket) {
      return;
    }

    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/ticket/cancel');

      if (data.success) {
        toast.success(data.message || 'Ticket cancelled successfully');
        resetCommuter();
      } else {
        toast.error(data.message || 'Failed to cancel ticket');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // scroll and center in the selected destination halt
  useEffect(() => {
    if (selectedHaltRef.current) {
      selectedHaltRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedHalt]);

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
          className="overflow-y-auto flex flex-col gap-3 mt-4"
          style={{ maxHeight: 'calc(70vh - 200px)', scrollbarWidth: 'thin' }}
        >
          {upcomingHalts.length > 0 ? (
            upcomingHalts.map((halt) => (
              <button
                key={halt.id}
                ref={selectedHalt === halt.id ? selectedHaltRef : null}
                onClick={() => setSelectedHalt(halt.id)}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl boarder transition-all duration-200 transform
                  ${
                    selectedHalt === halt.id
                      ? 'bg-yellow-400 border-yellow-500 text-gray-800 shadow-md active:scale-95'
                      : 'bg-gray-100 boarder-gray-200 text-gray-800 hover:bg-gray-200 active:scale-95'
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

      {/* Cancel and Next buttons */}
      <div className="flex mt-6 gap-3">
        <button
          onClick={() => setIsConfirmOpen(true)}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-full 
          transition-all duration-200 transform hover:bg-gray-300 active:scale-95 active:shadow-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirm}
          disabled={!selectedHalt || loading}
          className={`flex-1 px-4 py-2 rounded-full transition-all duration-200 transform active:scale-95 active:shadow-lg
            ${
              selectedHalt && !loading
                ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          Next
        </button>
      </div>

      {/* Confirm modal for cancel ticket */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Cancel Ticket"
        message="Are you sure you want to cancel this ticket?"
        confirmText="Yes, Cancel"
        cancelText="Go Back"
        onConfirm={() => {
          setIsConfirmOpen(false);
          handleCancel();
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </motion.div>
  );
};

export default DestinationSelection;
