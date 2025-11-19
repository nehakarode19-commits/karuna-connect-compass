import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import SchoolAuth from "./pages/school/SchoolAuth";
import SchoolOnboarding from "./pages/school/SchoolOnboarding";
import SchoolDashboard from "./pages/school/SchoolDashboard";
import SchoolEventSubmission from "./pages/school/SchoolEventSubmission";
import SchoolActivities from "./pages/school/SchoolActivities";
import SchoolSubmissions from "./pages/school/SchoolSubmissions";
import SchoolProfile from "./pages/school/SchoolProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSchools from "./pages/admin/AdminSchools";
import AdminActivity from "./pages/admin/AdminActivity";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSchoolApproval from "./pages/admin/AdminSchoolApproval";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminSubmissionReview from "./pages/admin/AdminSubmissionReview";
import AdminLeaderboard from "./pages/admin/AdminLeaderboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminActivityDetail from "./pages/admin/AdminActivityDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/school/auth" element={<SchoolAuth />} />
              <Route path="/school/onboarding" element={<SchoolOnboarding />} />
              <Route path="/school/dashboard" element={<SchoolDashboard />} />
              <Route path="/school/activities" element={<SchoolActivities />} />
              <Route path="/school/submissions" element={<SchoolSubmissions />} />
              <Route path="/school/profile" element={<SchoolProfile />} />
              <Route path="/school/submit/:eventId" element={<SchoolEventSubmission />} />
              <Route path="/school/submit-report" element={<SchoolActivities />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/school-approvals" element={<AdminSchoolApproval />} />
              <Route path="/admin/schools" element={<AdminSchools />} />
              <Route path="/admin/submissions" element={<AdminSubmissions />} />
              <Route path="/admin/submissions/:submissionId" element={<AdminSubmissionReview />} />
              <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
              <Route path="/admin/activity" element={<AdminActivity />} />
              <Route path="/admin/activity/:activityId" element={<AdminActivityDetail />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/donations" element={<AdminDonations />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
