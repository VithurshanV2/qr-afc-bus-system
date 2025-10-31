import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from './AppContext';
import axios from 'axios';

export const CommuterContext = createContext();

export const CommuterProvider = ({ children }) => {
  const { backendUrl } = useContext(AppContext);

  const [scanStep, setScanStep] = useState(1);
  const [boardingHalt, setBoardingHalt] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);

  const resetCommuter = () => {
    setScanStep(1);
    setBoardingHalt(null);
    setActiveTicket(null);
  };

  useEffect(() => {
    const fetchActiveTicket = async () => {
      try {
        axios.defaults.withCredentials = true;

        const { data } = await axios.get(backendUrl + '/api/ticket/active');

        if (data.success && data.ticket) {
          setActiveTicket(data.ticket);
          setScanStep(2);
          setBoardingHalt(data.ticket.boardingHalt.englishName);
        }
      } catch (error) {
        console.error(error.response?.data?.message || 'Something went wrong');
      }
    };

    fetchActiveTicket();
  }, [backendUrl]);

  const value = {
    scanStep,
    setScanStep,
    boardingHalt,
    setBoardingHalt,
    activeTicket,
    setActiveTicket,
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
