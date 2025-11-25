import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TicketTimer = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);

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
        window.localStorage.removeItem('ticketExpiresAt');
        navigate('/commuter/scan', { replace: true });
      } else {
        setTimeLeft(msRemaining);
      }
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(interval);
  }, [navigate]);

  if (timeLeft <= 0) {
    return null;
  }

  return (
    <motion.div
      className="bg-yellow-300 text-yellow-800 px-4 py-2 rounded-full font-semibold 
        text-lg text-center w-32 mx-auto"
    >
      <span className="font-semibold">Exp: </span>
      {formatTime(timeLeft)}
    </motion.div>
  );
};

export default TicketTimer;
