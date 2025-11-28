import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BusOperatorRequest = () => {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate('/bus-operator-request');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="flex flex-col sm:flex-row justify-between items-center bg-dark-bg p-10 shadow-lg rounded-lg gap-6 sm:gap-12 mt-16 mx-auto"
    >
      <div className="sm:w-3/4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Bus Operator Account
        </h2>
        <p className="text-gray-300 text-lg">
          Become a registered bus operator to provide seamless fare collection
          to commuters through the SmartFare system.
        </p>
      </div>
      <div className="sm:w-1/4">
        <motion.button
          onClick={handleApply}
          className="w-full py-2.5 px-3 rounded-full font-medium bg-gradient-to-r from-yellow-600 to-orange-700 
          text-white shadow-md hover:shadow-yellow-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform"
        >
          Apply Here
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BusOperatorRequest;
