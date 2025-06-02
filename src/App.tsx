
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { useConsent } from "@/hooks/useConsent";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Editor from "./pages/Editor";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ConsentModal from "./components/ConsentModal";
import { useThemeStore } from "./stores/useThemeStore";

const queryClient = new QueryClient();

const AppContent = () => {
  const updateEffectiveTheme = useThemeStore((state) => state.updateEffectiveTheme);
  const { hasShownModal } = useConsent();
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    // Initialize theme on app load
    updateEffectiveTheme();
  }, [updateEffectiveTheme]);

  useEffect(() => {
    // Show consent modal if user hasn't seen it yet
    if (!hasShownModal) {
      const timer = setTimeout(() => {
        setShowConsentModal(true);
      }, 1000); // Show after 1 second
      return () => clearTimeout(timer);
    }
  }, [hasShownModal]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/editor" element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        } />
        <Route path="/integrations" element={
          <ProtectedRoute>
            <Integrations />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ConsentModal 
        isOpen={showConsentModal} 
        onClose={() => setShowConsentModal(false)} 
      />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
