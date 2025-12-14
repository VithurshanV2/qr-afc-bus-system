import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { userData, isLoggedIn, authChecked } = useContext(AppContext);

  if (!authChecked) {
    return null;
  }

  if (!isLoggedIn || !userData || userData.role !== 'TRANSPORTAUTHORITY') {
    return <Navigate to="/login-admin" replace />;
  }

  return children;
};

export default AdminRoute;
