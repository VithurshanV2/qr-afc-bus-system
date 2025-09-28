import React from 'react';
import { Outlet } from 'react-router-dom';

const CommuterLayout = () => {
  return (
    <div className="relative min-h-screen pb-[4.5rem]">
      <Outlet />
    </div>
  );
};

export default CommuterLayout;
