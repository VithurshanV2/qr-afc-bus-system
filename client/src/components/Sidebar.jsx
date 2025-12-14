import React, { createContext, useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';

const SidebarContext = createContext();

const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true);

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

        <div className="border-t flex p-3">
          <img src="" alt="" className="w-10 h-10 rounded-md" />

          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'} `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">test</h4>
              <span className="text-xs text-gray-600">test@test.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

export const SidebarItem = ({ icon, text, active }) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <div>
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
            ${
              active
                ? 'bg-gradient-to-b-tr from-yellow-400 to-yellow-200 text-yellow-800'
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
      </li>
    </div>
  );
};
