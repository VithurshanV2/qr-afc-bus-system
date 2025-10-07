import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { backendUrl, userData, setUserData, setIsLoggedIn, setGlobalLoading } =
    useContext(AppContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
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
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />

      {userData ? (
        userData.role !== 'COMMUTER' && (
          <div
            className="flex justify-center items-center w-8 h-8 rounded-full bg-black text-white relative sm:group"
            onClick={toggleDropdown}
          >
            {userData.name[0].toUpperCase()}
            <div
              className={`absolute ${
                isDropdownOpen ? 'block' : 'hidden'
              } sm:group-hover:block top-0 right-0 z-10 text-black rounded pt-10`}
            >
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                <li
                  onClick={logout}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        )
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.right_arrow_icon} alt="right arrow icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
