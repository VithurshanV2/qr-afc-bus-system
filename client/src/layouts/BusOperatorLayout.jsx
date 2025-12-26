import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { Bus, ChartLine, TicketCheck } from 'lucide-react';

const BusOperatorLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        <SidebarItem
          to="/bus-operator/trip-management"
          text="Trip Management"
          icon={<Bus size={20} />}
        />
        <SidebarItem
          to="/bus-operator/revenue"
          text="Revenue"
          icon={<ChartLine size={20} />}
        />
        <SidebarItem
          to="/bus-operator/ticket-verification"
          text="Ticket Verification"
          icon={<TicketCheck size={20} />}
        />
      </Sidebar>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default BusOperatorLayout;
