import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PublicNavbar from "./components/PublicNavbar";
import PublicFooter from "./components/PublicFooter";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Programs from "./pages/public/Programs";
import Contact from "./pages/public/Contact";
import Index from "./pages/Index";
import DemoLogin from "./pages/DemoLogin";
import SchoolAuth from "./pages/school/SchoolAuth";
import SchoolOnboarding from "./pages/school/SchoolOnboarding";
import SchoolDashboard from "./pages/school/SchoolDashboard";
import SchoolEventSubmission from "./pages/school/SchoolEventSubmission";
import SchoolActivities from "./pages/school/SchoolActivities";
import SchoolActivityDetail from "./pages/school/SchoolActivityDetail";
import SchoolSubmissions from "./pages/school/SchoolSubmissions";
import SchoolProfile from "./pages/school/SchoolProfile";
import SchoolStudents from "./pages/school/SchoolStudents";
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
import EvaluatorDashboard from "./pages/evaluator/EvaluatorDashboard";
import EvaluatorSubmissions from "./pages/evaluator/EvaluatorSubmissions";
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
            {/* Public Website Routes */}
            <Route path="/" element={
              <>
                <PublicNavbar />
                <Home />
                <PublicFooter />
              </>
            } />
            <Route path="/about" element={
              <>
                <PublicNavbar />
                <About />
                <PublicFooter />
              </>
            } />
            <Route path="/programs" element={
              <>
                <PublicNavbar />
                <Programs />
                <PublicFooter />
              </>
            } />
            <Route path="/contact" element={
              <>
                <PublicNavbar />
                <Contact />
                <PublicFooter />
              </>
            } />
            
            {/* Portal Routes */}
            <Route path="/old-home" element={<Index />} />
            <Route path="/demo" element={<DemoLogin />} />
            <Route path="/school/auth" element={<SchoolAuth />} />
              <Route path="/school/onboarding" element={<SchoolOnboarding />} />
              <Route path="/school/dashboard" element={<SchoolDashboard />} />
              <Route path="/school/activities" element={<SchoolActivities />} />
              <Route path="/school/activity/:activityId" element={<SchoolActivityDetail />} />
              <Route path="/school/submissions" element={<SchoolSubmissions />} />
              <Route path="/school/profile" element={<SchoolProfile />} />
              <Route path="/school/students" element={<SchoolStudents />} />
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
              <Route path="/evaluator/dashboard" element={<EvaluatorDashboard />} />
              <Route path="/evaluator/submissions" element={<EvaluatorSubmissions />} />
              <Route path="/evaluator/leaderboard" element={<AdminLeaderboard />} />
              <Route path="/evaluator/schools" element={<AdminSchools />} />
              <Route path="/evaluator/students" element={<AdminStudents />} />
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
