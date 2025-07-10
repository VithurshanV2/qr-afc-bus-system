import React from 'react';
import BottomNav from '../../components/BottomNav';
import { assets } from '../../assets/assets';

const Profile = () => {
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
          <button className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full hover:bg-yellow-300 transition">
            Verify email
          </button>
          <button className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full hover:bg-yellow-300 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
