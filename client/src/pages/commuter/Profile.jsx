import React, { useContext } from 'react';
import BottomNav from '../../components/BottomNav';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const { backendUrl, setUserData, setIsLoggedIn, setGlobalLoading } =
    useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      setGlobalLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/auth/send-verify-otp',
      );

      if (data.success) {
        navigate('/email-verify?redirectTo=/commuter/profile');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  const logout = async () => {
    try {
      setGlobalLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/auth/logout');

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="flex items-start mb-4">
        <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />
      </div>
      <div className="mt-6 max-w-md mx-auto shadow rounded-xl p-6 border border-gray-200">
        <h2 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
          Account Settings
        </h2>
        <div className="flex flex-col gap-4 mt-4">
          <button
            className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full hover:bg-yellow-300 transition"
            onClick={sendVerificationOtp}
          >
            Verify email
          </button>
          <button
            className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full hover:bg-yellow-300 transition"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
