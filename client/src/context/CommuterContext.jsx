import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const CommuterContext = createContext();

export const CommuterProvider = ({ children }) => {
  const [scanStep, setScanStep] = useState(1);
  const [boardingHalt, setBoardingHalt] = useState('');

  const resetCommuter = () => {
    setScanStep(1);
    setBoardingHalt('');
  };

  const value = {
    scanStep,
    setScanStep,
    boardingHalt,
    setBoardingHalt,
    resetCommuter,
  };

  return (
    <CommuterContext.Provider value={value}>
      {children}
    </CommuterContext.Provider>
  );
};

CommuterProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
