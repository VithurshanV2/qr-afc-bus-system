import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();

  const { backendUrl, setGlobalLoading } = useContext(AppContext);

  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [otp, setOtp] = useState(0);

  // Store refs for OTP input fields
  const inputRefs = React.useRef([]);

  // Auto-focus next input on entry
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Auto-focus previous input on backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Distribute pasted OTP digits across input fields
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      setGlobalLoading(true);

      const { data } = await axios.post(
        backendUrl + '/api/auth/send-reset-otp',
        { email },
      );
      if (data.success) {
        setIsEmailSent(true);
        toast.success(data.message);
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

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const enteredOtp = otpArray.join('');

    try {
      setGlobalLoading(true);

      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-reset-otp',
        {
          email,
          otp: enteredOtp,
        },
      );

      if (data.success) {
        setOtp(enteredOtp);
        setIsOtpSubmitted(true);
        toast.success(data.message);
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

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(newPassword)) {
      toast.error(
        'Password must be at least 8 characters and include uppercase, lowercase, and a number',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setGlobalLoading(true);

      const { data } = await axios.post(
        backendUrl + '/api/auth/reset-password',
        { email, otp, newPassword },
      );
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
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
    <div
      className="flex items-center justify-center min-h-screen 
      bg-gradient-to-br from-yellow-200 to-orange-400"
    >
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-32 sm:w-48 cursor-pointer"
      />

      {/* Enter email id */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-dark-bg p-8 sm:p-8 rounded-lg shadow-lg w-full max-w-[384px] text-sm"
        >
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-3 text-white font-medium rounded-full 
            bg-gradient-to-r from-yellow-600 to-orange-700 shadow-md 
            hover:brightness-110 hover:shadow-yellow-800 hover:scale-105 active:scale-100 
            transition-all duration-300 transform"
          >
            Submit
          </button>
        </form>
      )}

      {/* OTP input form */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-dark-bg p-8 sm:p-8 rounded-lg shadow-lg w-full max-w-[384px] text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-yellow-200 text-center mb-6">
            Enter the 6-digit code sent to your Email ID
          </p>
          <div
            className="flex justify-between overflow-x-auto gap-1 mb-8"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d"
                  maxLength="1"
                  key={index}
                  required
                  className="w-11 h-12 sm:w-12 bg-input-bg text-white text-center text-xl rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button
            className="w-full py-3 text-white font-medium rounded-full 
            bg-gradient-to-r from-yellow-600 to-orange-700 shadow-md 
            hover:brightness-110 hover:shadow-yellow-800 hover:scale-105 active:scale-100 
            transition-all duration-300 transform"
          >
            Submit
          </button>
        </form>
      )}

      {/* Enter new password */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-dark-bg p-8 sm:p-8 rounded-lg shadow-lg w-full max-w-[384px] text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-yellow-200 text-center mb-6">
            Enter the new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input-bg">
            <img src={assets.lock_icon} alt="lock icon" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-yellow-300"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input-bg">
            <img src={assets.lock_icon} alt="lock icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="bg-transparent outline-none text-yellow-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-3 text-white font-medium rounded-full bg-gradient-to-r from-yellow-600 to-orange-700 shadow-md hover:brightness-110 hover:shadow-yellow-800 hover:scale-105 active:scale-100 transition-all duration-300 transform">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
