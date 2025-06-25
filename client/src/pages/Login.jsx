import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {
        if (!isPasswordValid(password)) {
          toast.error(
            'Password must be at least 8 characters and include uppercase, lowercase, and a number',
          );
          return;
        }

        const { data } = await axios.post(backendUrl + '/api/auth/register', {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
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
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
  };

  const clearFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-6 sm:px-0
        bg-gradient-to-br from-yellow-200 to-orange-400"
    >
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-32 sm:w-48 cursor-pointer"
      />
      <div className="bg-dark-bg p-10 rounded-lg shadow-lg w-full sm:w-96 text-yellow-300 text-sm">
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
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 
                    text-white font-medium"
          >
            {state}
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
  );
};

export default Login;
