import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const CommuterLayout = () => {
  return (
    <div className="relative min-h-screen pb-[4.5rem]">
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default CommuterLayout;
