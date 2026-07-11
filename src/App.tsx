import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute';
import { MainLayout } from '@/components/layouts/MainLayout';
import { ToastContainer } from '@/components/ui/Toast';
import { LandingPage } from '@/pages/LandingPage';
import AboutPage from '@/pages/About';
import BlogPage from '@/pages/Blog';
import CareersPage from '@/pages/Careers';
import PrivacyPage from '@/pages/Privacy';
import TermsPage from '@/pages/Terms';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { TasksPage } from '@/pages/TasksPage';
import { KanbanPage } from '@/pages/KanbanPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { TimelinePage } from '@/pages/TimelinePage';
import { TeamPage } from '@/pages/TeamPage';
import { ActivityPage } from '@/pages/ActivityPage';
import { FilesPage } from '@/pages/FilesPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ROUTES } from '@/constants';

export default function App() {
  return (
    <ReactLenis root options={{ autoRaf: true }}>
      <BrowserRouter>
        <ScrollToTop />
        <ToastProvider>
          <AuthProvider>
            <AppProvider>
              <Routes>
                <Route path={ROUTES.LANDING} element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/privacy-policy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path={ROUTES.LOGIN} element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
                <Route path={ROUTES.REGISTER} element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                  <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
                  <Route path={ROUTES.PROJECT_DETAIL} element={<ProjectDetailPage />} />
                  <Route path={ROUTES.TASKS} element={<TasksPage />} />
                  <Route path={ROUTES.KANBAN} element={<KanbanPage />} />
                  <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
                  <Route path={ROUTES.TIMELINE} element={<TimelinePage />} />
                  <Route path={ROUTES.TEAM} element={<TeamPage />} />
                  <Route path={ROUTES.ACTIVITY} element={<ActivityPage />} />
                  <Route path={ROUTES.FILES} element={<FilesPage />} />
                  <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
                  <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
                  <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                  <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <ToastContainer />
            </AppProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ReactLenis>
  );
}
