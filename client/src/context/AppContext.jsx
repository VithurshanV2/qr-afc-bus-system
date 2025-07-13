import React from 'react';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const getAuthState = async () => {
    try {
      setGlobalLoading(true);
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        const message = error.response?.data?.message || 'Something went wrong';
        toast.error(message);
      }
    } finally {
      setGlobalLoading(false);
      setAuthChecked(true);
    }
  };

  const getUserData = async () => {
    try {
      setGlobalLoading(true);
      const { data } = await axios.get(backendUrl + '/api/user/data');
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    globalLoading,
    setGlobalLoading,
    authChecked,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.node,
};
