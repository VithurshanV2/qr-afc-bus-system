import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, userData, authChecked } = useContext(AppContext);

  const location = useLocation();

  if (!authChecked) {
    return null;
  }

  // Not logged in or user data missing, direct to login page
  if (!isLoggedIn || !userData) {
    return <Navigate to="/login" replace />;
  }

  // logged in but email not verified, direct to email verification page
  if (!userData.isAccountVerified && location.pathname !== '/email-verify') {
    return <Navigate to="/email-verify" replace />;
  }

  return children;
};
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
