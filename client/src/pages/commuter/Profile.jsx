import React, { useContext, useState, useEffect } from 'react';
import BottomNav from '../../components/BottomNav';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Bus } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { backendUrl, userData, setUserData, setIsLoggedIn, setGlobalLoading } =
    useContext(AppContext);

  const [stats, setStats] = useState(null);
  const firstLetter = userData?.name?.[0]?.toUpperCase() || '';

  const fetchStats = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendUrl + '/api/user/profile-stats');

      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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

  const formatDate = (isDate) => {
    return new Date(isDate).toLocaleString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white min-h-[calc(100vh-4.4rem)] p-4">
      <div className="flex items-start mb-4">
        <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto space-y-4"
        >
          <div className="mt-6 shadow rounded-xl p-6 border border-gray-200">
            <h2 className="text-gray-900 text-2xl font-medium mb-4">Profile</h2>

            <div className="flex gap-4 mb-4">
              <div className="flex justify-center items-center w-14 h-14 rounded-full bg-black text-white font-semibold text-xl">
                {firstLetter}
              </div>
              <div className="flex-1">
                <p className="text-xl text-gray-900 font-semibold">
                  {userData?.name}
                </p>
                <p className="text-gray-700 text-sm">{userData?.email}</p>
                <p className="text-gray-700 text-sm">{userData?.number}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 mb-4">
              <p className="text-gray-500 text-xs">Member since</p>
              <p className="text-gray-700 text-sm">
                {formatDate(userData?.createdAt)}
              </p>
            </div>

            {stats && (
              <div className="pt-3 border-t border-gray-200">
                <h3 className="text-gray-900 text-lg font-medium mb-3">
                  Your Journey
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 text-sm">Total Trips</p>
                    <p className="text-3xl font-bold text-yellow-800">
                      {stats.totalTrips}
                    </p>
                  </div>

                  <Bus size={40} />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 mt-4">
              <button
                className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full hover:bg-yellow-300 
                transition-all duration-200 transform active:scale-95 active:shadow-lg"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Profile;
