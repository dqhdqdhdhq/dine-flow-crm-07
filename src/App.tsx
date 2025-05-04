
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RealtimeProvider } from "./context/RealtimeContext";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import Reservations from "./pages/Reservations";
import NewReservation from "./pages/NewReservation";
import Notes from "./pages/Notes";
import FeedbackPage from "./pages/Feedback";
import FeedbackHub from "./pages/FeedbackHub";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Inventory from "./pages/Inventory";
import Vendors from "./pages/Vendors";
import FinancialHub from "./pages/FinancialHub";
import EventCommandCenter from "./pages/EventCommandCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RealtimeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/customers" element={<MainLayout><Customers /></MainLayout>} />
            <Route path="/customers/:id" element={<MainLayout><CustomerProfile /></MainLayout>} />
            <Route path="/reservations" element={<MainLayout><Reservations /></MainLayout>} />
            <Route path="/reservations/new" element={<MainLayout><NewReservation /></MainLayout>} />
            <Route path="/inventory" element={<MainLayout><Inventory /></MainLayout>} />
            <Route path="/vendors" element={<MainLayout><Vendors /></MainLayout>} />
            <Route path="/notes" element={<MainLayout><Notes /></MainLayout>} />
            <Route path="/feedback" element={<MainLayout><FeedbackPage /></MainLayout>} />
            <Route path="/feedback-hub" element={<MainLayout><FeedbackHub /></MainLayout>} />
            <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
            <Route path="/events" element={<MainLayout><EventCommandCenter /></MainLayout>} />
            <Route path="/financial-hub" element={<MainLayout><FinancialHub /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </RealtimeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
