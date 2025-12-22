import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AccountActivation = () => {
  const navigate = useNavigate();

  const { backendUrl, globalLoading, setGlobalLoading } =
    useContext(AppContext);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const token = new window.URLSearchParams(window.location.search).get('token');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setGlobalLoading(true);

      const { data } = await axios.post(
        backendUrl + '/api/auth/activate-operator',
        {
          token,
          password,
        },
      );

      if (data.success) {
        toast.success('Account activated successfully');
        navigate('/login-bus-operator');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setGlobalLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left image panel - only on desktop */}
      <div className="hidden lg:flex w-1/2 sticky top-0 h-screen overflow-hidden bg-gray-200">
        <img
          src={assets.loginImg}
          alt="login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right form panel - always visible */}
      <div
        className="relative flex flex-col items-center justify-center lg:w-1/2 min-h-screen px-6 sm:px-0 pt-24 z-20
        bg-gradient-to-br from-green-200 to-green-900"
      >
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="logo"
          className="absolute top-6 left-6 w-32 z-10 sm:w-48 cursor-pointer"
        />
        <div className="bg-dark-bg p-10 rounded-lg shadow-lg w-full sm:w-96 max-w-[384px] text-green-200 text-sm">
          <h2 className="text-3xl text-white text-center font-semibold mb-3">
            Activate Account
          </h2>
          <p className="text-sm text-center mb-6">Set your password!</p>

          <form onSubmit={onSubmitHandler}>
            {/* Password */}
            <div className="mb-4 relative flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input-bg">
              <img src={assets.lock_icon} alt="lock icon" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="bg-transparent outline-none flex-1 pr-10"
                type={'password'}
                placeholder="Password"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Confirm password */}
            <div className="mb-4 relative flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input-bg">
              <img src={assets.lock_icon} alt="lock icon" />
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="bg-transparent outline-none flex-1 pr-10"
                type={'password'}
                placeholder="Confirm Password"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={globalLoading}
              className={`w-full py-2.5 rounded-full font-medium ${
                globalLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-green-500 to-gray-900 text-white shadow-md hover:shadow-green-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform'
              }`}
            >
              Activate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountActivation;
