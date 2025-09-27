import React, { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailVerify = () => {
  const navigate = useNavigate();

  const { backendUrl, getUserData, isLoggedIn, userData, setGlobalLoading } =
    useContext(AppContext);

  const location = useLocation();
  const params = new window.URLSearchParams(location.search);
  const redirectTo = params.get('redirectTo') || '/';

  axios.defaults.withCredentials = true;

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

  const onSubmitHandler = async (e) => {
    try {
      setGlobalLoading(true);

      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join('');

      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-account',
        { otp },
      );

      if (data.success) {
        toast.success(data.message);
        await getUserData();
        navigate(redirectTo);
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

  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate(redirectTo);
    }
  }, [isLoggedIn, userData, navigate, redirectTo]);

  const [resendCooldown, setResendCooldown] = React.useState(0);

  // Resend otp code
  const handleResend = async () => {
    if (resendCooldown > 0) {
      return;
    }

    try {
      setGlobalLoading(true);

      const { data } = await axios.post(
        backendUrl + '/api/auth/resend-verify-otp',
      );

      if (data.success) {
        toast.success('A new OTP has been sent to your email');
        setResendCooldown(60);
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

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = window.setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => window.clearTimeout(timer);
    }
  }, [resendCooldown]);

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

      <form
        onSubmit={onSubmitHandler}
        className="bg-dark-bg p-8 sm:p-8 rounded-lg shadow-lg w-full max-w-[384px] text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-yellow-200 text-center mb-6">
          Enter the 6-digit code sent to your Email ID
        </p>
        <div className="flex justify-between gap-1 mb-8" onPaste={handlePaste}>
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
                className="w-11 h-12 sm:w-12 bg-input-bg text-white text-center text-xl rounded-md
                outline-none focus:ring-3 focus:ring-yellow-600"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '');
                  handleInput(e, index);
                }}
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
          Verify email
        </button>
        <p
          onClick={handleResend}
          className={`mt-3 text-yellow-400 text-center cursor-pointer transition ${
            resendCooldown > 0
              ? 'opacity-50 pointer-events-none'
              : 'hover:text-yellow-300'
          }`}
        >
          {resendCooldown > 0
            ? `Resend Code in ${resendCooldown}s`
            : 'Resend Code'}
        </p>
      </form>
    </div>
  );
};

export default EmailVerify;
