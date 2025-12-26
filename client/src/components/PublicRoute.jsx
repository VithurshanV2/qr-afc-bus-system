import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const getPathByRole = (role) => {
  switch (role) {
    case 'TRANSPORTAUTHORITY':
      return '/admin/review-account-request';
    case 'COMMUTER':
      return '/commuter/scan';
    case 'BUSOPERATOR':
      return '/bus-operator/trip-management';
    default:
      return '/';
  }
};

const PublicRoute = ({ children }) => {
  const { userData } = useContext(AppContext);

  if (userData) {
    const path = getPathByRole(userData.role);
    return <Navigate to={path} replace />;
  }

  return children;
};

export default PublicRoute;
