import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const LoginBusOperator = () => {
  const navigate = useNavigate();

  const {
    backendUrl,
    setIsLoggedIn,
    getUserData,
    globalLoading,
    setGlobalLoading,
  } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setGlobalLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/auth/login-bus-operator',
        {
          email,
          password,
        },
      );

      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
        navigate('/bus-operator/trip-management');
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
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
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
            Login
          </h2>
          <p className="text-sm text-center mb-6">Login to your account!</p>

          <form onSubmit={onSubmitHandler}>
            {/* Email */}
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input-bg">
              <img src={assets.mail_icon} alt="mail icon" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-transparent outline-none"
                type="email"
                placeholder="Email ID"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4 relative flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input-bg">
              <img src={assets.lock_icon} alt="lock icon" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="bg-transparent outline-none flex-1 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 text-xs text-green-300 hover:text-green-200 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot password */}
            <p
              onClick={() => navigate('/reset-password')}
              className="mb-4 text-green-300 cursor-pointer"
            >
              Forgot password?
            </p>

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
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginBusOperator;
