import React from 'react';
import { motion } from 'framer-motion';

const PassengerSelection = () => {
  return (
    <motion.div
      key="passenger"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-gray-900 text-2xl font-semibold text-center mb-4">
        Accompanying Passengers
      </h2>

      {/* Trip info */}
      <div className=" text-gray-700 mb-4">
        <p className="mb-1">
          <span className="font-semibold text-gray-900">Route:</span>{' '}
        </p>
        <p className="mb-1">
          <span className="font-semibold text-gray-900">
            BoardingHalt:
          </span>{' '}
        </p>
        <p className="mb-1">
          <span className="font-semibold text-gray-900">DestinationHalt:</span>
        </p>
      </div>

      {/* Add passengers adult or child */}
      <div>
        <label>Adults</label>
      </div>
      <div>
        <label>Children</label>
      </div>

      {/* Buttons */}
      <button
        className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-full transition-all duration-200 
        transform active:scale-95 active:shadow-lg"
      >
        Cancel
      </button>
      <button
        className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300 px-4 py-2 rounded-full transition-all duration-200 
        transform active:scale-95 active:shadow-lg"
      >
        Back
      </button>
      <button
        className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300 px-4 py-2 rounded-full transition-all duration-200 
        transform active:scale-95 active:shadow-lg"
      >
        Continue
      </button>
    </motion.div>
  );
};

export default PassengerSelection;
