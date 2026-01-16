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
import BottomNav from './components/BottomNav';
import BusOperatorForm from './pages/bus-operator/BusOperatorForm';
import AccountActivation from './pages/shared/AccountActivation';
import LoginBusOperator from './pages/auth/LoginBusOperator';
import LoginAdmin from './pages/auth/LoginAdmin';
import AdminLayout from './layouts/AdminLayout';
import ReviewAccountRequest from './pages/transport-authority/ReviewAccountRequest';
import RouteAssignment from './pages/transport-authority/RouteAssignment';
import RouteManagement from './pages/transport-authority/RouteManagement';
import RevenueAdminView from './pages/transport-authority/RevenueAdminView';
import TripLog from './pages/transport-authority/TripLog';
import TicketVerification from './pages/shared/TicketVerification';
import AdminRoute from './components/AdminRoute';
import CommuterRoute from './components/CommuterRoute';
import BusOperatorRoute from './components/BusOperatorRoute';
import PublicRoute from './components/PublicRoute';
import BusOperatorLayout from './layouts/BusOperatorLayout';
import TripManagement from './pages/bus-operator/TripManagement';
import RevenueOperatorView from './pages/bus-operator/RevenueOperatorView';
import ExitTracking from './pages/bus-operator/ExitTracking';
import AdminAccount from './pages/transport-authority/AdminAccount';

const App = () => {
  const { globalLoading, userData } = useContext(AppContext);
  const location = useLocation();

  return (
    <div>
      <ToastContainer />
      {globalLoading && <Loader />}

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
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

        <Route path="activate-account" element={<AccountActivation />} />

        {/* Bus operator routes */}
        <Route path="bus-operator-request" element={<BusOperatorForm />} />
        <Route path="login-bus-operator" element={<LoginBusOperator />} />
        <Route
          path="/bus-operator"
          element={
            <BusOperatorRoute>
              <BusOperatorLayout />
            </BusOperatorRoute>
          }
        >
          <Route path="trip-management" element={<TripManagement />} />
          <Route path="revenue" element={<RevenueOperatorView />} />
          <Route path="exit-tracking" element={<ExitTracking />} />
          <Route path="ticket-verification" element={<TicketVerification />} />
        </Route>

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
          <Route path="route-assignment" element={<RouteAssignment />} />
          <Route path="ticket-verification" element={<TicketVerification />} />
          <Route path="revenue" element={<RevenueAdminView />} />
          <Route path="trip-log" element={<TripLog />} />
          <Route path="create-account" element={<AdminAccount />} />
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
