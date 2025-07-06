import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import EmailVerify from './pages/auth/EmailVerify';
import ResetPassword from './pages/auth/ResetPassword';
import { ToastContainer } from 'react-toastify';
import Loader from './components/Loader';
import { AppContext } from './context/AppContext';
import CommuterHome from './pages/commuter/CommuterHome';
import Ticket from './pages/commuter/Ticket';
import Scan from './pages/commuter/Scan';
import Wallet from './pages/commuter/Wallet';
import Profile from './pages/commuter/Profile';
import CommuterLayout from './layouts/CommuterLayout';

const App = () => {
  const { globalLoading } = useContext(AppContext);

  return (
    <div>
      <ToastContainer />
      {globalLoading && <Loader />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Commuter routes */}
        <Route path="/commuter" element={<CommuterLayout />}>
          <Route path="home" element={<CommuterHome />} />
          <Route path="ticket" element={<Ticket />} />
          <Route path="scan" element={<Scan />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
