import React, { useState } from 'react';
import { House, ScanQrCode, Ticket, UserCircle2, Wallet } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      name: 'Home',
      icon: <House />,
      path: '/',
    },
    {
      name: 'Ticket',
      icon: <Ticket />,
      path: '/commuter/ticket',
    },
    {
      name: 'Scan',
      icon: <ScanQrCode />,
      path: '/commuter/scan',
    },
    {
      name: 'Wallet',
      icon: <Wallet />,
      path: '/commuter/wallet',
    },
    {
      name: 'Profile',
      icon: <UserCircle2 />,
      path: '/commuter/profile',
    },
  ];

  const activeIndex = menus.findIndex(
    (menu) => menu.path === location.pathname,
  );

  const [animatedIndex, setAnimatedIndex] = useState(activeIndex);

  useEffect(() => {
    if (activeIndex !== -1 && activeIndex !== animatedIndex) {
      setAnimatedIndex(activeIndex);
    }
  }, [activeIndex, animatedIndex]);

  const handleClick = (index, path) => {
    if (index !== animatedIndex) {
      setAnimatedIndex(index);
    }
    navigate(path);
  };

  return (
    <div className="bg-gray-300 max-h-[4.4rem] px-6 rounded-t-xl fixed bottom-0 left-0 right-0 z-50 shadow-md">
      <ul className="flex relative w-full">
        <span
          className="bg-yellow-400 border-4 border-white h-16 absolute rounded-full duration-500 -top-5 z-0"
          style={{
            width: `${100 / menus.length}%`,
            transform: `translateX(${animatedIndex * 100}%)`,
          }}
        >
          <span className="w-3.5 h-3.5 bg-transparent absolute top-4 -left-[18px] rounded-tr-[11px] shadow-bottom-navbar-left"></span>
          <span className="w-3.5 h-3.5 bg-transparent absolute top-4 -right-[18px] rounded-tl-[11px] shadow-bottom-navbar-right"></span>
        </span>
        {menus.map((menu, index) => (
          <li key={index} className="flex-1 text-center">
            <a
              className="flex flex-col items-center pt-6"
              onClick={() => handleClick(index, menu.path)}
            >
              <span
                className={`text-xl z-10 cursor-pointer duration-500 ${index === activeIndex && '-mt-6'}`}
              >
                {menu.icon}
              </span>
              <span
                className={`duration-700 ${
                  activeIndex === index
                    ? 'translate-y-4 opacity-100'
                    : 'opacity-0 translate-y-10'
                } `}
              >
                {menu.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BottomNav;
