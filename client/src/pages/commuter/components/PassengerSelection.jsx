import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../../context/AppContext';
import { CommuterContext, SCAN_STEPS } from '../../../context/CommuterContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import ConfirmModal from '../../../components/ConfirmModal';

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
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Update passenger count
  const setPassengerCount = async () => {
    if (!activeTicket) {
      return;
    }

    if (adultCount + childCount < 1) {
      toast.error('At least one passenger must be selected');
      return;
    }

    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + `/api/ticket/accompanying-passengers/${activeTicket.id}`,
        { adultCount, childCount },
      );

      if (data.success) {
        setActiveTicket(data.ticket);
        setScanStep(SCAN_STEPS.PAYMENT);
      } else {
        toast.error(data.message || 'Failed to add accompanying passengers');
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

  // Go back to destination selection
  const handleBack = () => {
    setScanStep(SCAN_STEPS.DESTINATION);
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
        Accompanying Passengers
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
      </div>

      {/* Passenger selection */}
      {/* Adults */}
      <div className="flex flex-col gap-5 pr-8 pl-8 text-2xl">
        <div className="flex items-center justify-between">
          <span className="text-gray-900">Adults</span>
          <div className="flex items-center gap-2 outline-2 outline-gray-300">
            <button
              onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
              className={`w-8 h-8 flex items-center justify-center  
                ${adultCount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-300 active:scale-105'}`}
            >
              -
            </button>
            <span className="w-8 text-center ">{adultCount}</span>
            <button
              onClick={() => setAdultCount(adultCount + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-yellow-300 active:scale-105"
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <span className="text-gray-900">Children</span>
          <div className="flex items-center gap-2 outline-2 outline-gray-300">
            <button
              onClick={() => setChildCount(Math.max(0, childCount - 1))}
              className={`w-8 h-8 flex items-center justify-center  
                ${childCount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-300 active:scale-105'}`}
            >
              -
            </button>
            <span className="w-8 text-center ">{childCount}</span>
            <button
              onClick={() => setChildCount(childCount + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-yellow-300 active:scale-105"
            >
              +
            </button>
          </div>
        </div>
      </div>

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
          onClick={setPassengerCount}
          disabled={loading}
          className="flex-1 bg-yellow-200 text-yellow-800 hover:bg-yellow-300 px-4 py-2 rounded-full transition-all duration-200 
          transform active:scale-95 active:shadow-lg"
        >
          Continue
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

export default PassengerSelection;
