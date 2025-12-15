import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import EmailVerify from './pages/auth/EmailVerify';
import ResetPassword from './pages/auth/ResetPassword';
import { ToastContainer } from 'react-toastify';
import Loader from './components/Loader';
import { AppContext } from './context/AppContext';
import Ticket from './pages/commuter/Ticket';
import Scan from './pages/commuter/Scan';
import Wallet from './pages/commuter/Wallet';
import Profile from './pages/commuter/Profile';
import CommuterLayout from './layouts/CommuterLayout';
import PrivateRoute from './components/CommuterRoute';
import BottomNav from './components/BottomNav';
import BusOperatorForm from './pages/bus-operator/BusOperatorForm';
import LoginBusOperator from './pages/auth/LoginBusOperator';
import LoginAdmin from './pages/auth/LoginAdmin';
import AdminLayout from './layouts/AdminLayout';
import ReviewAccountRequest from './pages/transport-authority/ReviewAccountRequest';
import RouteManagement from './pages/transport-authority/RouteManagement';
import TicketVerification from './pages/shared/TicketVerification';
import AdminRoute from './components/AdminRoute';
import CommuterRoute from './components/CommuterRoute';

const App = () => {
  const { globalLoading, userData } = useContext(AppContext);
  const location = useLocation();

  return (
    <div>
      <ToastContainer />
      {globalLoading && <Loader />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/email-verify"
          element={
            <CommuterRoute>
              <EmailVerify />
            </CommuterRoute>
          }
        />

        {/* Commuter routes */}
        <Route
          path="/commuter"
          element={
            <CommuterRoute>
              <CommuterLayout />
            </CommuterRoute>
          }
        >
          <Route path="ticket" element={<Ticket />} />
          <Route path="scan" element={<Scan />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Bus operator routes */}
        <Route path="bus-operator-request" element={<BusOperatorForm />} />
        <Route path="login-bus-operator" element={<LoginBusOperator />} />

        {/* Transport Authority routes */}
        <Route path="login-admin" element={<LoginAdmin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route
            path="review-account-request"
            element={<ReviewAccountRequest />}
          />
          <Route path="route-management" element={<RouteManagement />} />
          <Route path="ticket-verification" element={<TicketVerification />} />
        </Route>
      </Routes>

      {/* BottomNav for commuters */}
      {userData?.role === 'COMMUTER' &&
        userData?.isAccountVerified &&
        (location.pathname === '/' ||
          location.pathname.startsWith('/commuter')) && <BottomNav />}
    </div>
  );
};

export default App;
