

import React, { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ConfirmationPage from './pages/ConfirmationPage';
import InicioPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AvailabilityPage from './pages/AvailabilityPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import ServicesPage from './pages/ServicesPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ClientsPage from './pages/ClientsPage';
import StatisticsPage from './pages/StatisticsPage';
import SupportPage from './pages/SupportPage';
import { initOneSignal } from './lib/oneSignal';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import AllProfessionalsPage from './pages/AllProfessionalsPage';

const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-white text-dark font-sans">
      <Header />
      <main className={`flex-grow ${isHomePage ? '' : 'container mx-auto px-4 py-8 pt-24'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  useEffect(() => {
    initOneSignal();
  }, []);

  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/professionals" element={<AllProfessionalsPage />} />
            <Route path="/profile/:professionalId" element={<ProfilePage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Route>
          
          {/* Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<InicioPage />} />
            <Route path="profile" element={<ProfileSettingsPage />} />
            <Route path="availability" element={<AvailabilityPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="stats" element={<StatisticsPage />} />
            <Route path="support" element={<SupportPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;