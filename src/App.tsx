
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";
import { useThemeStore } from "./stores/useThemeStore";

const queryClient = new QueryClient();

const App = () => {
  const updateEffectiveTheme = useThemeStore((state) => state.updateEffectiveTheme);

  useEffect(() => {
    // Initialize theme on app load
    updateEffectiveTheme();
  }, [updateEffectiveTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/help" element={<Help />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
