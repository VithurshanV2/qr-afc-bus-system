import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { CommuterContext } from '../../context/CommuterContext';
import QrScanner from './components/QrScanner';

const Scan = () => {
  const { scanStep } = useContext(CommuterContext);

  return (
    <div className="bg-white min-h-screen p-4">
      <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />

      <div className="mt-6 max-w-md mx-auto shadow rounded-xl p-6 border border-gray-200">
        <AnimatePresence mode="wait">
          {/* Step 1: Scan */}
          {scanStep === 1 && <QrScanner />}

          {/* Step 2: Select destination */}
          {scanStep === 2 && (
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Scan;
