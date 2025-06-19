import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-orange-400">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-32 sm:w-48 cursor-pointer"
      />

      {/* Enter email id */}
      <form className="bg-dark-bg p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password
        </h1>
        <p className="text-yellow-200 text-center mb-6">
          Enter your registered email address
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input-bg">
          <img src={assets.mail_icon} alt="mail icon" />
          <input
            type="email"
            placeholder="Email ID"
            className="bg-transparent outline-none text-yellow-300"
          />
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
