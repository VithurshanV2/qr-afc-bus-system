import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../../context/AppContext';
import { CommuterContext, SCAN_STEPS } from '../../../context/CommuterContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useRef } from 'react';
import ConfirmModal from '../../../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';

const PassengerSelection = () => {
  const navigate = useNavigate();

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
  const [modalType, setModalType] = useState(null);

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

  // Pay fare
  const payFare = async () => {
    if (!activeTicket) {
      return;
    }

    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + `/api/wallet/pay-fare/${activeTicket.id}`,
      );

      if (data.success) {
        toast.success(data.message || 'Ticket paid successfully');
        resetCommuter();

        navigate('/commuter/ticket');
      } else {
        toast.error(data.message || 'Ticket payment failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';

      if (message === 'Insufficient balance') {
        handleInsufficientBalance();
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Provide wallet top up option when insufficient balance
  const handleInsufficientBalance = async () => {
    setModalType('insufficient');
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

  // Go back to passenger selection
  const handleBack = () => {
    setScanStep(SCAN_STEPS.PASSENGERS);
  };

  // Open confirm modal before payment
  const handleConfirmPay = () => {
    setModalType('confirmPayment');
  };

  // Open cancel modal
  const handleConfirmCancel = () => {
    setModalType('cancelTicket');
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

      {/* Fare summary*/}
      <div className="space-y-5">
        {/* Route, Bus, Ticket ID info */}
        <div className=" border-b border-gray-200 pb-3 mb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 ">
              <p className="text-gray-800 font-medium">
                <span className="text-gray-600 font-medium">Route:</span>{' '}
                {activeTicket.trip?.route?.name || 'N/A'} (
                {activeTicket.trip?.route?.number || 'N/A'})
              </p>
              <p className="text-gray-800 font-medium">
                <span className="text-gray-600 font-medium">Bus Reg. No.:</span>{' '}
                {activeTicket.trip?.bus?.registrationNumber || 'N/A'}
              </p>
            </div>

            <div className="ml-4 text-right">
              <p className="text-gray-800 font-medium">
                <span className="text-gray-600 font-medium">Ticket ID: </span>{' '}
                <span className="text-yellow-600 font-semibold">
                  #{activeTicket?.id}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Halts info */}
        <div className="text-center mb-4 border-b border-gray-200 pb-3">
          <p className="text-gray-600 text-sm tracking-wide">
            Boarding Halt - Destination Halt
          </p>
          <p className="text-2xl font-medium text-gray-900 truncate mx-auto whitespace-nowrap">
            {boardingHalt.replace(/\((.*?)\)/g, '')} {'-'}{' '}
            {activeTicket.destinationHalt?.englishName.replace(
              /\((.*?)\)/g,
              '',
            )}
          </p>
        </div>

        {/* Fare info */}
        <div className="flex justify-between mb-1.5">
          <span className="text-gray-600">Base Fare</span>
          <span className="text-gray-900 font-medium">
            {baseFare.toFixed(2)} LKR
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">
            {activeTicket.adultCount || 'N/A'} Adult
            {activeTicket.adultCount > 1 ? 's' : ''}
            {activeTicket.childCount > 0 &&
              `, ${activeTicket.childCount} Child${activeTicket.childCount > 1 ? 'ren' : ''}`}
          </span>
        </div>

        {/* Total fare */}
        <div className="text-center mt-2">
          <p className="text-gray-600 tracking-wide text-sm">Total Fare</p>
          <p className="text-4xl font-medium text-gray-900">
            {totalFare.toFixed(2)} LKR
          </p>
        </div>
      </div>

      {/* Cancel and Pay Fare buttons */}
      <div className="flex mt-6 gap-3">
        <button
          onClick={handleConfirmCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-full 
          transition-all duration-200 transform hover:bg-gray-300 active:scale-95 active:shadow-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirmPay}
          disabled={loading}
          className="flex-1 bg-yellow-200 text-yellow-800 hover:bg-yellow-300 px-4 py-2 rounded-full transition-all duration-200 
          transform active:scale-95 active:shadow-lg"
        >
          Pay Fare
        </button>
      </div>

      {/* Confirm modal when wallet balance is insufficient */}
      <ConfirmModal
        isOpen={modalType === 'insufficient'}
        title="Insufficient Balance"
        message="Your wallet balance is insufficient to complete this payment. Would you like to top up now?"
        confirmText="Top Up Wallet"
        cancelText="Cancel"
        onConfirm={() => {
          setModalType(null);
          window.location.href = `/commuter/wallet?from=scan&ticketId=${activeTicket.id}`;
        }}
        onCancel={() => setModalType(null)}
      />

      {/* Confirm modal for confirm payment */}
      <ConfirmModal
        isOpen={modalType === 'confirmPayment'}
        title="Confirm Payment"
        message={`${totalFare.toFixed(2)} LKR will be deducted from your wallet balance. Do you want to proceed?`}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => {
          setModalType(null);
          payFare();
        }}
        onCancel={() => setModalType(null)}
      />

      {/* Confirm modal for cancel ticket */}
      <ConfirmModal
        isOpen={modalType === 'cancelTicket'}
        title="Cancel Ticket"
        message="Are you sure you want to cancel this ticket?"
        confirmText="Yes, Cancel"
        cancelText="Go Back"
        onConfirm={() => {
          setModalType(null);
          handleCancel();
        }}
        onCancel={() => setModalType(null)}
      />
    </motion.div>
  );
};

export default PassengerSelection;
