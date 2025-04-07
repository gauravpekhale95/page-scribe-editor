
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./store/useStore";
import { useOktaAuth } from '@okta/okta-react';

// Pages
import LoginPage from "./pages/LoginPage";
import OktaRedirectPage from "./pages/OktaRedirectPage";
import StatesListPage from "./pages/StatesListPage";
import DocumentListPage from "./pages/DocumentListPage";
import VersionListPage from "./pages/VersionListPage";
import PageListPage from "./pages/PageListPage";
import PageEditorPage from "./pages/PageEditorPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  const { authState } = useOktaAuth();
  
  if (!authState?.isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/redirect" element={<OktaRedirectPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <AuthGuard>
              <StatesListPage />
            </AuthGuard>
          } />
          
          <Route path="/states/:state" element={
            <AuthGuard>
              <DocumentListPage />
            </AuthGuard>
          } />
          
          <Route path="/documents/:documentId" element={
            <AuthGuard>
              <VersionListPage />
            </AuthGuard>
          } />
          
          <Route path="/versions/:versionId/pages" element={
            <AuthGuard>
              <PageListPage />
            </AuthGuard>
          } />
          
          <Route path="/pages/:pageId/editor" element={
            <AuthGuard>
              <PageEditorPage />
            </AuthGuard>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminGuard>
              <AdminPage />
            </AdminGuard>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
