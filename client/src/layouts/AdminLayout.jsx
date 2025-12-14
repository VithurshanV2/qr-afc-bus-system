import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { MapPinPlus, TicketCheck, UserPlus } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem text="Account Requests" icon={<UserPlus size={20} />} />
        <SidebarItem text="Route Management" icon={<MapPinPlus size={20} />} />
        <SidebarItem
          text="Ticket Verification"
          icon={<TicketCheck size={20} />}
        />
      </Sidebar>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
