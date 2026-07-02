import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import PageWrapper from './layouts/PageWrapper';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';

// Code-split routes — each page is a separate chunk (Lighthouse optimization)
const HomePage = lazy(() => import('./pages/HomePage'));
const RoomsPage = lazy(() => import('./pages/RoomsPage'));
const DiningPage = lazy(() => import('./pages/DiningPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

// TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

// Page-level loading skeleton
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
        <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
          LOADING
        </span>
      </div>
    </div>
  );
}

// Inner component that runs checkAuth after BrowserRouter mounts
function AppRoutes() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  // Attempt silent token refresh on every app mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/rooms" element={<PageWrapper><RoomsPage /></PageWrapper>} />
        <Route path="/dining" element={<PageWrapper><DiningPage /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper><GalleryPage /></PageWrapper>} />

        {/* Auth pages — no navbar/footer, no floating bar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Booking — public (guests can book without account) */}
        <Route
          path="/book"
          element={
            <PageWrapper noFloatingBar>
              <BookingPage />
            </PageWrapper>
          }
        />

        {/* Admin — protected, admin-only */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly>
              <PageWrapper noFloatingBar>
                <AdminDashboard />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
