import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Landing";
import EmployerLogin from "./pages/EmployerLogin";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployerRegister from "./pages/EmployerRegister";
import EmployerDashboard from "./pages/EmployerDashboard";
import WorkerDetail from "./pages/WorkerDetail";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import RequireEmployee from "./components/RequireEmployee.tsx";
import RequireEmployer from "./components/RequireEmployer.tsx";
import NotFound from "./pages/NotFound.tsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="/employer-login" element={<EmployerLogin />} />
          <Route path="/employer-register" element={<EmployerRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/employer" element={<RequireEmployer><EmployerDashboard /></RequireEmployer>} />
          <Route path="/employee/:id" element={<WorkerDetail />} />
          <Route path="/employee" element={<RequireEmployee><EmployeeDashboard /></RequireEmployee>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
