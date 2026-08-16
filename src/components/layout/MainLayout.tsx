import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavBar } from './TopNavBar';
import { SideNavBar } from './SideNavBar';

export const MainLayout: React.FC = () => {
  return (
    <>
      <TopNavBar />
      
      {/* Layout Container */}
      <div className="flex h-screen pt-16">
        <SideNavBar />
        
        {/* Main Content Area (The Canvas) */}
        <main className="flex-1 md:ml-64 relative z-10 overflow-y-auto p-margin-mobile md:p-margin-desktop scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </>
  );
};
