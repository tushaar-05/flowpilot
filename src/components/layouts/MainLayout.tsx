import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/cn';
import { Spinner } from '@/components/ui/Spinner';
import { CommandPalette } from '@/components/ui/CommandPalette';

export function MainLayout() {
  const { loading, sidebarOpen } = useApp();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-5 text-base font-extrabold text-muted">Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 min-h-screen',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-[76px]'
        )}
      >
        <Navbar />
        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
