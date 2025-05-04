
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
import Notes from "./pages/Notes";
import FeedbackPage from "./pages/Feedback";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
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
            <Route path="/reservations/new" element={<MainLayout><Reservations /></MainLayout>} /> {/* New route for adding reservations */}
            <Route path="/notes" element={<MainLayout><Notes /></MainLayout>} />
            <Route path="/feedback" element={<MainLayout><FeedbackPage /></MainLayout>} />
            <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
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
