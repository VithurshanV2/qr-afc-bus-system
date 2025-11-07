import React from 'react';
import { assets } from '../../assets/assets';
import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Ticket = () => {
  const { backendUrl } = useContext(AppContext);

  const [_ticket, setTicket] = useState(null);
  const [_loading, setLoading] = useState(false);

  // Fetch latest ticket of the user
  const fetchLatestTicket = async () => {
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendUrl + '/api/ticket/latest');

      if (data.success && data.ticket) {
        setTicket(data.ticket);
      } else {
        toast.error(data.message || 'Unable to fetch ticket');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchLatestTicket();
  }, []);

  return (
    <div className="bg-white min-h-[calc(100vh-4.4rem)] p-4">
      <div className="flex items-start mb-4">
        <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />
      </div>

      <div className="mt-6 max-w-md mx-auto shadow rounded-xl p-6 border border-gray-200">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-gray-900 text-2xl font-medium flex items-center gap-2">
              Ticket
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Ticket;
