import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Phone } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const {
    backendUrl,
    setIsLoggedIn,
    getUserData,
    globalLoading,
    setGlobalLoading,
  } = useContext(AppContext);

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({
    login: false,
    signup: false,
  });

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const isPhoneNumberValid = (number) => {
    const regex = /^(?:0|94|\+94)?(7[0-8][0-9]{7})$/;
    return regex.test(number);
  };

  const onSubmitHandler = async (e) => {
    try {
      setGlobalLoading(true);

      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {
        if (!isPhoneNumberValid(number)) {
          toast.error('Invalid phone number');
          return;
        }

        if (!isPasswordValid(password)) {
          toast.error(
            'Password must be at least 8 characters and include uppercase, lowercase, and a number',
          );
          return;
        }

        const { data } = await axios.post(backendUrl + '/api/auth/register', {
          name,
          email,
          number,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          await getUserData();

          if (!data.user.isAccountVerified) {
            navigate('/email-verify?redirectTo=/commuter/home');
          } else {
            navigate('/commuter/home');
          }
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          await getUserData();
          const path = data.user.isFirstLogin
            ? '/commuter/home'
            : '/commuter/scan';
          navigate(path);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setGlobalLoading(false);
    }
  };

  const clearFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setGlobalLoading(true);
      window.open(backendUrl + '/api/auth/google', '_self');
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
        <div
          className={`w-full h-full flex transition-transform duration-700 ease-in-out will-change-transform ${
            state === 'Sign Up' ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <img
            src={assets.loginImg}
            alt="login"
            className={`w-full h-full object-cover shrink-0 transition-opacity duration-700 ease-in-out ${
              imagesLoaded.login ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImagesLoaded((prev) => ({ ...prev, login: true }))}
          />
          <img
            src={assets.signupImg}
            alt="signup"
            className={`w-full h-full object-cover shrink-0 transition-opacity duration-700 ease-in-out ${
              imagesLoaded.signup ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() =>
              setImagesLoaded((prev) => ({ ...prev, signup: true }))
            }
          />
        </div>
      </div>

      {/* Right form panel - always visible */}
      <div
        className="relative flex flex-col items-center justify-center lg:w-1/2 min-h-screen px-6 sm:px-0 pt-24 z-20
        bg-gradient-to-br from-yellow-200 to-orange-400"
      >
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="logo"
          className="absolute top-6 left-6 w-32 z-10 sm:w-48 cursor-pointer"
        />
        <div className="bg-dark-bg p-10 rounded-lg shadow-lg w-full sm:w-96 max-w-[384px] text-yellow-300 text-sm">
          <h2 className="text-3xl text-white text-center font-semibold mb-3">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </h2>
          <p className="text-sm text-center mb-6">
            {state === 'Sign Up'
              ? 'Create your account'
              : 'Login to your account!'}
          </p>

          <form onSubmit={onSubmitHandler}>
            {state === 'Sign Up' && (
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input-bg">
                <img src={assets.user_icon} alt="user icon" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="bg-transparent outline-none"
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}
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
            {state === 'Sign Up' && (
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input-bg">
                <Phone size={20} color="#ffffff" />
                <input
                  onChange={(e) => setNumber(e.target.value)}
                  value={number}
                  className="bg-transparent outline-none pl-[4px]"
                  type="tel"
                  placeholder="Phone number"
                  required
                />
              </div>
            )}
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
                className="absolute right-4 text-xs text-yellow-400 hover:text-yellow-200 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {state === 'Login' && (
              <p
                onClick={() => navigate('/reset-password')}
                className="mb-4 text-yellow-400 cursor-pointer"
              >
                Forgot password?
              </p>
            )}

            <button
              type="submit"
              disabled={globalLoading}
              className={`w-full py-2.5 rounded-full font-medium ${
                globalLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-700 text-white shadow-md hover:shadow-yellow-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform'
              }`}
            >
              {state}
            </button>

            {/* Separator */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-yellow-300" />
              <span className="mx-3 text-yellow-300 text-sm">OR</span>
              <hr className="flex-grow border-yellow-300" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={globalLoading}
              className={`mt-4 w-full py-2.5 rounded-full font-medium flex items-center justify-center gap-2 ${
                globalLoading
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-white text-dark-bg shadow-md hover:shadow-gray-500 hover:scale-105 active:scale-100 transition-all duration-300 transform'
              }`}
            >
              <img
                src={assets.google_icon}
                alt="google icon"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
          </form>
          {state === 'Sign Up' ? (
            <p className="text-gray-400 text-center text-xs mt-4">
              Already have an account?{' '}
              <span
                onClick={() => {
                  setState('Login');
                  clearFields();
                }}
                className="text-orange-300 cursor-pointer underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-400 text-center text-xs mt-4">
              Don&apos;t have an account?{' '}
              <span
                onClick={() => {
                  setState('Sign Up');
                  clearFields();
                }}
                className="text-orange-300 cursor-pointer underline"
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
