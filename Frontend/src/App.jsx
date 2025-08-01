import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import Index from "./pages/user/Index.jsx";
import Results from "./pages/user/Results.jsx";
import HospitalProfile from "./pages/user/HospitalProfile.jsx";
import Signup from "./pages/auth/Signup.jsx";
import NotFound from "./pages/user/NotFound.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Login from "./pages/auth/Login.jsx";
import UserAppointments from "./pages/user/UserAppointments.jsx";
import ChatBot from "./components/common/ChatBot.jsx";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth(); 
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/fetch"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fetch/:id"
          element={
            <ProtectedRoute>
              <HospitalProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/get-appointments/:id"
          element={
            <ProtectedRoute>
              <UserAppointments />
            </ProtectedRoute>
          }
        />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Global ChatBot - Available on all pages for eligible users */}
      {isAuthenticated && user?.role !== "hospital" && <ChatBot />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;