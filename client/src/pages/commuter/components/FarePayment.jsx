import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../../context/AppContext';
import { CommuterContext, SCAN_STEPS } from '../../../context/CommuterContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useRef } from 'react';

const PassengerSelection = () => {
  const { backendUrl } = useContext(AppContext);
  const {
    activeTicket,
    boardingHalt,
    setScanStep,
    setActiveTicket,
    resetCommuter,
  } = useContext(CommuterContext);

  const [loading, setLoading] = useState(false);
  const [baseFare, setBaseFare] = useState(0);
  const [totalFare, setTotalFare] = useState(0);

  const fetchedFare = useRef(false);

  // Calculate total fare
  const calculateTotalFare = async () => {
    if (!activeTicket) {
      return;
    }

    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(
        backendUrl + `/api/ticket/fares/${activeTicket.id}`,
      );

      if (data.success) {
        const updated = data.ticket;

        setActiveTicket((prev) => ({
          ...prev,
          baseFare: updated.baseFare,
          totalFare: updated.totalFare,
        }));

        setBaseFare(updated.baseFare / 100);
        setTotalFare(updated.totalFare / 100);
        toast.success('Total fare calculated');
      } else {
        toast.error(data.message || 'Failed to calculate fare');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeTicket?.id || fetchedFare.current) {
      return;
    }

    fetchedFare.current = true;
    calculateTotalFare();
  }, [activeTicket]);

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

  // Go back to passenger selection
  const handleBack = () => {
    setScanStep(SCAN_STEPS.PASSENGERS);
  };

  return (
    <motion.div
      key="passenger"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back button */}
      <button
        onClick={handleBack}
        disabled={loading}
        className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 active:scale-95"
      >
        <ArrowLeft size={18} />
        <span className="text-sm text-gray-800">Back</span>
      </button>

      <h2 className="text-gray-900 text-2xl font-semibold text-center mb-4">
        Fare Summary
      </h2>

      {/* Trip info */}
      <div className=" text-gray-700 mb-4">
        <p className="mb-1">
          <span className="font-semibold text-gray-900">Route:</span>{' '}
          {activeTicket.trip?.route?.name} - ({activeTicket.trip?.route?.number}
          )
        </p>
        <p className="mb-1">
          <span className="font-semibold text-gray-900">BoardingHalt:</span>{' '}
          {boardingHalt.replace(/\((.*?)\)/g, '')}
        </p>
        <p className="mb-1">
          <span className="font-semibold text-gray-900">DestinationHalt:</span>{' '}
          {activeTicket.destinationHalt?.englishName.replace(/\((.*?)\)/g, '')}
        </p>
        <p className="mb-1">
          <span className="font-semibold text-gray-900">
            Accompanying passengers:
          </span>{' '}
          {activeTicket.adultCount + ' adults '} {activeTicket.childCount}
        </p>
        <p className="mb-1">
          <span className="font-semibold text-gray-900">BaseFare:</span>
          {baseFare}
          {totalFare}
        </p>
      </div>

      {/* Cancel and Next buttons */}
      <div className="flex mt-6 gap-3">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-full 
          transition-all duration-200 transform hover:bg-gray-300 active:scale-95 active:shadow-lg"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          className="flex-1 bg-yellow-200 text-yellow-800 hover:bg-yellow-300 px-4 py-2 rounded-full transition-all duration-200 
          transform active:scale-95 active:shadow-lg"
        >
          Pay Fare
        </button>
      </div>
    </motion.div>
  );
};

export default PassengerSelection;
