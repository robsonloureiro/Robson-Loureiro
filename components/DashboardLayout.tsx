import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background text-dark font-sans">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
