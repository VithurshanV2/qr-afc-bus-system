import React, { createContext, useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SidebarContext = createContext();

const Sidebar = ({ children }) => {
  const { userData, setIsLoggedIn, setUserData, setGlobalLoading, backendUrl } =
    useContext(AppContext);
  const [expanded, setExpanded] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const firstLetter = userData?.name?.[0]?.toUpperCase() || '';

  const navigate = useNavigate();

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
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={assets.logo}
            alt="logo"
            className={`overflow-hidden transition-all ${expanded ? 'w-40' : 'w-0'}`}
          />
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="relative border-t flex p-3">
          <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white font-semibold">
            {firstLetter}
          </div>

          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'} `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{userData?.name}</h4>
              <span className="text-xs text-gray-600">{userData?.email}</span>
            </div>

            <div onClick={toggleDropdown} className="cursor-pointer">
              <MoreVertical size={20} />
            </div>
          </div>

          {isDropdownOpen && (
            <ul className="absolute right-3 bottom-full mb-2 bg-gray-200 rounded shadow-lg text-sm w-36 z-50">
              <li
                onClick={logout}
                className="px-4 py-2 hover:bg-gray-300 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

export const SidebarItem = ({ icon, text, to }) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <NavLink
      to={to}
      className={({
        isActive,
      }) => `relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
            ${
              isActive
                ? 'bg-yellow-400 text-yellow-800'
                : 'hover:bg-yellow-400 text-gray-600'
            }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}
      >
        {text}
      </span>

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-yellow-200 text-yellow-800 text-sm
                invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </NavLink>
  );
};
