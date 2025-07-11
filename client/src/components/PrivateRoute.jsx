import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, userData, globalLoading } = useContext(AppContext);

  if (globalLoading) {
    return null;
  }

  if (!isLoggedIn || !userData) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
