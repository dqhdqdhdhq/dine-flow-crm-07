
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RealtimeProvider } from './context/RealtimeContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import NewReservation from './pages/NewReservation';
import Customers from './pages/Customers';
import CustomerProfile from './pages/CustomerProfile';
import EventCommandCenter from './pages/EventCommandCenter';
import Inventory from './pages/Inventory';
import Vendors from './pages/Vendors';
import FinancialHub from './pages/FinancialHub';
import FeedbackHub from './pages/FeedbackHub';
import Notes from './pages/Notes';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

function App() {
  return (
    <RealtimeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reservations">
              <Route index element={<Reservations />} />
              <Route path="new" element={<NewReservation />} />
            </Route>
            <Route path="customers">
              <Route index element={<Customers />} />
              <Route path=":id" element={<CustomerProfile />} />
            </Route>
            <Route path="events" element={<EventCommandCenter />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="finance" element={<FinancialHub />} />
            <Route path="feedback" element={<FeedbackHub />} />
            <Route path="notes" element={<Notes />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
      <SonnerToaster position="top-right" />
    </RealtimeProvider>
  );
}

export default App;
