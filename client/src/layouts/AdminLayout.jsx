import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { MapPinPlus, TicketCheck, UserPlus } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        <SidebarItem
          to="/admin/review-account-request"
          text="Account Requests"
          icon={<UserPlus size={20} />}
        />
        <SidebarItem
          to="/admin/route-management"
          text="Route Management"
          icon={<MapPinPlus size={20} />}
        />
        <SidebarItem
          to="/admin/ticket-verification"
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

export default AdminLayout;
