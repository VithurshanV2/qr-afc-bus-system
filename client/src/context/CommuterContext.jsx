import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from './AppContext';
import axios from 'axios';

export const SCAN_STEPS = {
  SCAN: 1,
  DESTINATION: 2,
  PASSENGERS: 3,
  PAYMENT: 4,
};

export const CommuterContext = createContext();

export const CommuterProvider = ({ children }) => {
  const { backendUrl } = useContext(AppContext);

  const [scanStep, setScanStep] = useState(SCAN_STEPS.SCAN);
  const [boardingHalt, setBoardingHalt] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);

  const resetCommuter = () => {
    setScanStep(SCAN_STEPS.SCAN);
    setBoardingHalt(null);
    setActiveTicket(null);
    window.localStorage.removeItem('ticketExpiresAt');
  };

  const setActiveTicketWithTimer = (ticket) => {
    setActiveTicket(ticket);

    if (ticket?.expiresAt) {
      window.localStorage.setItem(
        'ticketExpiresAt',
        new Date(ticket.expiresAt).getTime(),
      );
    }
  };

  useEffect(() => {
    const fetchActiveTicket = async () => {
      try {
        axios.defaults.withCredentials = true;

        const { data } = await axios.get(backendUrl + '/api/ticket/active');

        if (data.success && data.ticket) {
          const { ticket, progressStep } = data;

          const expiresAt = new Date(ticket.expiresAt).getTime();

          window.localStorage.setItem('ticketExpiresAt', expiresAt);

          setActiveTicket(ticket);
          setBoardingHalt(ticket.boardingHalt?.englishName || null);
          setScanStep(progressStep || SCAN_STEPS.SCAN);
        } else {
          resetCommuter();
          window.localStorage.removeItem('ticketExpiresAt');
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
    setActiveTicket: setActiveTicketWithTimer,
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
