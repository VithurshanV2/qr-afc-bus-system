import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { CommuterContext } from '../../../context/CommuterContext';
import ConfirmModal from '../../../components/ConfirmModal';

const TicketTimer = () => {
  const navigate = useNavigate();

  const { resetCommuter } = useContext(CommuterContext);
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  // Convert ms to ms:ss
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const expiresAt = parseInt(
      window.localStorage.getItem('ticketExpiresAt'),
      10,
    );

    if (!expiresAt) {
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const msRemaining = expiresAt - now;

      if (msRemaining <= 0) {
        setExpired(true);
      } else {
        setTimeLeft(msRemaining);
      }
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const handleExpiredConfirm = () => {
    window.localStorage.removeItem('ticketExpiresAt');
    resetCommuter();
    navigate('/commuter/scan', { replace: true });
  };

  if (timeLeft <= 0 && !expired) {
    return null;
  }

  return (
    <>
      {timeLeft > 0 && (
        <motion.div
          className="bg-yellow-300 text-yellow-800 px-4 py-2 rounded-full font-semibold 
        text-lg text-center w-32 mx-auto"
        >
          <span className="font-semibold">Exp: </span>
          {formatTime(timeLeft)}
        </motion.div>
      )}

      {/* Confirm modal on expiry */}
      <ConfirmModal
        isOpen={expired}
        title="Ticket Expired"
        message="Your ticket has expired. Please scan again."
        confirmText="OK"
        onConfirm={handleExpiredConfirm}
      />
    </>
  );
};

export default TicketTimer;
