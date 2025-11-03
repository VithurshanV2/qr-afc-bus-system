import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AnimatePresence } from 'framer-motion';
import { CommuterContext, SCAN_STEPS } from '../../context/CommuterContext';
import QrScanner from './components/QrScanner';
import DestinationSelection from './components/DestinationSelection';
import PassengerSelection from './components/PassengerSelection';
import FarePayment from './components/FarePayment';

const Scan = () => {
  const { scanStep } = useContext(CommuterContext);

  return (
    <div className="bg-white min-h-screen p-4">
      <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />

      <div className="mt-6 max-w-md mx-auto shadow rounded-xl p-6 border border-gray-200">
        <AnimatePresence mode="wait">
          {/* Step 1: Scan */}
          {scanStep === SCAN_STEPS.SCAN && <QrScanner />}

          {/* Step 2: Select destination */}
          {scanStep === SCAN_STEPS.DESTINATION && <DestinationSelection />}

          {/* Step 3: Add accompanying passengers */}
          {scanStep === SCAN_STEPS.PASSENGERS && <PassengerSelection />}

          {/* Step 3: Fare calculation and payment */}
          {scanStep === SCAN_STEPS.PAYMENT && <FarePayment />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Scan;
