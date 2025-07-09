import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const CommuterLayout = () => {
  return (
    <div className="flex flex-col min-h-screen text-shadow-white">
      <div className="flex-grow overflow-y-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default CommuterLayout;
