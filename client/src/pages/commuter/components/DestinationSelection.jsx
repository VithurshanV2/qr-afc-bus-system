import React from 'react';
import { motion } from 'framer-motion';

const DestinationSelection = () => {
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
    </motion.div>
  );
};

export default DestinationSelection;
